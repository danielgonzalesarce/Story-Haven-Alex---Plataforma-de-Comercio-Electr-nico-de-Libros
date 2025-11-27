from django.contrib import admin
from .models import Categoria, Producto, CarritoItem, Compra, CompraItem


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


class CompraItemInline(admin.TabularInline):
    model = CompraItem
    extra = 0
    readonly_fields = ['producto', 'cantidad', 'precio_unitario', 'subtotal']


@admin.register(Compra)
class CompraAdmin(admin.ModelAdmin):
    list_display = ['id', 'usuario', 'total', 'total_items', 'fecha_compra', 'estado', 'metodo_pago']
    list_filter = ['estado', 'metodo_pago', 'fecha_compra']
    search_fields = ['usuario__username', 'id']
    readonly_fields = ['fecha_compra', 'total']
    inlines = [CompraItemInline]
    date_hierarchy = 'fecha_compra'


@admin.register(CompraItem)
class CompraItemAdmin(admin.ModelAdmin):
    list_display = ['compra', 'producto', 'cantidad', 'precio_unitario', 'subtotal']
    list_filter = ['compra__fecha_compra']
    search_fields = ['compra__id', 'producto__nombre']
