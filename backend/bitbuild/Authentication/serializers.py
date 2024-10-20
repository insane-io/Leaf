from django.contrib.auth import get_user_model
from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _
from django.contrib.auth import authenticate
from django.db import IntegrityError
from .models import *

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['email', 'password', 'first_name', 'last_name']

    def create(self, validated_data):
        email = validated_data.get('email')
        password = validated_data.get('password')
        first_name = validated_data.get('first_name')
        last_name = validated_data.get('last_name')

        if not email:
            raise ValueError(_('The Email must be set'))

        # Ensure the email is used for both the email and username fields
        User = get_user_model()

        try:
            user = User(
                email=email, 
                username=email,  # Use email as username
                first_name=first_name, 
                last_name=last_name
            )
            user.set_password(password) 
            user.is_active = True
            user.save()

            # Create Profile after user is successfully created
            Profile.objects.create(user=user)

            return user
        except IntegrityError:
            raise serializers.ValidationError({'email': _('A user with this email already exists.')})
    
class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField(write_only=True)
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        email = data.get('email')
        password = data.get('password')
        if email and password:
            user = authenticate(request=self.context.get('request'), email=email, password=password)
            if user is not None:
                if user.is_active:
                    return user
                else:
                    raise ValidationError("User account is not active.")
            else:
                raise ValidationError("Invalid credentials. Please try again.")
        raise ValidationError("Both email and password are required.")
    
class UsersSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['email', 'first_name', 'last_name']

class UserProfileSerializer(serializers.ModelSerializer):
    user = UsersSerializer()
    class Meta:
        model = Profile
        fields = '__all__'
        depth = 1