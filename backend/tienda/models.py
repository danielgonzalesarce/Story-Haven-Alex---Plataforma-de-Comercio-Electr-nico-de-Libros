from django.db import models
from django.contrib.auth.models import User


class Categoria(models.Model):
    nombre = models.CharField(max_length=100, unique=True)
    descripcion = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['nombre']
        verbose_name = 'Categoría'
        verbose_name_plural = 'Categorías'

    def __str__(self):
        return self.nombre


class Producto(models.Model):
    nombre = models.CharField(max_length=200)
    autor = models.CharField(max_length=200)
    descripcion = models.TextField()
    contraportada = models.TextField(blank=True, null=True, help_text="Descripción detallada del libro para la contraportada")
    precio = models.DecimalField(max_digits=10, decimal_places=2)
    imagen = models.CharField(max_length=255, help_text="Nombre del archivo de imagen")
    categoria = models.ForeignKey(Categoria, on_delete=models.CASCADE, related_name='productos')
    stock = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Producto'
        verbose_name_plural = 'Productos'

    def __str__(self):
        return f"{self.nombre} - {self.autor}"


class CarritoItem(models.Model):
    usuario = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True, related_name='carrito_items')
    producto = models.ForeignKey(Producto, on_delete=models.CASCADE)
    cantidad = models.IntegerField(default=1)
    session_key = models.CharField(max_length=40, null=True, blank=True, help_text="Para usuarios invitados")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Item del Carrito'
        verbose_name_plural = 'Items del Carrito'
        constraints = [
            models.UniqueConstraint(
                fields=['usuario', 'producto'],
                condition=models.Q(usuario__isnull=False),
                name='unique_user_product'
            ),
            models.UniqueConstraint(
                fields=['session_key', 'producto'],
                condition=models.Q(session_key__isnull=False),
                name='unique_session_product'
            ),
        ]

    def __str__(self):
        usuario_str = self.usuario.username if self.usuario else f"Guest ({self.session_key})"
        return f"{usuario_str} - {self.producto.nombre} x{self.cantidad}"

    @property
    def subtotal(self):
        return self.producto.precio * self.cantidad
