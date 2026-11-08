from django.contrib import admin
from .models import Product


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'category', 'price', 'original_price', 'stock', 'tax_percent', 'is_active', 'created_at')
    list_filter = ('category', 'is_active', 'created_at')
    search_fields = ('name', 'description', 'category')
    list_editable = ('price', 'original_price', 'stock', 'is_active')
    prepopulated_fields = {'slug': ('name',)}
