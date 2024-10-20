from rest_framework import serializers
from .models import *
from Authentication.serializers import UserProfileSerializer, UsersSerializer

class GetReviewSerializer(serializers.ModelSerializer):
    user = UserProfileSerializer()
    class Meta:
        depth = 1
        model = Reviews
        fields = ['id','place', 'review', 'user', 'rating']

class GetBadgeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Badges
        fields = '__all__'

class GetLocationSerializer(serializers.ModelSerializer):
    reviews = GetReviewSerializer(many=True)
    badge = GetBadgeSerializer()
    class Meta:
        depth = 1
        model = Location
        fields = [
    'id',
    'name',
    'description',
    'country',
    'city',
    'latitude',
    'longitude', 
    'badge',
    'phone_number',
    'star',
    'email',
    'images',
    'website',
    'rating',
    'price_range',
    'amenities',
    'created_at',
    'updated_at',
    'reviews',
]
    
class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reviews
        fields = '__all__'

class LocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Location
        fields = '__all__'

class BookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bookings
        fields = ['id', 'user', 'place', 'price', 'created_at']

class GetBookingSerializer(serializers.ModelSerializer):
    user = UserProfileSerializer()
    class Meta:
        model = Bookings
        fields = ['id', 'user', 'place', 'price', 'created_at']
        depth = 1

class TransactionSerializer(serializers.ModelSerializer):
    class  Meta:
        model = Transaction
        fields = '__all__'

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ['id', 'title', 'description', 'photo', 'worth']