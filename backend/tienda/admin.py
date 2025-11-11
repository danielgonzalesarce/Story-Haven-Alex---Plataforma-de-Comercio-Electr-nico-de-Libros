from django.contrib import admin
from .models import Categoria, Producto, CarritoItem


@admin.register(Categoria)
class CategoriaAdmin(admin.ModelAdmin):
    list_display = ['nombre', 'created_at']
    search_fields = ['nombre']


@admin.register(Producto)
class ProductoAdmin(admin.ModelAdmin):
    list_display = ['nombre', 'autor', 'precio', 'categoria', 'stock', 'created_at']
    list_filter = ['categoria', 'created_at']
    search_fields = ['nombre', 'autor']
    list_editable = ['precio', 'stock']


@admin.register(CarritoItem)
class CarritoItemAdmin(admin.ModelAdmin):
    list_display = ['usuario', 'producto', 'cantidad', 'subtotal', 'created_at']
    list_filter = ['created_at']
    search_fields = ['usuario__username', 'producto__nombre']
