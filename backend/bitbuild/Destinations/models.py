from django.db import models
from Authentication.models import User, Profile

class Location(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    country = models.CharField(max_length=100)
    city = models.CharField(max_length=100)  
    latitude = models.FloatField()  
    longitude = models.FloatField()  
    phone_number = models.CharField(max_length=15, blank=True, null=True) 
    images = models.TextField(blank=True, null=True)
    email = models.EmailField(blank=True, null=True)  
    website = models.URLField(blank=True, null=True)  
    rating = models.FloatField(default=0.0)
    star = models.IntegerField(default=0)
    price_range = models.CharField(max_length=50, blank=True, null=True)
    amenities = models.TextField(blank=True, null=True)  
    created_at = models.DateTimeField(auto_now_add=True)  
    updated_at = models.DateTimeField(auto_now=True)  

    def __str__(self):
        return self.name

class Reviews(models.Model):
    place       = models.ForeignKey(Location, related_name='reviews', on_delete=models.CASCADE)
    review      = models.CharField(max_length=255, blank=True, null=True)
    rating      = models.PositiveIntegerField( null=True, blank=True)
    user        = models.ForeignKey(Profile, on_delete=models.CASCADE)
    class Meta:
        db_table = 'reviews'
        unique_together = ('user', 'place')