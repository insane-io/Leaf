from django.contrib import admin
from django.urls import path
from django.views.generic import TemplateView
from . import views

app_name = 'Destinations'

urlpatterns = [
    path('calculate-carbon-emissions/', views.CalculateCarbonEmissions.as_view(), name='calculate_carbon_emissions'),
    path('get_or_filter_places/',views.get_or_filter_places,name='get_or_filter_places'),
    path('reviews/', views.review_view, name='review'),
    path('get_reviews/', views.get_reviews, name='get_reviews'),
    path('create_location/', views.create_location, name='create_location'),
    path('create_booking/', views.create_booking, name='create_booking'),
    path('booking_list/', views.booking_list, name='booking_list'),
    path('redeem_coupon/', views.redeem_coupon, name='redeem_coupon'),
    path('get_transaction/', views.get_transaction, name='get_transaction'),
    path('get_product/', views.get_product, name='get_product'),
    path('get_near_by_destination/', views.get_near_by_destination, name='get_near_by_destination'),
]