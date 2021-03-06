# Generated by Django 4.0.3 on 2022-04-01 05:41

from django.db import migrations, models
import phonenumber_field.modelfields


class Migration(migrations.Migration):

    dependencies = [
        ('orders', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='order',
            name='phone',
            field=phonenumber_field.modelfields.PhoneNumberField(default='', max_length=128, region=None),
        ),
        migrations.AlterField(
            model_name='order',
            name='email',
            field=models.EmailField(default='example@mail.ru', max_length=254),
        ),
        migrations.AlterField(
            model_name='order',
            name='first_name',
            field=models.CharField(max_length=200),
        ),
        migrations.AlterField(
            model_name='order',
            name='last_name',
            field=models.CharField(default='', max_length=50),
        ),
    ]
