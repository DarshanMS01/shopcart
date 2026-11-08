import os
import django
import urllib.request
from decimal import Decimal

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'clickmart_main.settings')
django.setup()

from products.models import Product
from django.conf import settings

media_dir = os.path.join(settings.MEDIA_ROOT, 'products')
os.makedirs(media_dir, exist_ok=True)
headers = {'User-Agent': 'Mozilla/5.0'}

catalogue = [
    # --- Category 1: Laptop and computer accessories (10 products) ---
    {
        'name': 'Laptop Stand',
        'category': 'Laptop and computer accessories',
        'price': Decimal('79.99'),
        'original_price': Decimal('99.99'),
        'image_url': 'https://images.pexels.com/photos/4050415/pexels-photo-4050415.jpeg?auto=compress&cs=tinysrgb&w=800',
        'filename': 'laptop-stand.jpg',
        'description': 'Ergonomic aluminum laptop stand that improves posture and reduces neck strain while working. Ventilated design prevents overheating.',
        'stock': 22,
        'tax_percent': Decimal('5.00'),
        'specifications': {'Material': 'Anodized Aluminum', 'Adjustability': '6 Angle Settings', 'Compatibility': '10-17 inch Laptops', 'Weight': '260g', 'Warranty': '1 Year'}
    },
    {
        'name': 'Wireless Mouse',
        'category': 'Laptop and computer accessories',
        'price': Decimal('39.99'),
        'original_price': Decimal('49.99'),
        'image_url': 'https://images.pexels.com/photos/2115256/pexels-photo-2115256.jpeg?auto=compress&cs=tinysrgb&w=800',
        'filename': 'wireless-mouse.jpg',
        'description': 'Precision 2.4GHz wireless optical mouse with ergonomic contour, silent click buttons, and up to 18-month battery life.',
        'stock': 25,
        'tax_percent': Decimal('5.00'),
        'specifications': {'DPI': '1600 DPI Optical', 'Connectivity': '2.4GHz USB Nano Receiver', 'Battery': '1x AA included', 'Range': '10 meters', 'Warranty': '1 Year'}
    },
    {
        'name': 'Mechanical Keyboard',
        'category': 'Laptop and computer accessories',
        'price': Decimal('119.99'),
        'original_price': Decimal('149.99'),
        'image_url': 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80',
        'filename': 'mechanical-keyboard.jpg',
        'description': 'Compact RGB mechanical gaming and typing keyboard with hot-swappable tactile switches, aluminum top plate, and detachable braided cable.',
        'stock': 18,
        'tax_percent': Decimal('5.00'),
        'specifications': {'Switch Type': 'Tactile Brown Switches', 'Keycaps': 'Double-shot PBT', 'Backlight': 'Per-key RGB 16.8M colors', 'Interface': 'USB-C Detachable', 'Warranty': '2 Years'}
    },
    {
        'name': 'USB-C Hub',
        'category': 'Laptop and computer accessories',
        'price': Decimal('59.99'),
        'original_price': Decimal('79.99'),
        'image_url': 'https://images.pexels.com/photos/4792728/pexels-photo-4792728.jpeg?auto=compress&cs=tinysrgb&w=800',
        'filename': 'usb-c-hub.jpg',
        'description': '7-in-1 multi-port USB-C adapter with 4K HDMI, 100W Power Delivery pass-through, SD/TF card reader, and 3x USB 3.0 ports.',
        'stock': 20,
        'tax_percent': Decimal('5.00'),
        'specifications': {'HDMI Output': '4K @ 60Hz', 'Power Delivery': 'Up to 100W', 'Data Transfer': '5 Gbps SuperSpeed', 'Enclosure': 'Aluminum Alloy', 'Warranty': '18 Months'}
    },
    {
        'name': 'Laptop Backpack',
        'category': 'Laptop and computer accessories',
        'price': Decimal('69.99'),
        'original_price': Decimal('89.99'),
        'image_url': 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80',
        'filename': 'laptop-backpack.jpg',
        'description': 'Water-resistant travel business laptop backpack with shockproof padded sleeve, hidden anti-theft pocket, and built-in USB charging port.',
        'stock': 30,
        'tax_percent': Decimal('5.00'),
        'specifications': {'Fits Laptops Up To': '16.5 inches', 'Capacity': '28 Liters', 'Fabric': 'High-density Oxford Cloth', 'Features': 'Luggage Strap & Anti-theft Pocket', 'Warranty': '1 Year'}
    },
    {
        'name': 'Laptop Cooling Pad',
        'category': 'Laptop and computer accessories',
        'price': Decimal('34.99'),
        'original_price': Decimal('45.99'),
        'image_url': 'https://images.unsplash.com/photo-1629654297299-c8506221ca97?auto=format&fit=crop&w=800&q=80',
        'filename': 'laptop-cooling-pad.jpg',
        'description': 'Whisper-quiet gaming laptop cooler equipped with 5 high-speed fans, adjustable height stands, dual USB ports, and blue LED lighting.',
        'stock': 24,
        'tax_percent': Decimal('5.00'),
        'specifications': {'Fan Speed': '1400 RPM +/- 10%', 'Noise Level': 'Under 21 dBA', 'USB Ports': '2x USB 2.0 Passthrough', 'Laptop Sizes': '12 - 17.3 inches', 'Warranty': '1 Year'}
    },
    {
        'name': 'HD Pro Webcam',
        'category': 'Laptop and computer accessories',
        'price': Decimal('89.99'),
        'original_price': Decimal('119.99'),
        'image_url': 'https://images.unsplash.com/photo-1588702547919-26089e690ecc?auto=format&fit=crop&w=800&q=80',
        'filename': 'hd-pro-webcam.jpg',
        'description': '1080p Full HD streaming webcam with automatic low-light correction, dual noise-reducing stereo microphones, and physical privacy shutter.',
        'stock': 16,
        'tax_percent': Decimal('5.00'),
        'specifications': {'Resolution': '1080p @ 60fps', 'Focus': 'Autofocus', 'Field of View': '90 Degrees Wide Angle', 'Audio': 'Dual Omni-directional Mics', 'Warranty': '1 Year'}
    },
    {
        'name': 'Monitor Stand Riser',
        'category': 'Laptop and computer accessories',
        'price': Decimal('49.99'),
        'original_price': Decimal('65.99'),
        'image_url': 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=800&q=80',
        'filename': 'monitor-stand-riser.jpg',
        'description': 'Heavy-duty tempered glass monitor riser with pull-out drawer organizer and side phone holder, providing comfortable ergonomic eye-level viewing.',
        'stock': 20,
        'tax_percent': Decimal('5.00'),
        'specifications': {'Surface Material': 'Tempered Safety Glass', 'Weight Capacity': 'Up to 30 kg', 'Storage': 'Built-in Accessory Drawer', 'Elevates By': '10 cm', 'Warranty': '2 Years'}
    },
    {
        'name': 'External SSD 1TB',
        'category': 'Laptop and computer accessories',
        'price': Decimal('129.99'),
        'original_price': Decimal('169.99'),
        'image_url': 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=800&q=80',
        'filename': 'external-ssd-1tb.jpg',
        'description': 'Ultra-compact portable Solid State Drive offering up to 1050 MB/s read/write speeds, drop resistance, and hardware encryption.',
        'stock': 14,
        'tax_percent': Decimal('5.00'),
        'specifications': {'Capacity': '1 TB', 'Read Speed': 'Up to 1050 MB/s', 'Interface': 'USB 3.2 Gen 2 (Type-C)', 'Shock Resistance': 'Up to 2-meter drop', 'Warranty': '3 Years'}
    },
    {
        'name': 'Adjustable Monitor Arm',
        'category': 'Laptop and computer accessories',
        'price': Decimal('84.99'),
        'original_price': Decimal('109.99'),
        'image_url': 'https://images.unsplash.com/photo-1585792180666-f75a7c3ab27c?auto=format&fit=crop&w=800&q=80',
        'filename': 'adjustable-monitor-arm.jpg',
        'description': 'Gas spring single monitor desk mount featuring full motion tilt, swivel, 360-degree rotation, and integrated cable management clips.',
        'stock': 19,
        'tax_percent': Decimal('5.00'),
        'specifications': {'VESA Pattern': '75x75mm & 100x100mm', 'Screen Size': '17 to 32 inches', 'Tilt Range': '+90 to -45 deg', 'Rotation': '360 deg Portrait/Landscape', 'Warranty': '3 Years'}
    },

    # --- Category 2: Mobile accessories (10 products) ---
    {
        'name': 'Wireless Earbuds',
        'category': 'Mobile accessories',
        'price': Decimal('79.99'),
        'original_price': Decimal('109.99'),
        'image_url': 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80',
        'filename': 'wireless-earbuds.jpg',
        'description': 'True wireless Bluetooth 5.3 earbuds featuring active noise cancellation, deep bass drivers, IPX5 water resistance, and 32-hour playback case.',
        'stock': 28,
        'tax_percent': Decimal('5.00'),
        'specifications': {'Bluetooth': 'v5.3 Low Latency', 'Battery Life': '8h earbuds + 24h case', 'Noise Cancellation': 'Active Hybrid ANC', 'Waterproofing': 'IPX5 Sweat-proof', 'Warranty': '1 Year'}
    },
    {
        'name': 'Wireless Headphones',
        'category': 'Mobile accessories',
        'price': Decimal('99.99'),
        'original_price': Decimal('129.99'),
        'image_url': 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=800',
        'filename': 'wireless-headphones.jpg',
        'description': 'Premium over-ear wireless headphones with active noise cancellation, memory foam earcups, crystal-clear call quality, and 40h playtime.',
        'stock': 15,
        'tax_percent': Decimal('5.00'),
        'specifications': {'Driver Size': '40mm Neodymium', 'Playtime': 'Up to 40 Hours', 'Charging': 'USB-C Quick Charge (10m=4h)', 'Microphone': 'Dual Noise-Canceling', 'Warranty': '1 Year'}
    },
    {
        'name': 'Fast Charging Adapter 65W',
        'category': 'Mobile accessories',
        'price': Decimal('29.99'),
        'original_price': Decimal('39.99'),
        'image_url': 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80',
        'filename': 'fast-charging-adapter.jpg',
        'description': 'GaN III technology 65W dual-port (USB-C + USB-A) fast wall charger capable of fast-charging laptops, tablets, and smartphones simultaneously.',
        'stock': 40,
        'tax_percent': Decimal('5.00'),
        'specifications': {'Total Output': '65W Max', 'Technology': 'Gallium Nitride (GaN III)', 'Ports': '1x USB-C PD 3.0 + 1x USB-A QC 4.0', 'Protection': 'Over-voltage & Temperature', 'Warranty': '18 Months'}
    },
    {
        'name': 'USB-C Braided Cable',
        'category': 'Mobile accessories',
        'price': Decimal('14.99'),
        'original_price': Decimal('19.99'),
        'image_url': 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=800&q=80',
        'filename': 'usbc-braided-cable.jpg',
        'description': 'Heavy-duty double-braided nylon USB-C to USB-C cable supporting 100W fast power delivery and high-speed 480Mbps data synchronization.',
        'stock': 50,
        'tax_percent': Decimal('5.00'),
        'specifications': {'Length': '2 Meters (6.6 ft)', 'Max Wattage': '100W (20V / 5A)', 'Bend Lifespan': '25,000+ Bends Tested', 'Material': 'Double Braided Nylon Armor', 'Warranty': 'Lifetime'}
    },
    {
        'name': 'Power Bank 20000mAh',
        'category': 'Mobile accessories',
        'price': Decimal('44.99'),
        'original_price': Decimal('59.99'),
        'image_url': 'https://images.unsplash.com/photo-1609592424364-8fa62a1a8c9e?auto=format&fit=crop&w=800&q=80',
        'filename': 'power-bank-20000mah.jpg',
        'description': 'Slim 20,000mAh portable charger with LED digital battery display, dual USB-C PD outputs, and airline approved capacity for international travel.',
        'stock': 35,
        'tax_percent': Decimal('5.00'),
        'specifications': {'Capacity': '20,000 mAh / 74Wh', 'Fast Charging': '22.5W Power Delivery', 'Outputs': '2x USB-C + 1x USB-A', 'Display': 'LED Numeric Percentage', 'Warranty': '1 Year'}
    },
    {
        'name': 'Mobile Phone Desktop Stand',
        'category': 'Mobile accessories',
        'price': Decimal('19.99'),
        'original_price': Decimal('29.99'),
        'image_url': 'https://images.unsplash.com/photo-1586105251261-72a756497a11?auto=format&fit=crop&w=800&q=80',
        'filename': 'mobile-phone-stand.jpg',
        'description': 'Foldable weighted aluminum phone cradle with adjustable angle and height, silicone anti-slip grips, and dedicated charging cable cutouts.',
        'stock': 45,
        'tax_percent': Decimal('5.00'),
        'specifications': {'Material': 'Solid Aluminum & Silicone', 'Foldable': 'Yes, Pocket Size', 'Compatibility': 'All 4 - 10 inch devices', 'Anti-Slip': 'Base and Cradle Pads', 'Warranty': '1 Year'}
    },
    {
        'name': 'Shockproof Mobile Cover',
        'category': 'Mobile accessories',
        'price': Decimal('16.99'),
        'original_price': Decimal('24.99'),
        'image_url': 'https://images.unsplash.com/photo-1601593346740-925612772716?auto=format&fit=crop&w=800&q=80',
        'filename': 'shockproof-mobile-cover.jpg',
        'description': 'Crystal clear military-grade drop protective phone case with yellowing-resistant TPU bumper and raised bezels protecting camera and screen.',
        'stock': 50,
        'tax_percent': Decimal('5.00'),
        'specifications': {'Drop Protection': 'Military Std 810G Drop Tested', 'Material': 'Bayer TPU + Rigid Polycarbonate', 'Bezel Height': '1.5mm Screen / 2.0mm Camera', 'Wireless Charging': 'Fully Compatible', 'Warranty': '6 Months'}
    },
    {
        'name': 'Tempered Glass Screen Protector',
        'category': 'Mobile accessories',
        'price': Decimal('12.99'),
        'original_price': Decimal('18.99'),
        'image_url': 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?auto=format&fit=crop&w=800&q=80',
        'filename': 'screen-protector.jpg',
        'description': '9H hardness ultra-thin tempered glass screen protector with oleophobic coating against fingerprints, bubbles, and accidental scratches.',
        'stock': 60,
        'tax_percent': Decimal('5.00'),
        'specifications': {'Hardness': '9H Surface Hardness', 'Thickness': '0.33mm Ultra-thin', 'Clarity': '99.9% HD Transparency', 'Package': '2-Pack with Alignment Frame', 'Warranty': 'Lifetime Replacement'}
    },
    {
        'name': 'Magnetic Car Mobile Mount',
        'category': 'Mobile accessories',
        'price': Decimal('22.99'),
        'original_price': Decimal('32.99'),
        'image_url': 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=80',
        'filename': 'car-mobile-holder.jpg',
        'description': 'Universal magnetic air vent car phone mount with 360-degree ball joint and ultra-strong N52 neodymium magnets for bump-proof driving.',
        'stock': 32,
        'tax_percent': Decimal('5.00'),
        'specifications': {'Magnets': '6x N52 Neodymium Ring', 'Mounting Type': 'Twist-Lock Air Vent Clip', 'Rotation': '360 Degree Ball Swivel', 'Compatibility': 'All Phones & Cases', 'Warranty': '1 Year'}
    },
    {
        'name': 'Qi Wireless Charging Pad',
        'category': 'Mobile accessories',
        'price': Decimal('29.99'),
        'original_price': Decimal('42.99'),
        'image_url': 'https://images.unsplash.com/photo-1622445262464-84b14e0745b1?auto=format&fit=crop&w=800&q=80',
        'filename': 'wireless-charger.jpg',
        'description': '15W fast wireless charging pad with intelligent heat dissipation, breathing LED charging indicator, and case-friendly charging capability.',
        'stock': 30,
        'tax_percent': Decimal('5.00'),
        'specifications': {'Max Output': '15W Fast Charge', 'Standard': 'Qi Wireless Certified', 'Thickness': '6.5mm Slim Profile', 'Safety': 'Foreign Object Detection (FOD)', 'Warranty': '1 Year'}
    },

    # --- Category 3: Home and lifestyle (5 products) ---
    {
        'name': 'Smart LED Desk Lamp',
        'category': 'Home and lifestyle',
        'price': Decimal('39.99'),
        'original_price': Decimal('54.99'),
        'image_url': 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80',
        'filename': 'led-desk-lamp.jpg',
        'description': 'Eye-caring modern LED desk light featuring 5 color temperature modes, touch dimmer slider, flexible gooseneck arm, and 1-hour auto timer.',
        'stock': 26,
        'tax_percent': Decimal('5.00'),
        'specifications': {'Color Temperature': '2700K - 6500K (5 Modes)', 'Brightness Levels': 'Stepless 10% - 100%', 'LED Count': '60 High-efficiency LEDs', 'Power Input': 'USB-C 5V/2A', 'Warranty': '2 Years'}
    },
    {
        'name': 'Insulated Stainless Steel Water Bottle',
        'category': 'Home and lifestyle',
        'price': Decimal('21.99'),
        'original_price': Decimal('29.99'),
        'image_url': 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=800&q=80',
        'filename': 'water-bottle.jpg',
        'description': 'Double-wall vacuum insulated stainless steel water flask keeping beverages ice cold for 24 hours or steaming hot for 12 hours.',
        'stock': 40,
        'tax_percent': Decimal('5.00'),
        'specifications': {'Capacity': '750 ml (25 oz)', 'Material': '18/8 Food-grade Stainless Steel', 'Insulation': '24h Cold / 12h Hot', 'Lid': 'Leak-proof Sport Cap with Handle', 'Warranty': 'Limited Lifetime'}
    },
    {
        'name': 'Wooden Table Organizer',
        'category': 'Home and lifestyle',
        'price': Decimal('27.99'),
        'original_price': Decimal('39.99'),
        'image_url': 'https://images.unsplash.com/photo-1591129841117-3adfd313e34f?auto=format&fit=crop&w=800&q=80',
        'filename': 'table-organizer.jpg',
        'description': 'Handcrafted natural bamboo desk caddy with multi-tier storage compartments for pens, stationery, remote controls, and mobile devices.',
        'stock': 25,
        'tax_percent': Decimal('5.00'),
        'specifications': {'Material': '100% Eco-friendly Bamboo', 'Compartments': '6 Sorting Sections', 'Dimensions': '24 x 15 x 11 cm', 'Finish': 'Natural Smooth Lacquer', 'Warranty': '1 Year'}
    },
    {
        'name': 'Digital Wooden Alarm Clock',
        'category': 'Home and lifestyle',
        'price': Decimal('32.99'),
        'original_price': Decimal('44.99'),
        'image_url': 'https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?auto=format&fit=crop&w=800&q=80',
        'filename': 'digital-alarm-clock.jpg',
        'description': 'Minimalist wooden electronic digital clock displaying time, calendar, indoor temperature, humidity, and acoustic voice control activation.',
        'stock': 22,
        'tax_percent': Decimal('5.00'),
        'specifications': {'Display': 'White LED on Natural Wood Grain', 'Features': 'Temperature & Humidity Sensor', 'Alarms': '3 Programmable Alarm Sets', 'Power': 'USB Cable or 3x AAA Backup', 'Warranty': '1 Year'}
    },
    {
        'name': 'Collapsible Storage Organizer Bins',
        'category': 'Home and lifestyle',
        'price': Decimal('26.99'),
        'original_price': Decimal('36.99'),
        'image_url': 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80',
        'filename': 'storage-organizer.jpg',
        'description': 'Set of 3 durable linen fabric storage organizer cubes with reinforced leatherette carry handles, ideal for shelves, closets, and desks.',
        'stock': 35,
        'tax_percent': Decimal('5.00'),
        'specifications': {'Package': 'Set of 3 Storage Bins', 'Material': 'Extra Thick Linen & EVA', 'Dimensions Each': '33 x 33 x 33 cm', 'Handles': 'Dual Stitched Faux Leather', 'Warranty': '1 Year'}
    },

    # --- Category 4: Office and daily-use products (5 products) ---
    {
        'name': 'Extended Leather Desk Mat',
        'category': 'Office and daily-use products',
        'price': Decimal('24.99'),
        'original_price': Decimal('34.99'),
        'image_url': 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=800&q=80',
        'filename': 'desk-mat.jpg',
        'description': 'Large 80x40cm dual-sided PU leather desk pad and mouse blotter. Water-resistant, easy to clean, protecting desks from scuffs and spills.',
        'stock': 35,
        'tax_percent': Decimal('5.00'),
        'specifications': {'Size': '80 x 40 cm (31.5 x 15.7 in)', 'Material': 'Premium Eco PU Leather', 'Features': 'Reversible Dual Color & Waterproof', 'Packaging': 'Includes Matching Roll-up Strap', 'Warranty': '1 Year'}
    },
    {
        'name': 'Ergonomic Gel Mouse Pad',
        'category': 'Office and daily-use products',
        'price': Decimal('15.99'),
        'original_price': Decimal('22.99'),
        'image_url': 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=800&q=80',
        'filename': 'mouse-pad.jpg',
        'description': 'Soft cooling gel wrist rest mouse pad designed to relieve carpal tunnel strain, featuring non-skid PU base and smooth lycra cloth surface.',
        'stock': 40,
        'tax_percent': Decimal('5.00'),
        'specifications': {'Rest Material': 'Cooling Memory Gel', 'Base': 'Non-slip Rubberized Grip', 'Surface': 'Micro-textured Lycra', 'Dimensions': '23 x 19 x 2.2 cm', 'Warranty': '1 Year'}
    },
    {
        'name': 'Memory Foam Office Chair Cushion',
        'category': 'Office and daily-use products',
        'price': Decimal('49.99'),
        'original_price': Decimal('69.99'),
        'image_url': 'https://images.unsplash.com/photo-1580481077195-c2668582d921?auto=format&fit=crop&w=800&q=80',
        'filename': 'chair-cushion.jpg',
        'description': 'Orthopedic coccyx seat cushion contouring to your body to relieve sciatica and tailbone pressure during long working hours at your desk.',
        'stock': 28,
        'tax_percent': Decimal('5.00'),
        'specifications': {'Foam': '100% High-Density Memory Foam', 'Cover': 'Breathable Mesh, Machine Washable', 'Base': 'Anti-slip Bottom Studs', 'Weight Capacity': 'Up to 120 kg', 'Warranty': '2 Years'}
    },
    {
        'name': 'Portable Bluetooth Speaker',
        'category': 'Office and daily-use products',
        'price': Decimal('149.99'),
        'original_price': Decimal('179.99'),
        'image_url': 'https://images.pexels.com/photos/374024/pexels-photo-374024.jpeg?auto=compress&cs=tinysrgb&w=800',
        'filename': 'bluetooth-speaker.jpg',
        'description': 'Rugged 360-degree wireless outdoor speaker with punchy bass radiators, IP67 dust/water resistance, and party-link multi-speaker pairing.',
        'stock': 12,
        'tax_percent': Decimal('5.00'),
        'specifications': {'Audio Output': '20W RMS Dynamic', 'Battery Life': '16 Hours Continuous Play', 'Waterproofing': 'IP67 Submersible', 'Connectivity': 'Bluetooth 5.2 + 3.5mm AUX', 'Warranty': '1 Year'}
    },
    {
        'name': 'Wireless Portable Thermal Printer',
        'category': 'Office and daily-use products',
        'price': Decimal('159.99'),
        'original_price': Decimal('199.99'),
        'image_url': 'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?auto=format&fit=crop&w=800&q=80',
        'filename': 'portable-printer.jpg',
        'description': 'Inkless portable thermal paper printer for on-the-go contracts, receipts, notes, and documents. Connects wirelessly via Bluetooth or USB.',
        'stock': 15,
        'tax_percent': Decimal('5.00'),
        'specifications': {'Print Tech': 'Direct Thermal (No Ink Needed)', 'Resolution': '300 DPI Sharp Text', 'Paper Sizes': 'US Letter & A4 Roll', 'Battery': '2600 mAh Built-in', 'Warranty': '1 Year'}
    },
    {
        'name': 'Smart Fitness Watch',
        'category': 'Mobile accessories',
        'price': Decimal('249.99'),
        'original_price': Decimal('299.99'),
        'image_url': 'https://images.pexels.com/photos/1034063/pexels-photo-1034063.jpeg?auto=compress&cs=tinysrgb&w=800',
        'filename': 'smart-watch.jpg',
        'description': 'Advanced AMOLED smartwatch with 24/7 heart-rate and SpO2 monitoring, built-in GPS tracking, 100+ sport modes, and 10-day battery life.',
        'stock': 8,
        'tax_percent': Decimal('5.00'),
        'specifications': {'Display': '1.43 inch AMOLED 466x466', 'Sensors': 'Optical Heart Rate, SpO2, GPS', 'Battery': 'Up to 10 Days Typical', 'Water Resistance': '5 ATM / 50 meters', 'Warranty': '1 Year'}
    }
]

print(f"Total products to process: {len(catalogue)}")

added = 0
updated = 0

for item in catalogue:
    file_path = os.path.join(media_dir, item['filename'])
    image_field_val = f"products/{item['filename']}"

    # Download image if not already present or zero byte
    if not os.path.exists(file_path) or os.path.getsize(file_path) == 0:
        try:
            req = urllib.request.Request(item['image_url'], headers=headers)
            with urllib.request.urlopen(req, timeout=12) as resp, open(file_path, 'wb') as out_f:
                out_f.write(resp.read())
            print(f"Downloaded image: {item['filename']} ({os.path.getsize(file_path)} bytes)")
        except Exception as e:
            print(f"Could not download {item['filename']}, fallback to URL: {e}")
            image_field_val = item['image_url']
    else:
        print(f"Using existing image: {item['filename']}")

    # Idempotent upsert by name
    prod = Product.objects.filter(name=item['name']).first()
    if prod:
        prod.category = item['category']
        prod.price = item['price']
        prod.original_price = item['original_price']
        prod.description = item['description']
        prod.stock = item['stock']
        prod.tax_percent = item['tax_percent']
        prod.specifications = item['specifications']
        if not prod.image or str(prod.image) == '' or 'apple.jpg' in str(prod.image):
            prod.image = image_field_val
        prod.is_active = True
        prod.save()
        updated += 1
        print(f"Updated product #{prod.id}: {prod.name}")
    else:
        prod = Product.objects.create(
            name=item['name'],
            category=item['category'],
            price=item['price'],
            original_price=item['original_price'],
            description=item['description'],
            image=image_field_val,
            stock=item['stock'],
            tax_percent=item['tax_percent'],
            specifications=item['specifications'],
            is_active=True
        )
        added += 1
        print(f"Created new product #{prod.id}: {prod.name}")

print("========================================")
print(f"SUMMARY: Added {added} new, Updated {updated} existing.")
print(f"TOTAL PRODUCTS IN DATABASE: {Product.objects.count()}")
print("========================================")
