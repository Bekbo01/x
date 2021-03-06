from django.db import models
from django.urls import reverse
# Create your models here.
class Category(models.Model):

    name = models.CharField(max_length=200, db_index=True)
    slug = models.CharField(max_length=200, unique=True)

    class Meta:
        ordering = ('name',)
        verbose_name = 'category'
        verbose_name_plural = 'categories'

    def __str__(self):
        return self.name

    def get_absolute_url(self):
        return reverse('shop:product_list_by_category',
                        args=[self.slug])
    

class Product(models.Model):

    category = models.ForeignKey(Category,
                                related_name='products',
                                on_delete=models.CASCADE)
    name = models.CharField(max_length=200, db_index=True)
    slug = models.SlugField(max_length=200, db_index=True)
    image = models.CharField(max_length=2000) # models.ImageField(upload_to='products/%Y/%m/%d', blank=True)
    image2 = models.CharField(max_length=2000)
    image3 = models.CharField(max_length=2000)
    description = models.TextField(blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=0)
    available = models.BooleanField(default=True)
    producer = models.CharField(max_length=200, default='')
    age_group = models.CharField(max_length=200, default='')
    razmer = models.CharField(max_length=200, default='')
    color = models.CharField(max_length=200, default='')
    material = models.CharField(max_length=200, default='')
    star = models.FloatField(default=4)
    sku = models.CharField(max_length=200, default='')
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ('name',)
        index_together = (('id', 'slug'),)

    def __str__(self):
        return self.name
    
    def get_absolute_url(self):
        return reverse('shop:product_detail',
                        args=[self.id, self.slug])
