import os
import django
import urllib.request
from decimal import Decimal

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'clickmart_main.settings')
django.setup()

from products.models import Product
from django.conf import settings

# Clear existing products
Product.objects.all().delete()

original_products = [
    {
        'id': 1,
        'name': 'Wireless Headphones',
        'price': Decimal('99.99'),
        'image_url': 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=500',
        'filename': 'wireless-headphones.jpg',
        'description': 'Premium wireless headphones with noise cancellation and superior sound quality. Perfect for music lovers and professionals.',
        'stock': 15,
        'tax_percent': Decimal('5.00')
    },
    {
        'id': 2,
        'name': 'Smart Watch',
        'price': Decimal('249.99'),
        'image_url': 'https://images.pexels.com/photos/1034063/pexels-photo-1034063.jpeg?auto=compress&cs=tinysrgb&w=500',
        'filename': 'smart-watch.jpg',
        'description': 'Advanced smartwatch with health monitoring, GPS, and seamless smartphone integration.',
        'stock': 8,
        'tax_percent': Decimal('5.00')
    },
    {
        'id': 3,
        'name': 'Laptop Stand',
        'price': Decimal('79.99'),
        'image_url': 'https://images.pexels.com/photos/4050415/pexels-photo-4050415.jpeg?auto=compress&cs=tinysrgb&w=500',
        'filename': 'laptop-stand.jpg',
        'description': 'Ergonomic aluminum laptop stand that improves posture and reduces neck strain while working.',
        'stock': 22,
        'tax_percent': Decimal('5.00')
    },
    {
        'id': 4,
        'name': 'Bluetooth Speaker',
        'price': Decimal('149.99'),
        'image_url': 'https://images.pexels.com/photos/374024/pexels-photo-374024.jpeg?auto=compress&cs=tinysrgb&w=500',
        'filename': 'bluetooth-speaker.jpg',
        'description': 'Portable Bluetooth speaker with 360-degree sound and waterproof design for outdoor adventures.',
        'stock': 12,
        'tax_percent': Decimal('5.00')
    },
    {
        'id': 5,
        'name': 'USB-C Hub',
        'price': Decimal('59.99'),
        'image_url': 'https://images.pexels.com/photos/4792728/pexels-photo-4792728.jpeg?auto=compress&cs=tinysrgb&w=500',
        'filename': 'usb-c-hub.jpg',
        'description': 'Multi-port USB-C hub with HDMI, USB 3.0, and power delivery for enhanced connectivity.',
        'stock': 18,
        'tax_percent': Decimal('5.00')
    },
    {
        'id': 6,
        'name': 'Wireless Mouse',
        'price': Decimal('39.99'),
        'image_url': 'https://images.pexels.com/photos/2115256/pexels-photo-2115256.jpeg?auto=compress&cs=tinysrgb&w=500',
        'filename': 'wireless-mouse.jpg',
        'description': 'Precision wireless mouse with ergonomic design and long battery life for productivity.',
        'stock': 25,
        'tax_percent': Decimal('5.00')
    }
]

media_dir = os.path.join(settings.MEDIA_ROOT, 'products')
os.makedirs(media_dir, exist_ok=True)
headers = {'User-Agent': 'Mozilla/5.0'}

for p in original_products:
    file_path = os.path.join(media_dir, p['filename'])
    image_val = 'products/' + p['filename']
    try:
        req = urllib.request.Request(p['image_url'], headers=headers)
        with urllib.request.urlopen(req, timeout=10) as resp, open(file_path, 'wb') as f:
            f.write(resp.read())
        print(f"Downloaded image: {p['filename']}")
    except Exception as e:
        print(f"Image download fallback: {e}")
        image_val = p['image_url']

    prod = Product.objects.create(
        id=p['id'],
        name=p['name'],
        price=p['price'],
        image=image_val,
        description=p['description'],
        stock=p['stock'],
        tax_percent=p['tax_percent'],
        is_active=True
    )
    print(f"Restored Product #{prod.id}: {prod.name} (${prod.price})")

print(f"SUCCESS: Total products in database: {Product.objects.count()}")
