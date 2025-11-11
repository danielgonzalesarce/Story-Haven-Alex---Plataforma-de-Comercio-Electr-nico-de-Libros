from rest_framework import generics, status, viewsets
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.models import User
from django.db.models import Q
from django.utils.crypto import get_random_string

from .models import Categoria, Producto, CarritoItem
from .serializers import (
    RegisterSerializer, UserSerializer, CategoriaSerializer,
    ProductoSerializer, CarritoItemSerializer, CarritoItemCreateSerializer
)


@api_view(['POST'])
@permission_classes([AllowAny])
def registro_usuario(request):
    """Registro de nuevo usuario"""
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        return Response({
            'user': UserSerializer(user).data,
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def login_usuario(request):
    """Login de usuario"""
    from django.contrib.auth import authenticate
    
    username = request.data.get('username')
    password = request.data.get('password')
    
    if username and password:
        user = authenticate(username=username, password=password)
        if user:
            refresh = RefreshToken.for_user(user)
            return Response({
                'user': UserSerializer(user).data,
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }, status=status.HTTP_200_OK)
        return Response({'error': 'Credenciales inválidas'}, status=status.HTTP_401_UNAUTHORIZED)
    return Response({'error': 'Se requiere username y password'}, status=status.HTTP_400_BAD_REQUEST)


class CategoriaViewSet(viewsets.ReadOnlyModelViewSet):
    """Listado y detalle de categorías"""
    queryset = Categoria.objects.all()
    serializer_class = CategoriaSerializer
    permission_classes = [AllowAny]
    pagination_class = None  # Desactivar paginación para categorías


class ProductoViewSet(viewsets.ReadOnlyModelViewSet):
    """Listado y detalle de productos con filtros"""
    queryset = Producto.objects.all()
    serializer_class = ProductoSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        queryset = Producto.objects.all()
        
        # Filtro por categoría
        categoria = self.request.query_params.get('categoria', None)
        if categoria:
            queryset = queryset.filter(categoria_id=categoria)
        
        # Filtro por precio mínimo
        precio_min = self.request.query_params.get('precio_min', None)
        if precio_min:
            queryset = queryset.filter(precio__gte=precio_min)
        
        # Filtro por precio máximo
        precio_max = self.request.query_params.get('precio_max', None)
        if precio_max:
            queryset = queryset.filter(precio__lte=precio_max)
        
        # Búsqueda por nombre o autor
        search = self.request.query_params.get('search', None)
        if search:
            queryset = queryset.filter(
                Q(nombre__icontains=search) | Q(autor__icontains=search)
            )
        
        # Ordenamiento
        ordering = self.request.query_params.get('ordering', None)
        if ordering:
            queryset = queryset.order_by(ordering)
        
        return queryset


class CarritoViewSet(viewsets.ModelViewSet):
    """Gestión del carrito"""
    serializer_class = CarritoItemSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        user = self.request.user
        session_key = self.request.query_params.get('session_key', None)
        
        if user.is_authenticated:
            return CarritoItem.objects.filter(usuario=user)
        elif session_key:
            return CarritoItem.objects.filter(session_key=session_key)
        else:
            return CarritoItem.objects.none()

    def get_serializer_class(self):
        if self.action == 'create':
            return CarritoItemCreateSerializer
        return CarritoItemSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        producto = serializer.validated_data['producto']
        cantidad = serializer.validated_data.get('cantidad', 1)
        
        # Obtener o generar session_key para usuarios invitados
        session_key = request.data.get('session_key', None)
        if not request.user.is_authenticated and not session_key:
            session_key = get_random_string(40)
        
        # Buscar si ya existe el item en el carrito
        if request.user.is_authenticated:
            carrito_item, created = CarritoItem.objects.get_or_create(
                usuario=request.user,
                producto=producto,
                defaults={'cantidad': cantidad}
            )
            if not created:
                carrito_item.cantidad += cantidad
                carrito_item.save()
        else:
            carrito_item, created = CarritoItem.objects.get_or_create(
                session_key=session_key,
                producto=producto,
                defaults={'cantidad': cantidad}
            )
            if not created:
                carrito_item.cantidad += cantidad
                carrito_item.save()
        
        response_serializer = CarritoItemSerializer(carrito_item)
        headers = self.get_success_headers(response_serializer.data)
        
        response_data = response_serializer.data
        if not request.user.is_authenticated:
            response_data['session_key'] = session_key
        
        return Response(response_data, status=status.HTTP_201_CREATED, headers=headers)

    @action(detail=False, methods=['get'])
    def total(self, request):
        """Obtener el total del carrito"""
        queryset = self.get_queryset()
        total = sum(item.subtotal for item in queryset)
        return Response({'total': float(total)})

    @action(detail=False, methods=['post'])
    def checkout(self, request):
        """Mensaje de checkout en desarrollo"""
        return Response({
            'message': 'Funcionalidad de compra actualmente en desarrollo'
        }, status=status.HTTP_503_SERVICE_UNAVAILABLE)
