import re
from django.http import JsonResponse
from django.views import View
import requests
import google.generativeai as genai
from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.decorators import api_view, permission_classes
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.db.models import Avg
from .serializers import *
from .models import *
import re
import uuid
import boto3
import json
from django.conf import settings
from django.contrib.gis.db.models.functions import Distance
from django.contrib.gis.measure import D
from django.contrib.gis.geos import Point
from django.db.models import F

def configure_genai():
    genai.configure(api_key="AIzaSyBmpmK6zt4fKRK_3j-XsFQl6IG3wCaIX6A")
    return genai.GenerativeModel(
        model_name="gemini-1.0-pro",
        generation_config={
            "temperature": 0.2,
            "top_p": 1,
            "top_k": 1,
            "max_output_tokens": 100,
        }
    )


@method_decorator(csrf_exempt, name='dispatch')  
class CalculateCarbonEmissions(View):

    def post(self, request):
        print(request.body)
        data = request.POST
        current_location = data.get('current_location')
        destination = data.get('destination')

        if not current_location or not destination:
            data = json.loads(request.body)
            current_location = data.get('current_location')
            destination = data.get('destination')
            # return JsonResponse({'error': 'Current location and destination are required.'}, status=400)

        try:
            # Call Gemini API to get routes
            # routes = self.get_routes(current_location, destination)
            # distances = []

            # for route in routes:
            #     distance = self.calculate_distance(route)
            #     carbon_emission = self.calculate_carbon_emission(distance)
            #     distances.append({
            #         'route': route,
            #         'distance': distance,
            #         'carbon_emission': carbon_emission
            #     })
            gemini_classes = GeminiApi(
                current_location = current_location,
                destination = destination
            )
            distances = gemini_classes.generate_routes()
            return JsonResponse({'routes': distances}, status=200)

        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

class GeminiApi:
    def __init__(self, **kwargs):
        self.api_key = "AIzaSyDOZOs944cLSNisnYkeVKpkHlpwjEy_NmY"
        genai.configure(api_key=self.api_key)
        self.destination = kwargs.get('destination', None)
        self.current_location = kwargs.get('current_location', None)
        self.filter = kwargs.get('filter', 'carbon emission')

        if not self.destination or not self.current_location:
            raise ValueError("Destination and current location must be provided.")

    def parse_distance(self, distance_str):
        distance_cleaned = re.sub(r'[^\d.]', '', distance_str)
        return float(distance_cleaned) if distance_cleaned else 0.0

    def calculate_travel_cost(self, distance, vehicle):
        # Define costs per kilometer for various vehicle types
        vehicle_costs = {
            "train": 1.5,  # Example cost per km for train
            "car": 3,      # Example cost per km for car
            "bus": 1.2,    # Example cost per km for bus
            "plane": 5     # Example cost per km for plane
        }
        # Default cost if the vehicle type is unknown
        cost_per_km = vehicle_costs.get(vehicle.lower(), 2)
        return round(distance * cost_per_km, 2)

    def calculate_carbon_emission(self, distance, vehicle):
        # Define average CO2 emissions in grams per kilometer for various vehicle types
        emission_factors = {
            "train": 41,  # g CO2/km for train
            "car": 120,   # g CO2/km for car
            "bus": 68,    # g CO2/km for bus
            "plane": 285  # g CO2/km for plane
        }
        # Get emission factor for the vehicle type, defaulting to 100 g CO2/km if unknown
        emission_factor = emission_factors.get(vehicle.lower(), 100)
        total_emission = (distance * emission_factor) / 1000  # Convert to kg
        return round(total_emission, 2)  # Return in kg
    def generate_routes(self):
        generation_config = {
            "temperature": 0.7,
            "top_p": 1,
            "top_k": 1,
            "max_output_tokens": 1000,
        }

        model = genai.GenerativeModel(
            model_name="gemini-1.0-pro",
            generation_config=generation_config
        )

        prompt = (
            f"Generate 4 shortest routes from {self.current_location} to {self.destination}, considering the carbon footprint. "
            "For each route, provide the following details:\n"
            "- Route description (format: 'City1-City2-City3')\n"
            "- Latitude and Longitude for each city (format: {'City1': {'latitude': value, 'longitude': value}, 'City2': {'latitude': value, 'longitude': value}, 'City3': {'latitude': value, 'longitude': value}\})\n"
            "- Estimated Carbon Footprint\n"
            "- Distance in kilometers\n"
            "- Recommended traveling vehicle (options: train, car, bus, plane)\n"
            "- Estimated cost of travel\n"
            "Format each route with a 'Route: ' prefix and ensure the details are structured clearly."
        )

        try:
            response = model.generate_content(prompt)
        except Exception as e:
            print(f"Error generating routes: {e}")
            return []

        # print(response)

        routes = []
        route_texts = response.candidates[0].content.parts[0].text.strip().split('\n\n')  # Split on double newlines

        for route_text in route_texts:
            lines = route_text.strip().split('\n')
            print(lines)
            if "Route" in lines[0]:
                try:
                    # print(lines)
                    route_description = lines[1].replace("- Route: ", "").replace("- Route Description: ","").replace("- Route description: ","").replace(" -","").strip()
                    # Assuming latitude and longitude are on the second line
                    print(lines[1],lines[2],lines[3])
                    lat_lon_info = lines[2].replace("- Coordinates:", "").replace("- Latitude and Longitude:","").replace("- Cities:","").replace("-","").strip()
                    carbon_footprint = lines[3].replace("Estimated Carbon Footprint:", "".replace("-","")).strip()
                    distance_str = lines[4].replace("Distance in kilometers:", "").replace("-","").strip()
                    vehicle = lines[5].replace("Recommended traveling vehicle:", "").replace("- Recommended traveling vehicle: ","").replace("-","").strip()
                    estimated_cost = lines[6].replace("Estimated cost of travel:", "").replace("-","").strip()

                    # Extract latitude and longitude
                    # print(lat_lon_info)
                    try:
                        lat_lon_dict = eval(lat_lon_info)  
                    except:
                        lat_lon_info = lines[3].replace("- Coordinates:", "").replace("- Latitude and Longitude:","").replace("- Cities:","").replace("-","").strip()
                        carbon_footprint = lines[4].replace("Estimated Carbon Footprint:", "").strip()
                        distance_str = lines[5].replace("Distance in kilometers:", "").replace("-","").strip()
                        vehicle = lines[6].replace("Recommended traveling vehicle:", "").replace("- Recommended traveling vehicle: ","").replace("-","").strip()
                        estimated_cost = lines[7].replace("Estimated cost of travel:", "").replace("-","").strip()
                        lat_lon_dict = eval(lat_lon_info)  

                    # print(lat_lon_dict)# Use eval carefully; ensure safe input!
                    # lat_lon = {'City': lat_lon_dict[city] for city in lat_lon_dict}
                    lat_lon = {}
                    count = 0
                    for city in lat_lon_dict:
                        count += 1
                        # lat_lon.add(f'CITY {count}', lat_lon_dict[city])
                        lat_lon[f'City_{count}'] = lat_lon_dict[city]
                    distance = self.parse_distance(distance_str)
                    cost = self.calculate_travel_cost(distance, vehicle)
                    carbon_emission = self.calculate_carbon_emission(distance, vehicle)
                    # for i in ['car','train','']
                    routes.append({
                        'route': route_description,
                        'latitude_longitude': lat_lon,
                        'carbon_footprint': carbon_footprint.replace("-","").strip(),
                        'distance': f"{distance} km",
                        'vehicle': vehicle,
                        'estimated_cost': cost,
                        'carbon_emission': f"{carbon_emission} kg CO2"
                    })
                except (IndexError, ValueError) as e:
                    print(f"Error parsing route details: {e}, skipping this route.")

        return routes

@api_view(['GET'])
@permission_classes([AllowAny])  # Allow any user to access this endpoint
def get_or_filter_places(request):
    place_id = request.GET.get('id')
    queryset = Location.objects.all()

    if place_id:
        try:
            location = queryset.get(id=place_id)
            serializer = GetLocationSerializer(location)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Location.DoesNotExist:
            return Response({"detail": "Location not found."}, status=status.HTTP_404_NOT_FOUND)

    # Get query parameters from the request for filtering
    name = request.GET.get('name', None)
    city = request.GET.get('city', None)
    rating = request.GET.get('rating', None)
    min_rating = request.GET.get('min_rating', None)
    max_rating = request.GET.get('max_rating', None)
    min_price = request.GET.get('min_price', None)
    max_price = request.GET.get('max_price', None)

    # Apply filters if query parameters are provided
    if name:
        queryset = queryset.filter(name__icontains=name)  # Case-insensitive contains
    if city:
        queryset = queryset.filter(city__icontains=city)  # Case-insensitive contains
    if rating:
        queryset = queryset.filter(rating=rating)  # Exact rating match
    if min_rating:
        queryset = queryset.filter(rating__gte=int(min_rating))  # Greater than or equal to min_rating
    if max_rating:
        queryset = queryset.filter(rating__lte=int(max_rating))  # Less than or equal to max_rating

    # Filter based on price range
    if min_price or max_price:
        def extract_price(price_string):
            return int(re.sub(r'[^\d]', '', price_string))  # Remove non-numeric characters and convert to int

        filtered_queryset = []
        for location in queryset:
            if location.price_range:
                price = extract_price(location.price_range)
                if min_price and price < int(min_price):
                    continue
                if max_price and price > int(max_price):
                    continue
                filtered_queryset.append(location)
        queryset = filtered_queryset

    serializer = GetLocationSerializer(queryset, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([AllowAny])
def create_location(request):
    # Check if 'images' is in request files
    if 'images' not in request.FILES:
        return Response({"error": "At least one image file is required"}, status=status.HTTP_400_BAD_REQUEST)

    user = request.user  # The authenticated user creating the location
    images = request.FILES.getlist('images')  # Get the list of uploaded images

    try:
        # Initialize S3 client
        s3 = boto3.client('s3',
            aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
            aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
            region_name=settings.AWS_S3_REGION_NAME
        )

        image_urls = []  # List to store the URLs of uploaded images

        for image in images:
            # Generate a unique filename for each image
            image_filename = f"locations/{uuid.uuid4()}_{image.name}"

            # Upload the image to S3
            s3.upload_fileobj(image, settings.AWS_STORAGE_BUCKET_NAME, image_filename)

            # Construct the public URL for the uploaded image
            image_url = f"https://{settings.AWS_STORAGE_BUCKET_NAME}.s3.{settings.AWS_S3_REGION_NAME}.amazonaws.com/{image_filename}"
            image_urls.append(image_url)  # Append the URL to the list

        # Create the location instance with the provided data
        location_instance = Location.objects.create(
            name=request.data.get('name', ''),
            description=request.data.get('description', ''),
            country=request.data.get('country', ''),
            city=request.data.get('city', ''),
            latitude=request.data.get('latitude', 0.0),
            longitude=request.data.get('longitude', 0.0),
            phone_number=request.data.get('phone_number', ''),
            email=request.data.get('email', ''),
            website=request.data.get('website', ''),
            rating=request.data.get('rating', 0.0),
            star=request.data.get('star', 0),
            price_range=request.data.get('price_range', ''),
            amenities=request.data.get('amenities', ''),
        )

        # Optionally, you can save the image URLs to the location instance
        location_instance.images = image_urls  # Assuming you have a field to store image URLs
        location_instance.save()  # Save the location instance with the new images

        serializer = LocationSerializer(location_instance)
        return Response({"message": "Location created successfully", "location": serializer.data}, status=status.HTTP_201_CREATED)

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

from .serializers import BookingSerializer
from django.db import transaction as db_transaction

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def booking_list(request):
    user = request.user
    pro = Profile.objects.get(user=user)
    bookings = Bookings.objects.filter(user=pro)
    serializer = GetBookingSerializer(bookings, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([AllowAny])
def get_product(request):
    try:
        product_id = request.GET.get('product_id')
        if product_id:
            product = Product.objects.get(id=product_id)
            serializer = ProductSerializer(product)
            return Response(serializer.data, status=200)
        else:
            products = Product.objects.all()
            serializer = ProductSerializer(products, many=True)
            return Response(serializer.data, status=200)

    except Product.DoesNotExist:
        return Response({'error': 'Product not found.'}, status=404)

    except Exception as e:
        return Response({'error': str(e)}, status=500)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_transaction(request):
    user = request.user

    try:
        # Attempt to get the user's profile
        profile = Profile.objects.get(user=user)
    except Profile.DoesNotExist:
        return Response({'error': 'Profile not found.'}, status=404)

    try:
        # Fetch the user's transactions
        transactions = Transaction.objects.filter(user=profile)
        if not transactions.exists():
            return Response({'message': 'No transactions found for this user.'}, status=404)

        serializer = TransactionSerializer(transactions, many=True)
        return Response(serializer.data, status=200)

    except Exception as e:
        # Catch any other exceptions and return a server error response
        return Response({'error': str(e)}, status=500)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def redeem_coupon(request):
    user = request.user
    pro_id = request.data.get('pro_id')

    try:
        coupon = Product.objects.get(id=pro_id)
    except Product.DoesNotExist:
        return Response({'error': 'Invalid or expired coupon code.'}, status=status.HTTP_400_BAD_REQUEST)

    profile = Profile.objects.get(user=user)

    # Update user's credit balance
    balance_before = profile.credit_coins
    profile.credit_coins -= coupon.worth
    profile.save()

    # Create transaction record
    Transaction.objects.create(
        user=profile,
        transaction_type='0',  # Credit transaction
        amount=coupon.worth,
        balance_before=balance_before,
        balance_after=profile.credit_coins,
        description=f'Redeemed coupon: {coupon.title}, Added {coupon.worth} credits.'
    )

    coupon.save()

    return Response({'message': 'Coupon redeemed successfully.', 'new_balance': profile.credit_coins}, status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def donation(request):
    user = request.user
    profile = Profile.objects.get(user=user)
    payment_id = request.data.get('payment_id')
    place_id = request.data.get('place_id')
    message = request.data.get('message')
    amount = request.data.get('amount')

    Transaction.objects.create(
        user=profile,
        transaction_type='2',
        amount=amount,
        balance_before=profile.credit_coins,
        balance_after=profile.credit_coins,
        payment_id=payment_id, 
        description=message,
    )

    return Response({'message': 'Coupon redeemed successfully.', 'new_balance': profile.credit_coins}, status=status.HTTP_201_CREATED)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_booking(request):
    user = request.user
    carbon_footprint = request.data.get('carbon_footprint')
    price = request.data.get('price')
    place_id = request.data.get('place_id')

    if carbon_footprint is None or price is None or place_id is None:
        return Response({'error': 'carbon_footprint, price, and place_id are required fields.'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        profile = Profile.objects.get(user=user)
    except Profile.DoesNotExist:
        return Response({'error': 'Profile not found.'}, status=status.HTTP_404_NOT_FOUND)

    mutable_data = request.data.copy()
    mutable_data['place'] = place_id
    mutable_data['user'] = profile.id
    mutable_data['price'] = price

    with db_transaction.atomic():
        serializer = BookingSerializer(data=mutable_data)
        if serializer.is_valid():
            booking = serializer.save()

            credits_to_add = calculate_credits(int(carbon_footprint))
            Transaction.objects.create(
                user=profile,
                transaction_type='1',
                amount=credits_to_add,
                balance_before=profile.credit_coins,
                balance_after=profile.credit_coins + credits_to_add,
                description=f'Added {credits_to_add} credits for booking with carbon footprint {carbon_footprint}.'
            )
            profile.credit_coins += credits_to_add
            profile.save()

            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

def calculate_credits(carbon_footprint):
    if carbon_footprint < 100:
        return carbon_footprint * 3
    elif carbon_footprint < 200:
        return carbon_footprint * 2
    else:
        return carbon_footprint * 0.5

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def review_view(request):
    try:
        user = request.user
        profile = Profile.objects.get(user=user)
        place_id = request.data.get('place_id')
        review = request.data.get('review')
        if not place_id:
            return Response({'error': 'Place ID is required'}, status=status.HTTP_400_BAD_REQUEST)
        # places = Places.objects.get(id=place_id)
        mutable_data = request.data.copy()
        mutable_data['place'] = place_id 
        mutable_data['user'] = profile.id
        mutable_data['review'] = review
        # print(mutable_data)
        serializer = ReviewSerializer(data=mutable_data)
        if serializer.is_valid():
            serializer.save()
            rating_avg = Reviews.objects.filter(place=place_id).aggregate(Avg('rating'))['rating__avg']
            place = Location.objects.get(id=place_id)
            place.rating = rating_avg if rating_avg is not None else 0
            place.save()
            # print(serializer.data)
            return Response({'message': 'Review saved successfully'}, status=status.HTTP_201_CREATED) 
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_reviews(request):
    try:
        place_id = request.GET.get('place_id')
        if not place_id:
            user = request.user.id
            profile = Profile.objects.get(user=user)
            reviews = Reviews.objects.filter(user=profile)
            serializer = GetReviewSerializer(reviews, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            reviews = Reviews.objects.filter(place=place_id)
            serializer = GetReviewSerializer(reviews, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
    except Reviews.DoesNotExist:
        return Response({'message': 'Reviews not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def get_near_by_destination(request):
    try:
        # Load coordinates from request body
        coordinates = request.data
        # if isinstance(coordinates, str):
        #     coordinates = json.loads(coordinates)
        print(coordinates)

        latitude = float(coordinates.get('latitude'))
        longitude = float(coordinates.get('longitude'))

        # Ensure latitude and longitude are provided
        if latitude is None or longitude is None:
            return JsonResponse({'error': 'Latitude and Longitude are required.'}, status=400)

        # Convert latitude and longitude to float
        try:
            latitude = float(latitude)
            longitude = float(longitude)
        except ValueError:
            return JsonResponse({'error': 'Latitude and Longitude must be valid numbers.'}, status=400)

        # Create a point from latitude and longitude
        user_location = Point(longitude, latitude, srid=4326)
        print(f"User Location: {user_location}")

        # Fetch locations within a 50 km radius
        # nearby_locations = Location.objects.annotate(
        #     distance=Distance(
        #         Point(F('longitude'),F('latitude')),  # Create Point from fields
        #         user_location
        #     )
        # ).filter(distance__lte=D(km=50)).order_by('distance')
        nearby_locations = Location.objects.all()
        nearby_locations_new = []

        # Iterate through all locations and calculate distance
        for loc in nearby_locations:
            print(user_location)
            location_point = Point(loc.longitude, loc.latitude, srid=4326)
            print(location_point)
            distance = user_location.distance(location_point) * 100  # Get distance in meters
            distance_km = distance   # Convert to kilometers
            print(distance)
            
            print(f"Distance to {loc.name}: {distance_km} km")

            # Add location to new list if within 50 km
            if distance_km <= 50:
                nearby_locations_new.append(loc)
        serializer = GetLocationSerializer(nearby_locations_new, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK) 

    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON format.'}, status=400)
    except Location.DoesNotExist:
        return JsonResponse({'error': 'No locations found.'}, status=404)
    except Exception as e:
        print(f"Exception: {e}")  # Print the exception for debugging
        return JsonResponse({'error': str(e)}, status=500)
