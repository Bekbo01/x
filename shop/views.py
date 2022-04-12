from django.shortcuts import render, get_object_or_404
from .models import Category, Product
from cart.forms import CartAddProductForm
# Create your views here.

def jai(request, category_slug=None):
    categories = Category.objects.all()
    cart_product_form = CartAddProductForm()
    return render(request,
                'shop/base.html',
                {'cart_product_form': cart_product_form, 'categories': categories})


def xtradecontacts(request):
    categories = Category.objects.all()
    return render(request, 'shop/xplacecontacts.html', {'categories': categories})


def xtradeadres(request):
    categories = Category.objects.all()
    return render(request, 'shop/xplaceadres.html', {'categories': categories})


def remont(request):
    categories = Category.objects.all()
    return render(request, 'shop/remont.html', {'categories': categories})


def zapisnaremont(request):
    categories = Category.objects.all()
    return render(request, 'shop/zapisnaremont.html', {'categories': categories})


def veloservice(request):
    categories = Category.objects.all()
    return render(request, 'shop/veloservice.html', {'categories': categories})


def vyezdem(request):
    categories = Category.objects.all()
    return render(request, 'shop/vyezdem.html', {'categories': categories})


def garantya(request):
    categories = Category.objects.all()
    return render(request, 'shop/garantya.html', {'categories': categories})


def dostavka(request):
    categories = Category.objects.all()
    return render(request, 'shop/dostavka.html', {'categories': categories})

def ocompany(request):
    categories = Category.objects.all()
    return render(request, 'shop/ocompany.html', {'categories': categories})


def tovelobike(request):
    categories = Category.objects.all()
    return render(request, 'shop/tovelobike.html', {'categories': categories})

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
    categories = Category.objects.all()
    product = get_object_or_404(Product,
                                id=id,
                                slug=slug)
    cart_product_form = CartAddProductForm()
    return render(request,
                'shop/product/details.html',
                {'product': product,
                'cart_product_form': cart_product_form,
                'categories': categories})
