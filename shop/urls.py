from unicodedata import name
from django.urls import path
from . import views

urlpatterns = [
    path('', views.jai, name='jai'), # views.product_list, name='product_list'),
    path('test/', views.product_list, name='product_list'),
    path('xtradecontacts/', views.xtradecontacts, name='xtradecontacts'),
    path('xtradeadres/', views.xtradeadres, name='xtradeadres'),
    path('remont/', views.remont, name='remont'),
    path('zapisnaremont/', views.zapisnaremont, name='zapisnaremont'),
    path('veloservice/', views.veloservice, name='veloservice'),
    path('vyezdem/', views.vyezdem, name='vyezdem'),
    path('ocompany/', views.ocompany, name='ocompany'),
    path('dostavka/', views.dostavka, name='dostavka'),
    path('garantya/', views.garantya, name='garantya'),
    path('tovelobike/', views.tovelobike, name='tovelobike'),
    path('base/', views.jai, name='jai'),
    path('<slug:category_slug>/', views.product_list, 
        name='product_list_by_category'),
    path('<int:id>/<slug:slug>/', views.product_detail,
        name='product_detail'),
]