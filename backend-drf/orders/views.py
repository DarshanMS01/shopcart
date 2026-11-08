from django.shortcuts import get_object_or_404, render
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from carts.models import Cart, CartItem
from rest_framework.response import Response
from .models import Order, OrderItem
from products.models import Product
from users.models import CustomerAddress
from .serializers import OrderSerializer
from rest_framework import status
from .utils import send_order_notification
from rest_framework.generics import ListAPIView, RetrieveAPIView
from decimal import Decimal


class PlaceOrderView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        direct_buy = request.data.get("direct_buy")
        shipping_address = request.data.get("shippingAddress") or request.data

        # Handle saved address ID if supplied
        address_id = request.data.get("address_id")
        if address_id:
            saved_addr = CustomerAddress.objects.filter(id=address_id, user=request.user).first()
            if saved_addr:
                shipping_address = {
                    "address": f"{saved_addr.house_flat}, {saved_addr.street}" + (f", {saved_addr.area}" if saved_addr.area else ""),
                    "phone": saved_addr.phone,
                    "city": saved_addr.city,
                    "state": saved_addr.state,
                    "zipCode": saved_addr.pin_code
                }

        addr_dict = shipping_address if isinstance(shipping_address, dict) else {}

        # Mode A: Direct Buy Now
        if direct_buy:
            prod_id = direct_buy.get("product_id")
            try:
                qty = int(direct_buy.get("quantity", 1))
            except (ValueError, TypeError):
                qty = 1

            product = get_object_or_404(Product, id=prod_id, is_active=True)
            if product.stock < qty:
                return Response(
                    {"details": f"Only {product.stock} left for {product.name}"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            subtotal = product.price * qty
            tax_amount = subtotal * (product.tax_percent / Decimal("100"))
            grand_total = (subtotal + tax_amount).quantize(Decimal("0.00"))

            product.stock -= qty
            product.save()

            order = Order.objects.create(
                user=request.user,
                subtotal=subtotal,
                tax_amount=tax_amount,
                grand_total=grand_total,
                address=addr_dict.get("address", ""),
                phone=addr_dict.get("phone", ""),
                city=addr_dict.get("city", ""),
                state=addr_dict.get("state", ""),
                zip_code=addr_dict.get("zipCode") or addr_dict.get("zip_code", ""),
            )

            OrderItem.objects.create(
                order=order,
                product=product,
                quantity=qty,
                price=product.price,
                total_price=subtotal
            )

            send_order_notification(order)
            serializer = OrderSerializer(order)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        # Mode B: Standard Cart Checkout
        cart, _ = Cart.objects.get_or_create(user=request.user)
        if not cart or cart.items.count() == 0:
            return Response({'error': 'Cart is empty'}, status=status.HTTP_400_BAD_REQUEST)

        for item in cart.items.all():
            product = item.product
            if product.stock < item.quantity:
                return Response(
                    {"details": f"Only {product.stock} left for {product.name}"},
                    status=status.HTTP_400_BAD_REQUEST
                )

        order = Order.objects.create(
            user=request.user,
            subtotal=cart.subtotal,
            tax_amount=cart.tax_amount,
            grand_total=cart.grand_total,
            address=addr_dict.get("address", ""),
            phone=addr_dict.get("phone", ""),
            city=addr_dict.get("city", ""),
            state=addr_dict.get("state", ""),
            zip_code=addr_dict.get("zipCode") or addr_dict.get("zip_code", ""),
        )

        for item in cart.items.all():
            product = item.product
            product.stock -= item.quantity
            product.save()

            OrderItem.objects.create(
                order=order,
                product=item.product,
                quantity=item.quantity,
                price=item.product.price,
                total_price=item.total_price
            )

        cart.items.all().delete()
        cart.save()

        send_order_notification(order)
        serializer = OrderSerializer(order)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class MyOrdersView(ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = OrderSerializer

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user).order_by('-created_at')


class OrderDetailView(RetrieveAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = OrderSerializer

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user)
