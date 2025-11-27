from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from .models import Categoria, Producto, CarritoItem, Compra, CompraItem


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'date_joined']
        read_only_fields = ['id', 'date_joined']

class UserUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'email', 'first_name', 'last_name']
    
    def validate_username(self, value):
        user = self.instance
        if User.objects.exclude(pk=user.pk).filter(username=value).exists():
            raise serializers.ValidationError("Este nombre de usuario ya está en uso.")
        return value
    
    def validate_email(self, value):
        user = self.instance
        if User.objects.exclude(pk=user.pk).filter(email=value).exists():
            raise serializers.ValidationError("Este correo electrónico ya está en uso.")
        return value

class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True, write_only=True)
    new_password = serializers.CharField(required=True, write_only=True, validators=[validate_password])
    new_password2 = serializers.CharField(required=True, write_only=True)
    
    def validate(self, attrs):
        if attrs['new_password'] != attrs['new_password2']:
            raise serializers.ValidationError({"new_password": "Las contraseñas no coinciden."})
        return attrs
        read_only_fields = ['id']


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ['username', 'password', 'password2', 'email', 'first_name', 'last_name']

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Las contraseñas no coinciden."})
        return attrs

    def create(self, validated_data):
        validated_data.pop('password2')
        user = User.objects.create_user(**validated_data)
        return user


class CategoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categoria
        fields = ['id', 'nombre', 'descripcion']


class ProductoSerializer(serializers.ModelSerializer):
    categoria = CategoriaSerializer(read_only=True)
    categoria_id = serializers.PrimaryKeyRelatedField(queryset=Categoria.objects.all(), source='categoria', write_only=True)

    class Meta:
        model = Producto
        fields = ['id', 'nombre', 'autor', 'descripcion', 'contraportada', 'precio', 'imagen', 'categoria', 'categoria_id', 'stock', 'created_at']


class CarritoItemSerializer(serializers.ModelSerializer):
    producto = ProductoSerializer(read_only=True)
    producto_id = serializers.PrimaryKeyRelatedField(queryset=Producto.objects.all(), source='producto', write_only=True)
    subtotal = serializers.ReadOnlyField()

    class Meta:
        model = CarritoItem
        fields = ['id', 'producto', 'producto_id', 'cantidad', 'subtotal', 'created_at']


class CarritoItemCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = CarritoItem
        fields = ['producto', 'cantidad']


class CarritoItemUpdateSerializer(serializers.ModelSerializer):
    """Serializer para actualizar solo la cantidad"""
    class Meta:
        model = CarritoItem
        fields = ['cantidad']
    
    def validate_cantidad(self, value):
        if value < 1:
            raise serializers.ValidationError("La cantidad debe ser al menos 1")
        return value


class CompraItemSerializer(serializers.ModelSerializer):
    """Serializer para items de compra"""
    producto = ProductoSerializer(read_only=True)
    producto_nombre = serializers.CharField(source='producto.nombre', read_only=True)
    producto_imagen = serializers.CharField(source='producto.imagen', read_only=True)
    
    class Meta:
        model = CompraItem
        fields = ['id', 'producto', 'producto_nombre', 'producto_imagen', 'cantidad', 'precio_unitario', 'subtotal']


class CompraSerializer(serializers.ModelSerializer):
    """Serializer para compras completas"""
    items = CompraItemSerializer(many=True, read_only=True)
    total_items = serializers.ReadOnlyField()
    usuario_username = serializers.CharField(source='usuario.username', read_only=True)
    
    class Meta:
        model = Compra
        fields = ['id', 'usuario', 'usuario_username', 'total', 'total_items', 'fecha_compra', 'estado', 'metodo_pago', 'items']
        read_only_fields = ['id', 'fecha_compra']


class CompraCreateSerializer(serializers.ModelSerializer):
    """Serializer para crear una compra desde el carrito"""
    class Meta:
        model = Compra
        fields = ['metodo_pago']
