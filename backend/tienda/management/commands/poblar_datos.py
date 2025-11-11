from django.core.management.base import BaseCommand
from tienda.models import Categoria, Producto

# Datos de ejemplo
CATEGORIAS = [
    {'nombre': 'Libros de Ficción', 'descripcion': 'Novelas de ficción y fantasía'},
    {'nombre': 'Mangas', 'descripcion': 'Mangas japoneses'},
    {'nombre': 'Novelas Gráficas', 'descripcion': 'Novelas gráficas y cómics para adultos'},
    {'nombre': 'Libros de No Ficción', 'descripcion': 'Libros de no ficción y ensayos'},
    {'nombre': 'Cómics', 'descripcion': 'Cómics y novelas gráficas'},
]

PRODUCTOS = [
    # Libros de Ficción
    {'nombre': 'El Nombre del Viento', 'autor': 'Patrick Rothfuss', 'precio': 19.99, 'imagen': 'producto-01-el-nombre-del-viento.jpg', 'categoria': 1, 'stock': 10, 'descripcion': 'La historia de Kvothe, un personaje legendario que cuenta su propia historia.'},
    {'nombre': '1984', 'autor': 'George Orwell', 'precio': 15.99, 'imagen': 'producto-02-1984.jpg', 'categoria': 1, 'stock': 15, 'descripcion': 'Una distopía clásica sobre un futuro totalitario.'},
    {'nombre': 'Cien Años de Soledad', 'autor': 'Gabriel García Márquez', 'precio': 18.99, 'imagen': 'producto-03-cien-anos-de-soledad.jpg', 'categoria': 1, 'stock': 12, 'descripcion': 'La obra maestra del realismo mágico.'},
    {'nombre': 'El Señor de los Anillos', 'autor': 'J.R.R. Tolkien', 'precio': 24.99, 'imagen': 'producto-04-el-senor-de-los-anillos.jpg', 'categoria': 1, 'stock': 8, 'descripcion': 'La épica aventura en la Tierra Media.'},
    {'nombre': 'Dune', 'autor': 'Frank Herbert', 'precio': 21.99, 'imagen': 'producto-05-dune.jpg', 'categoria': 1, 'stock': 9, 'descripcion': 'La épica ciencia ficción en el desierto de Arrakis.'},
    
    # Mangas
    {'nombre': 'One Piece Vol. 1', 'autor': 'Eiichiro Oda', 'precio': 9.99, 'imagen': 'producto-06-one-piece-vol-1.jpg', 'categoria': 2, 'stock': 20, 'descripcion': 'Las aventuras de Monkey D. Luffy y su tripulación.'},
    {'nombre': 'Naruto Vol. 1', 'autor': 'Masashi Kishimoto', 'precio': 9.99, 'imagen': 'producto-07-naruto-vol-1.jpg', 'categoria': 2, 'stock': 18, 'descripcion': 'La historia de un joven ninja que busca ser reconocido.'},
    {'nombre': 'Attack on Titan Vol. 1', 'autor': 'Hajime Isayama', 'precio': 10.99, 'imagen': 'producto-08-attack-on-titan-vol-1.jpg', 'categoria': 2, 'stock': 15, 'descripcion': 'La humanidad lucha por sobrevivir contra los titanes.'},
    {'nombre': 'Demon Slayer Vol. 1', 'autor': 'Koyoharu Gotouge', 'precio': 9.99, 'imagen': 'producto-09-demon-slayer-vol-1.jpg', 'categoria': 2, 'stock': 16, 'descripcion': 'Tanjiro se convierte en un cazador de demonios.'},
    {'nombre': 'My Hero Academia Vol. 1', 'autor': 'Kohei Horikoshi', 'precio': 9.99, 'imagen': 'producto-10-my-hero-academia-vol-1.jpg', 'categoria': 2, 'stock': 17, 'descripcion': 'Izuku Midoriya sueña con convertirse en un héroe.'},
    
    # Novelas Gráficas
    {'nombre': 'Watchmen', 'autor': 'Alan Moore', 'precio': 22.99, 'imagen': 'producto-11-watchmen.jpg', 'categoria': 3, 'stock': 7, 'descripcion': 'Una de las novelas gráficas más influyentes de todos los tiempos.'},
    {'nombre': 'V de Vendetta', 'autor': 'Alan Moore', 'precio': 19.99, 'imagen': 'producto-12-v-de-vendetta.jpg', 'categoria': 3, 'stock': 8, 'descripcion': 'Una distopía sobre resistencia y libertad.'},
    {'nombre': 'Maus', 'autor': 'Art Spiegelman', 'precio': 18.99, 'imagen': 'producto-13-maus.jpg', 'categoria': 3, 'stock': 6, 'descripcion': 'La historia del Holocausto contada a través de animales.'},
    {'nombre': 'Persépolis', 'autor': 'Marjane Satrapi', 'precio': 17.99, 'imagen': 'producto-14-persepolis.jpg', 'categoria': 3, 'stock': 9, 'descripcion': 'Memoria gráfica de una niña en Irán.'},
    {'nombre': 'Saga Vol. 1', 'autor': 'Brian K. Vaughan', 'precio': 16.99, 'imagen': 'producto-15-saga-vol-1.jpg', 'categoria': 3, 'stock': 11, 'descripcion': 'Una épica historia de ciencia ficción y fantasía.'},
    
    # Libros de No Ficción
    {'nombre': 'Sapiens', 'autor': 'Yuval Noah Harari', 'precio': 20.99, 'imagen': 'producto-16-sapiens.jpg', 'categoria': 4, 'stock': 13, 'descripcion': 'Una breve historia de la humanidad.'},
    {'nombre': 'El Gen Egoísta', 'autor': 'Richard Dawkins', 'precio': 18.99, 'imagen': 'producto-17-el-gen-egoista.jpg', 'categoria': 4, 'stock': 10, 'descripcion': 'Una perspectiva revolucionaria sobre la evolución.'},
    {'nombre': 'Breve Historia del Tiempo', 'autor': 'Stephen Hawking', 'precio': 19.99, 'imagen': 'producto-18-breve-historia-del-tiempo.jpg', 'categoria': 4, 'stock': 12, 'descripcion': 'Los misterios del universo explicados de forma accesible.'},
    {'nombre': 'Educated', 'autor': 'Tara Westover', 'precio': 17.99, 'imagen': 'producto-19-educated.jpg', 'categoria': 4, 'stock': 14, 'descripcion': 'Una memoria sobre educación y autodescubrimiento.'},
    {'nombre': 'El Poder del Ahora', 'autor': 'Eckhart Tolle', 'precio': 16.99, 'imagen': 'producto-20-el-poder-del-ahora.jpg', 'categoria': 4, 'stock': 15, 'descripcion': 'Una guía espiritual para la iluminación.'},
    
    # Cómics
    {'nombre': 'Batman: El Caballero Oscuro', 'autor': 'Frank Miller', 'precio': 23.99, 'imagen': 'producto-21-batman-el-caballero-oscuro.jpg', 'categoria': 5, 'stock': 5, 'descripcion': 'La historia definitiva del Caballero Oscuro.'},
    {'nombre': 'Spider-Man: La Última Cacería', 'autor': 'J.M. DeMatteis', 'precio': 21.99, 'imagen': 'producto-22-spider-man-la-ultima-caceria.jpg', 'categoria': 5, 'stock': 6, 'descripcion': 'Una de las historias más oscuras de Spider-Man.'},
    {'nombre': 'X-Men: Días del Futuro Pasado', 'autor': 'Chris Claremont', 'precio': 20.99, 'imagen': 'producto-23-x-men-dias-del-futuro-pasado.jpg', 'categoria': 5, 'stock': 7, 'descripcion': 'Los X-Men viajan al pasado para salvar el futuro.'},
    {'nombre': 'The Walking Dead Vol. 1', 'autor': 'Robert Kirkman', 'precio': 15.99, 'imagen': 'producto-24-the-walking-dead-vol-1.jpg', 'categoria': 5, 'stock': 8, 'descripcion': 'La supervivencia en un mundo post-apocalíptico.'},
    {'nombre': 'Sandman Vol. 1', 'autor': 'Neil Gaiman', 'precio': 19.99, 'imagen': 'producto-25-sandman-vol-1.jpg', 'categoria': 5, 'stock': 9, 'descripcion': 'La historia del Señor de los Sueños.'},
]


class Command(BaseCommand):
    help = 'Pobla la base de datos con categorías y productos de ejemplo'

    def handle(self, *args, **options):
        self.stdout.write('Creando categorías...')
        categorias_dict = {}
        for cat_data in CATEGORIAS:
            categoria, created = Categoria.objects.get_or_create(
                nombre=cat_data['nombre'],
                defaults={'descripcion': cat_data['descripcion']}
            )
            categorias_dict[cat_data['nombre']] = categoria
            if created:
                self.stdout.write(self.style.SUCCESS(f'✓ Categoría creada: {categoria.nombre}'))
            else:
                self.stdout.write(self.style.WARNING(f'→ Categoría ya existe: {categoria.nombre}'))

        self.stdout.write('\nCreando productos...')
        for prod_data in PRODUCTOS:
            categoria_nombre = None
            if prod_data['categoria'] == 1:
                categoria_nombre = 'Libros de Ficción'
            elif prod_data['categoria'] == 2:
                categoria_nombre = 'Mangas'
            elif prod_data['categoria'] == 3:
                categoria_nombre = 'Novelas Gráficas'
            elif prod_data['categoria'] == 4:
                categoria_nombre = 'Libros de No Ficción'
            elif prod_data['categoria'] == 5:
                categoria_nombre = 'Cómics'

            categoria = categorias_dict.get(categoria_nombre)
            if not categoria:
                continue

            producto, created = Producto.objects.get_or_create(
                nombre=prod_data['nombre'],
                defaults={
                    'autor': prod_data['autor'],
                    'precio': prod_data['precio'],
                    'imagen': prod_data['imagen'],
                    'categoria': categoria,
                    'stock': prod_data['stock'],
                    'descripcion': prod_data['descripcion'],
                }
            )
            if created:
                self.stdout.write(self.style.SUCCESS(f'✓ Producto creado: {producto.nombre}'))
            else:
                self.stdout.write(self.style.WARNING(f'→ Producto ya existe: {producto.nombre}'))

        self.stdout.write(self.style.SUCCESS('\n✓ Datos poblados exitosamente!'))

