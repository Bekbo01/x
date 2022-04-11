from celery import shared_task
from django.core.mail import send_mail
from .models import Order


@shared_task
def order_created(order_id):
    order = Order.objects.get(id=order_id)
    subject = f'Заказ номері {order.id}'
    message = f'Салем Жонгар! Жаңа заказ! \n\n Клиент: {order.first_name},\n\n' \
            f'Адресс: {order.address}\n\n' \
            f'Телефон {order.phone}.'
    try:
        send_mail(subject,
                  message,
                  'bigboss990930@gmail.com',
                  ['xtrade010@gmail.com', 'qurmetbek.bekbolat@mail.ru']) # order.email
        return 'success'
    except Exception as ex:
        return ex
