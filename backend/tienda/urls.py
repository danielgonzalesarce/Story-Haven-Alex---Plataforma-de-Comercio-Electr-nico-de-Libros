from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    registro_usuario, login_usuario,
    CategoriaViewSet, ProductoViewSet, CarritoViewSet
)

router = DefaultRouter()
router.register(r'categorias', CategoriaViewSet, basename='categoria')
router.register(r'productos', ProductoViewSet, basename='producto')
router.register(r'carrito', CarritoViewSet, basename='carrito')

urlpatterns = [
    path('auth/registro/', registro_usuario, name='registro'),
    path('auth/login/', login_usuario, name='login'),
    path('', include(router.urls)),
]

