from django.contrib import admin
from .models import User, CustomerAddress
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin


class CustomerAddressInline(admin.StackedInline):
    model = CustomerAddress
    extra = 0


class UserAdmin(BaseUserAdmin):
    list_display = ['email', 'username', 'first_name', 'last_name', 'phone', 'is_active']
    inlines = [CustomerAddressInline]


@admin.register(CustomerAddress)
class CustomerAddressAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'full_name', 'city', 'state', 'pin_code', 'is_default']
    list_filter = ['city', 'state', 'is_default']
    search_fields = ['full_name', 'phone', 'city', 'pin_code']


admin.site.register(User, UserAdmin)
