from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import CustomerAddress

User = get_user_model()


class UserRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ["id", "email", "username", "password", "phone"]

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user


class CustomerAddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomerAddress
        fields = [
            'id', 'full_name', 'phone', 'house_flat', 'street',
            'area', 'city', 'state', 'pin_code', 'delivery_instructions',
            'is_default', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']


class UserSerializer(serializers.ModelSerializer):
    addresses = CustomerAddressSerializer(many=True, read_only=True)

    class Meta:
        model = User
        fields = ['id', 'email', 'username', 'first_name', 'last_name', 'phone', 'addresses']
        read_only_fields = ["id", "email"]
