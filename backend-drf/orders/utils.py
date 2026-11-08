from django.core.mail import send_mail
from django.conf import settings
import logging

logger = logging.getLogger(__name__)


def send_order_notification(order):
    if not getattr(settings, 'EMAIL_HOST_USER', None):
        return
    try:
        send_mail(
            subject=f'Order #{order.id} is received',
            message=f"""
                Hi {order.user.first_name or order.user.username},

                Your order #{order.id} has been placed successfully.

                Total: {order.grand_total}

                Thank you for shopping with us.
            """,
            from_email=settings.EMAIL_HOST_USER,
            recipient_list=[order.user.email],
            fail_silently=True
        )
    except Exception as e:
        logger.warning(f"Failed to send order notification: {e}")
