from django.contrib import admin
from django.urls import path
from django.views.generic import TemplateView
from . import views

app_name = 'Destinations'

urlpatterns = [
    path('calculate-carbon-emissions/', views.CalculateCarbonEmissions.as_view(), name='calculate_carbon_emissions'),
    path('get_place/',views.get_place,name='get_place'),
    path('reviews/', views.review_view, name='review'),
    path('get_reviews/', views.get_reviews, name='get_reviews'),
    path('filter_places/', views.filter_places, name='filter_places'),
    path('create_location/', views.create_location, name='create_location'),
    path('get_near_by_destination/', views.get_near_by_destination, name='get_near_by_destination'),
]