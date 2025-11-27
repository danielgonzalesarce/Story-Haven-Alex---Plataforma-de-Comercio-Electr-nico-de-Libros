from rest_framework import generics, status, viewsets
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.models import User
from django.db.models import Q
from django.utils.crypto import get_random_string

from .models import Categoria, Producto, CarritoItem, Compra, CompraItem
from .serializers import (
    RegisterSerializer, UserSerializer, UserUpdateSerializer, ChangePasswordSerializer,
    CategoriaSerializer, ProductoSerializer, CarritoItemSerializer, CarritoItemCreateSerializer,
    CarritoItemUpdateSerializer, CompraSerializer, CompraCreateSerializer, CompraItemSerializer
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
    """Login de usuario - acepta username o email"""
    from django.contrib.auth import authenticate
    
    username_or_email = request.data.get('username')
    password = request.data.get('password')
    
    if username_or_email and password:
        # Intentar autenticar primero con username
        user = authenticate(username=username_or_email, password=password)
        
        # Si no funciona, intentar con email
        if not user:
            try:
                user_obj = User.objects.get(email=username_or_email)
                user = authenticate(username=user_obj.username, password=password)
            except User.DoesNotExist:
                user = None
        
        if user:
            refresh = RefreshToken.for_user(user)
            return Response({
                'user': UserSerializer(user).data,
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }, status=status.HTTP_200_OK)
        return Response({'error': 'Credenciales inválidas'}, status=status.HTTP_401_UNAUTHORIZED)
    return Response({'error': 'Se requiere username/email y password'}, status=status.HTTP_400_BAD_REQUEST)


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
        elif self.action in ['update', 'partial_update']:
            return CarritoItemUpdateSerializer
        return CarritoItemSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        producto = serializer.validated_data['producto']
        cantidad = serializer.validated_data.get('cantidad', 1)
        
        # Validar cantidad mínima
        if cantidad < 1:
            return Response(
                {'error': 'La cantidad debe ser al menos 1'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
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
                nueva_cantidad = carrito_item.cantidad + cantidad
            else:
                nueva_cantidad = cantidad
        else:
            carrito_item, created = CarritoItem.objects.get_or_create(
                session_key=session_key,
                producto=producto,
                defaults={'cantidad': cantidad}
            )
            if not created:
                nueva_cantidad = carrito_item.cantidad + cantidad
            else:
                nueva_cantidad = cantidad
        
        # Validar stock disponible
        if nueva_cantidad > producto.stock:
            return Response(
                {'error': f'Stock insuficiente. Solo hay {producto.stock} unidades disponibles'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if not created:
            carrito_item.cantidad = nueva_cantidad
            carrito_item.save()
        
        response_serializer = CarritoItemSerializer(carrito_item)
        headers = self.get_success_headers(response_serializer.data)
        
        response_data = response_serializer.data
        if not request.user.is_authenticated:
            response_data['session_key'] = session_key
        
        return Response(response_data, status=status.HTTP_201_CREATED, headers=headers)
    
    def update(self, request, *args, **kwargs):
        """Actualizar cantidad del item del carrito"""
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        
        # Validar que el usuario tiene acceso a este item
        user = request.user
        session_key = request.query_params.get('session_key', None)
        
        if user.is_authenticated:
            if instance.usuario != user:
                return Response(
                    {'error': 'No tienes permiso para modificar este item'},
                    status=status.HTTP_403_FORBIDDEN
                )
        else:
            if instance.session_key != session_key:
                return Response(
                    {'error': 'No tienes permiso para modificar este item'},
                    status=status.HTTP_403_FORBIDDEN
                )
        
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        
        cantidad = serializer.validated_data.get('cantidad', instance.cantidad)
        
        # Validar stock disponible
        if cantidad > instance.producto.stock:
            return Response(
                {'error': f'Stock insuficiente. Solo hay {instance.producto.stock} unidades disponibles'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        serializer.save()
        
        # Retornar con el serializer completo
        response_serializer = CarritoItemSerializer(instance)
        return Response(response_serializer.data)
    
    def partial_update(self, request, *args, **kwargs):
        """Actualización parcial (PATCH)"""
        kwargs['partial'] = True
        return self.update(request, *args, **kwargs)

    @action(detail=False, methods=['get'])
    def total(self, request):
        """Obtener el total del carrito"""
        queryset = self.get_queryset()
        total = sum(item.subtotal for item in queryset)
        return Response({'total': float(total)})

    def destroy(self, request, *args, **kwargs):
        """Eliminar item del carrito con validación de permisos"""
        instance = self.get_object()
        
        # Validar que el usuario tiene acceso a este item
        user = request.user
        session_key = request.query_params.get('session_key', None)
        
        if user.is_authenticated:
            if instance.usuario != user:
                return Response(
                    {'error': 'No tienes permiso para eliminar este item'},
                    status=status.HTTP_403_FORBIDDEN
                )
        else:
            if instance.session_key != session_key:
                return Response(
                    {'error': 'No tienes permiso para eliminar este item'},
                    status=status.HTTP_403_FORBIDDEN
                )
        
        return super().destroy(request, *args, **kwargs)

    @action(detail=False, methods=['post'])
    def checkout(self, request):
        """Procesar checkout y crear compra"""
        if not request.user.is_authenticated:
            return Response(
                {'error': 'Debes estar autenticado para realizar una compra'},
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        # Obtener items del carrito del usuario
        carrito_items = CarritoItem.objects.filter(usuario=request.user)
        
        if not carrito_items.exists():
            return Response(
                {'error': 'Tu carrito está vacío'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Calcular total
        total = sum(item.subtotal for item in carrito_items)
        
        # Validar stock antes de crear la compra
        for item in carrito_items:
            if item.cantidad > item.producto.stock:
                return Response(
                    {'error': f'Stock insuficiente para {item.producto.nombre}. Solo hay {item.producto.stock} unidades disponibles'},
                    status=status.HTTP_400_BAD_REQUEST
                )
        
        # Obtener método de pago (por defecto 'stripe')
        metodo_pago = request.data.get('metodo_pago', 'stripe')
        
        # Crear la compra
        compra = Compra.objects.create(
            usuario=request.user,
            total=total,
            metodo_pago=metodo_pago
        )
        
        # Crear items de compra y actualizar stock
        for item in carrito_items:
            CompraItem.objects.create(
                compra=compra,
                producto=item.producto,
                cantidad=item.cantidad,
                precio_unitario=item.producto.precio
            )
            # Reducir stock
            item.producto.stock -= item.cantidad
            item.producto.save()
        
        # Eliminar items del carrito
        carrito_items.delete()
        
        # Serializar y retornar la compra
        serializer = CompraSerializer(compra)
        return Response({
            'message': 'Compra realizada exitosamente',
            'compra': serializer.data
        }, status=status.HTTP_201_CREATED)


class CompraViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet para ver historial de compras"""
    serializer_class = CompraSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = None  # Desactivar paginación para compras
    
    def get_queryset(self):
        """Solo mostrar compras del usuario autenticado"""
        if not self.request.user.is_authenticated:
            return Compra.objects.none()
        return Compra.objects.filter(usuario=self.request.user).prefetch_related('items__producto').order_by('-fecha_compra')


@api_view(['GET', 'PUT', 'PATCH'])
@permission_classes([IsAuthenticated])
def perfil_usuario(request):
    """Obtener o actualizar perfil del usuario autenticado"""
    user = request.user
    
    if request.method == 'GET':
        serializer = UserSerializer(user)
        return Response(serializer.data)
    
    elif request.method in ['PUT', 'PATCH']:
        serializer = UserUpdateSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            # Actualizar el token si el username cambió
            refresh = RefreshToken.for_user(user)
            return Response({
                'user': UserSerializer(user).data,
                'access': str(refresh.access_token),
                'message': 'Perfil actualizado correctamente'
            }, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def cambiar_password(request):
    """Cambiar contraseña del usuario autenticado"""
    user = request.user
    serializer = ChangePasswordSerializer(data=request.data)
    
    if serializer.is_valid():
        # Verificar contraseña actual
        if not user.check_password(serializer.validated_data['old_password']):
            return Response(
                {'old_password': ['La contraseña actual es incorrecta.']},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Establecer nueva contraseña
        user.set_password(serializer.validated_data['new_password'])
        user.save()
        
        return Response(
            {'message': 'Contraseña actualizada correctamente'},
            status=status.HTTP_200_OK
        )
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def list(self, request, *args, **kwargs):
        """Sobrescribir list para asegurar que siempre devuelva una lista"""
        queryset = self.filter_queryset(self.get_queryset())
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
