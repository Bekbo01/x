from django.shortcuts import render
from .models import OrderItem
from .forms import OrderCreateForm
from cart.cart import Cart
from .task import order_created
from shop.models import Category

def order_create(request):
    cart = Cart(request)
    categories = Category.objects.all()
    if request.method == 'POST':
        form = OrderCreateForm(request.POST)
        if form.is_valid():
            order = form.save()
            for item in cart:
                OrderItem.objects.create(order=order,
                                        product=item['product'],
                                        price=item['price'],
                                        quantity=item['quantity'])
            # clear the cart
            cart.clear()
            order_created.delay(order.id)
            return render(request,
                        'orders/order/created.html',
                        {'order': order, 'categories': categories})
    else:
        form = OrderCreateForm()
    return render(request,
                'orders/order/create.html',
                {'cart': cart, 
                'form': form, 'categories': categories})
