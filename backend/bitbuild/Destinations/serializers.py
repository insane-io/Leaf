from rest_framework import serializers
from .models import *

class GetReviewSerializer(serializers.ModelSerializer):
    class Meta:
        depth = 1
        model = Reviews
        fields = '__all__'


class GetLocationSerializer(serializers.ModelSerializer):
    reviews = GetReviewSerializer(many=True)
    class Meta:
        model = Location
        fields = [
    'id',
    'name',
    'description',
    'country',
    'city',
    'latitude',
    'longitude',
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

