from django.db import models
from Authentication.models import User, Profile


class Badges(models.Model):
    title = models.CharField(max_length=255, blank=True, null=True)
    photo = models.TextField(blank=True, null=True)

    class Meta:
        db_table = 'badges'

    def __str__(self):
        return self.title

class Location(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    country = models.CharField(max_length=100)
    city = models.CharField(max_length=100)  
    latitude = models.FloatField()  
    longitude = models.FloatField()  
    badge = models.ForeignKey(Badges, on_delete=models.CASCADE, null=True, blank=True)
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

class Bookings(models.Model):
    user = models.ForeignKey(Profile, on_delete=models.CASCADE)
    place = models.ForeignKey(Location, on_delete=models.CASCADE)
    price = models.TextField(null=True, blank=True)
    date = models.CharField(max_length=255, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'bookings'


class Transaction(models.Model):
    TRANSACTION_TYPES = [
        ('1', 'Credit'),
        ('0', 'Debit'),
        ('2', 'Donation')
    ]

    user = models.ForeignKey(Profile, on_delete=models.CASCADE)
    transaction_type = models.CharField(max_length=10, choices=TRANSACTION_TYPES)
    payment_id = models.TextField(blank=True, null=True)
    amount = models.PositiveIntegerField()
    balance_before = models.PositiveIntegerField()
    balance_after = models.PositiveIntegerField()
    description = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'transactions'

    def __str__(self):
        return f'{self.user.user.first_name} - {self.transaction_type} - {self.amount}'

class Product(models.Model):
    title = models.CharField(max_length=255, blank=True, null=True)
    description = models.TextField(null=True, blank=True)
    photo = models.TextField(null=True, blank=True)
    worth = models.PositiveIntegerField(default=0)

    class Meta:
        db_table = 'product'

    def __str__(self):
        return self.title
    
class UserProductMap(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'user_product'