from django.shortcuts import render, get_object_or_404
from .models import Category, Product
from cart.forms import CartAddProductForm
# Create your views here.

def jai(request, category_slug=None):
    cart_product_form = CartAddProductForm()
    return render(request,
                'shop/base.html',
                {'cart_product_form': cart_product_form})


def xtradecontacts(request):
    return render(request, 'shop/xplacecontacts.html')


def xtradeadres(request):
    return render(request, 'shop/xplaceadres.html')


def remont(request):
    return render(request, 'shop/remont.html')


def zapisnaremont(request):
    return render(request, 'shop/zapisnaremont.html')


def veloservice(request):
    return render(request, 'shop/veloservice.html')


def vyezdem(request):
    return render(request, 'shop/vyezdem.html')


def garantya(request):
    return render(request, 'shop/garantya.html')


def dostavka(request):
    return render(request, 'shop/dostavka.html')

def ocompany(request):
    return render(request, 'shop/ocompany.html')


def tovelobike(request):
    return render(request, 'shop/tovelobike.html')

def product_list(request, category_slug=None):
    category = None
    categories = Category.objects.all()
    products = Product.objects.filter()
    cart_product_form = CartAddProductForm()
    if category_slug:
        category = get_object_or_404(Category, slug=category_slug)
        products = products.filter(category=category)
    return render(request,
                'shop/product/list.html',
                {'category': category,
                'categories': categories,
                'cart_product_form': cart_product_form,
                'products': products})


def product_detail(request, id, slug):
    product = get_object_or_404(Product,
                                id=id,
                                slug=slug)
    cart_product_form = CartAddProductForm()
    return render(request,
                'shop/product/details.html',
                {'product': product,
                'cart_product_form': cart_product_form})