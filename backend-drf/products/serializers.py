from rest_framework import serializers
from .models import Product


class ProductSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()
    discount_percent = serializers.IntegerField(read_only=True)

    class Meta:
        model = Product
        fields = "__all__"

    def get_image(self, obj):
        if not obj.image:
            return None
        url_str = str(obj.image)
        if url_str.startswith('http://') or url_str.startswith('https://'):
            return url_str
        return obj.image.url if hasattr(obj.image, 'url') else url_str
