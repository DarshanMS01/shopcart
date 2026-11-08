import os
import django
import urllib.request

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'clickmart_main.settings')
django.setup()

from products.models import Product
from django.conf import settings

fixes = [
    {
        'name': 'Adjustable Monitor Arm',
        'url': 'https://images.pexels.com/photos/7974/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=800',
        'filename': 'adjustable-monitor-arm.jpg'
    },
    {
        'name': 'Power Bank 20000mAh',
        'url': 'https://images.pexels.com/photos/4005569/pexels-photo-4005569.jpeg?auto=compress&cs=tinysrgb&w=800',
        'filename': 'power-bank-20000mah.jpg'
    },
    {
        'name': 'Qi Wireless Charging Pad',
        'url': 'https://images.pexels.com/photos/4526407/pexels-photo-4526407.jpeg?auto=compress&cs=tinysrgb&w=800',
        'filename': 'wireless-charger.jpg'
    },
    {
        'name': 'Memory Foam Office Chair Cushion',
        'url': 'https://images.pexels.com/photos/1957478/pexels-photo-1957478.jpeg?auto=compress&cs=tinysrgb&w=800',
        'filename': 'chair-cushion.jpg'
    }
]

headers = {'User-Agent': 'Mozilla/5.0'}
media_dir = os.path.join(settings.MEDIA_ROOT, 'products')

for fix in fixes:
    fp = os.path.join(media_dir, fix['filename'])
    try:
        req = urllib.request.Request(fix['url'], headers=headers)
        with urllib.request.urlopen(req, timeout=10) as r, open(fp, 'wb') as f:
            f.write(r.read())
        p = Product.objects.filter(name=fix['name']).first()
        if p:
            p.image = 'products/' + fix['filename']
            p.save()
            print(f"Fixed image for {fix['name']}: {os.path.getsize(fp)} bytes")
    except Exception as e:
        print(f"Error fixing {fix['name']}: {e}")
