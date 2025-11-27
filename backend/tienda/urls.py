from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    registro_usuario, login_usuario, perfil_usuario, cambiar_password,
    CategoriaViewSet, ProductoViewSet, CarritoViewSet, CompraViewSet
)

router = DefaultRouter()
router.register(r'categorias', CategoriaViewSet, basename='categoria')
router.register(r'productos', ProductoViewSet, basename='producto')
router.register(r'carrito', CarritoViewSet, basename='carrito')
router.register(r'compras', CompraViewSet, basename='compra')

urlpatterns = [
    path('auth/registro/', registro_usuario, name='registro'),
    path('auth/login/', login_usuario, name='login'),
    path('auth/perfil/', perfil_usuario, name='perfil'),
    path('auth/cambiar-password/', cambiar_password, name='cambiar-password'),
    path('', include(router.urls)),
]

