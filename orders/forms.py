from django import forms
from .models import Order

class OrderCreateForm(forms.ModelForm):
        
    class Meta:
        model = Order
        fields = ['first_name', 'email', 'address', 'phone']
        widgets = {
            'first_name': forms.TextInput(attrs={
                'class': "ui_input",
                'style': 'max-width: 300px;padding-top: 30px;padding-bottom: 20px;position:flex;'
                }),
            'address': forms.TextInput(attrs={
                'class': "ui_input",
                'style': 'max-width: 300px;padding-top: 30px;padding-bottom: 20px;position:flex;'
                }),
            'phone': forms.TextInput(attrs={
                'class': "ui_input",
                'style': 'max-width: 300px;padding-top: 30px;padding-bottom: 20px;position:flex;',
                'placeholder': '+7 775 701 99 78'
                }),
            'email': forms.EmailInput(attrs={
                'class': "ui_input",
                'style': 'max-width: 300px;padding-top: 30px;padding-bottom: 20px;position:flex;',
                'required': False
                })
        }