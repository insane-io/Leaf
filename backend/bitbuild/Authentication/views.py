from rest_framework.permissions import AllowAny,IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from .serializers import UserSerializer,LoginSerializer, UserProfileSerializer
from django.views.decorators.csrf import csrf_exempt
from .models import User,Profile
from django.http import JsonResponse
import json

# @api_view(['POST'])
# @permission_classes([AllowAny])
# def calculate_carbon_footprint(request):
#     try:
#         # Extract data from the request and convert to appropriate types
#         distance_traveled = float(request.POST.get('distance_traveled', 0))  # Convert to float
#         transport_mode = request.POST.get('transport_mode')
#         number_of_people = int(request.POST.get('number_of_people', 1))  # Convert to int

#         # Emission factors (kg CO2 per km)
#         transport_emission_factors = {
#             'car': 0.12,
#             'bus': 0.05,
#             'train': 0.04,
#             'flight': 0.25, 
#             'long_flight': 0.15, 
#             'ev': 0.03,
#             'rickshaw': 0.1,
#             'two_wheeler': 0.08,
#             'van': 0.1,
#         }

#         # Check if the transport mode is valid
#         if transport_mode not in transport_emission_factors:
#             return JsonResponse({'error': 'Invalid transport mode'}, status=400)

#         # Calculate emissions
#         transport_emissions = distance_traveled * transport_emission_factors[transport_mode]

#         total_emissions = transport_emissions

#         # Calculate per person emissions
#         per_person_emissions = total_emissions / number_of_people if number_of_people else total_emissions

#         response_data = {
#             'total_emissions': total_emissions,
#             'per_person_emissions': per_person_emissions,
#         }

#         return JsonResponse(response_data)

#     except ValueError as ve:
#         return JsonResponse({'error': str(ve)}, status=400)
#     except Exception as e:
#         return JsonResponse({'error': str(e)}, status=400)


@api_view(['POST'])
@permission_classes([AllowAny])
# @authentication_classes([SessionAuthentication, BasicAuthentication])
def signup_view(request):
    if request.method == 'POST':
        reg_serializer = UserSerializer(data=request.data)
        if reg_serializer.is_valid():
            new_user = reg_serializer.save()
            refresh = RefreshToken.for_user(new_user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }, status=status.HTTP_200_OK)
        return Response(reg_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    return Response({'message': 'Method not allowed'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)

@api_view(['POST'])
@csrf_exempt
@permission_classes([AllowAny])
# @authentication_classes([SessionAuthentication])
def login_view(request):
    if request.method == 'POST':
        mutable_data = request.data.copy()
        email = mutable_data.get('email')

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({'error': 'User with this email does not exist.'}, status=status.HTTP_404_NOT_FOUND)

        mutable_data['username'] = user.username
        serializer = LoginSerializer(data=mutable_data, context={'request': request})

        if serializer.is_valid():
            user = serializer.validated_data
            refresh = RefreshToken.for_user(user)
            response = {
                'refresh': str(refresh),
                'access': str(refresh.access_token)
            }
            return Response(response, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    return Response({'message': 'Method not allowed'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def profile_view(request):
        try :
            user_id=request.user
            userprofile = Profile.objects.get(user_id=user_id)
            serializer = UserProfileSerializer(userprofile)
            return Response(serializer.data,status=status.HTTP_200_OK)
        except Profile.DoesNotExist :
            return Response('No Profile Found', status=status.HTTP_404_NOT_FOUND)
        except Exception as e :
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)