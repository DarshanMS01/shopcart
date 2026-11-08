from rest_framework import serializers
from .models import Cart, CartItem


class CartItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)
    price = serializers.DecimalField(source='product.price', max_digits=10, decimal_places=2, read_only=True)
    tax_percent = serializers.DecimalField(source='product.tax_percent', max_digits=10, decimal_places=2, read_only=True)
    stock = serializers.IntegerField(source='product.stock', read_only=True)
    image = serializers.SerializerMethodField()

    class Meta:
        model = CartItem
        fields = '__all__'

    def get_image(self, obj):
        if not obj.product or not obj.product.image:
            return None
        url_str = str(obj.product.image)
        if url_str.startswith('http://') or url_str.startswith('https://'):
            return url_str
        return obj.product.image.url if hasattr(obj.product.image, 'url') else url_str


class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)
    subtotal = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    tax_amount = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    grand_total = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    itemCount = serializers.SerializerMethodField()

    class Meta:
        model = Cart
        fields = '__all__'

    def get_itemCount(self, obj):
        return sum(item.quantity for item in obj.items.all())
