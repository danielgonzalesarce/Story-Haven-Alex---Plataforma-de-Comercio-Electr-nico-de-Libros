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
    {'nombre': 'El Nombre del Viento', 'autor': 'Patrick Rothfuss', 'precio': 19.99, 'imagen': 'producto-01-el-nombre-del-viento.jpg', 'categoria': 1, 'stock': 10, 'descripcion': 'La historia de Kvothe, un personaje legendario que cuenta su propia historia.', 'contraportada': 'En una posada en medio de ninguna parte, un hombre cuenta la historia de su vida. Esta es la historia de Kvothe, el personaje más famoso del mundo, un héroe y un villano, un mago y un músico, un asesino y un salvador. Una historia de aventuras, amor, pérdida y redención que te transportará a un mundo de magia y música.'},
    {'nombre': '1984', 'autor': 'George Orwell', 'precio': 15.99, 'imagen': 'producto-02-1984.jpg', 'categoria': 1, 'stock': 15, 'descripcion': 'Una distopía clásica sobre un futuro totalitario.', 'contraportada': 'En el año 1984, Winston Smith vive en un mundo donde el Gran Hermano lo ve todo, donde el pensamiento es un crimen y donde la verdad es manipulada constantemente. Una obra maestra que explora los peligros del totalitarismo y la pérdida de la libertad individual. Una lectura esencial que sigue siendo relevante hoy en día.'},
    {'nombre': 'Cien Años de Soledad', 'autor': 'Gabriel García Márquez', 'precio': 18.99, 'imagen': 'producto-03-cien-anos-de-soledad.jpg', 'categoria': 1, 'stock': 12, 'descripcion': 'La obra maestra del realismo mágico.', 'contraportada': 'La historia épica de la familia Buendía a lo largo de siete generaciones en el mítico pueblo de Macondo. Una obra maestra del realismo mágico que combina lo fantástico con lo real, creando un universo literario único. Una novela sobre el amor, la soledad, el destino y la memoria que ha cautivado a millones de lectores en todo el mundo.'},
    {'nombre': 'El Señor de los Anillos', 'autor': 'J.R.R. Tolkien', 'precio': 24.99, 'imagen': 'producto-04-el-senor-de-los-anillos.jpg', 'categoria': 1, 'stock': 8, 'descripcion': 'La épica aventura en la Tierra Media.', 'contraportada': 'La épica historia de Frodo Bolsón y su misión para destruir el Anillo Único. Un viaje épico a través de la Tierra Media, lleno de peligros, magia y heroísmo. Una obra maestra de la fantasía que ha definido el género y ha inspirado generaciones de lectores y escritores. Una aventura inolvidable que te transportará a un mundo de hobbits, elfos, enanos y magos.'},
    {'nombre': 'Dune', 'autor': 'Frank Herbert', 'precio': 21.99, 'imagen': 'producto-05-dune.jpg', 'categoria': 1, 'stock': 9, 'descripcion': 'La épica ciencia ficción en el desierto de Arrakis.', 'contraportada': 'En el planeta desértico de Arrakis, también conocido como Dune, se encuentra la especia, la sustancia más valiosa del universo. Paul Atreides debe sobrevivir en este mundo hostil mientras descubre su destino como el Kwisatz Haderach. Una épica historia de política, religión, ecología y poder que ha influenciado la ciencia ficción moderna.'},
    
    # Mangas
    {'nombre': 'One Piece Vol. 1', 'autor': 'Eiichiro Oda', 'precio': 9.99, 'imagen': 'producto-06-one-piece-vol-1.jpg', 'categoria': 2, 'stock': 20, 'descripcion': 'Las aventuras de Monkey D. Luffy y su tripulación.', 'contraportada': 'Monkey D. Luffy es un joven pirata con un sueño: convertirse en el Rey de los Piratas. Con su cuerpo de goma gracias a haber comido una Fruta del Diablo, Luffy se embarca en una aventura épica para encontrar el legendario tesoro One Piece. Una historia llena de acción, humor, amistad y aventuras increíbles en los mares.'},
    {'nombre': 'Naruto Vol. 1', 'autor': 'Masashi Kishimoto', 'precio': 9.99, 'imagen': 'producto-07-naruto-vol-1.jpg', 'categoria': 2, 'stock': 18, 'descripcion': 'La historia de un joven ninja que busca ser reconocido.', 'contraportada': 'Naruto Uzumaki es un joven ninja que lleva sellado dentro de él al Zorro de Nueve Colas, el demonio que atacó su aldea. Rechazado por todos, Naruto tiene un sueño: convertirse en el Hokage, el líder de su aldea. Una historia emocionante sobre la determinación, la amistad y nunca rendirse, sin importar las dificultades.'},
    {'nombre': 'Attack on Titan Vol. 1', 'autor': 'Hajime Isayama', 'precio': 10.99, 'imagen': 'producto-08-attack-on-titan-vol-1.jpg', 'categoria': 2, 'stock': 15, 'descripcion': 'La humanidad lucha por sobrevivir contra los titanes.', 'contraportada': 'La humanidad vive encerrada dentro de tres muros gigantes para protegerse de los titanes, criaturas humanoides que devoran humanos sin razón aparente. Eren Yeager, junto con sus amigos Mikasa y Armin, se une al Cuerpo de Exploración para luchar contra estas criaturas y descubrir la verdad detrás de su existencia. Una historia intensa de supervivencia, misterio y acción.'},
    {'nombre': 'Demon Slayer Vol. 1', 'autor': 'Koyoharu Gotouge', 'precio': 9.99, 'imagen': 'producto-09-demon-slayer-vol-1.jpg', 'categoria': 2, 'stock': 16, 'descripcion': 'Tanjiro se convierte en un cazador de demonios.', 'contraportada': 'Tanjiro Kamado es un joven que se gana la vida vendiendo carbón. Cuando su familia es masacrada por demonios y su hermana Nezuko se convierte en uno, Tanjiro se convierte en un cazador de demonios para encontrar una cura. Una historia emocionante sobre la determinación, el amor familiar y la lucha contra la adversidad con hermosas ilustraciones.'},
    {'nombre': 'My Hero Academia Vol. 1', 'autor': 'Kohei Horikoshi', 'precio': 9.99, 'imagen': 'producto-10-my-hero-academia-vol-1.jpg', 'categoria': 2, 'stock': 17, 'descripcion': 'Izuku Midoriya sueña con convertirse en un héroe.', 'contraportada': 'En un mundo donde la mayoría de las personas tienen superpoderes llamados "Quirks", Izuku Midoriya es uno de los pocos que nació sin uno. Sin embargo, su sueño de convertirse en un héroe nunca muere. Cuando el héroe número uno, All Might, le ofrece su poder, Izuku comienza su camino para convertirse en el mejor héroe. Una historia inspiradora sobre el heroísmo y nunca rendirse.'},
    
    # Novelas Gráficas
    {'nombre': 'Watchmen', 'autor': 'Alan Moore', 'precio': 22.99, 'imagen': 'producto-11-watchmen.jpg', 'categoria': 3, 'stock': 7, 'descripcion': 'Una de las novelas gráficas más influyentes de todos los tiempos.', 'contraportada': 'En un mundo alternativo donde los superhéroes existen pero han sido prohibidos, un asesinato desencadena una investigación que revela una conspiración que amenaza con destruir el mundo. Una obra maestra que deconstruye el género de superhéroes, explorando temas de poder, moralidad, política y la naturaleza humana. Considerada una de las mejores novelas gráficas de todos los tiempos.'},
    {'nombre': 'V de Vendetta', 'autor': 'Alan Moore', 'precio': 19.99, 'imagen': 'producto-12-v-de-vendetta.jpg', 'categoria': 3, 'stock': 8, 'descripcion': 'Una distopía sobre resistencia y libertad.', 'contraportada': 'En una Inglaterra futura gobernada por un régimen fascista, un misterioso enmascarado conocido como V lucha contra la opresión y la tiranía. Una poderosa historia sobre la resistencia, la libertad y el poder de las ideas. Una obra que explora temas de anarquía, fascismo y la lucha por la libertad individual en un mundo totalitario.'},
    {'nombre': 'Maus', 'autor': 'Art Spiegelman', 'precio': 18.99, 'imagen': 'producto-13-maus.jpg', 'categoria': 3, 'stock': 6, 'descripcion': 'La historia del Holocausto contada a través de animales.', 'contraportada': 'Una conmovedora historia autobiográfica que narra la experiencia del padre del autor durante el Holocausto, usando animales para representar diferentes grupos étnicos. Una obra maestra que combina el testimonio histórico con la narrativa personal, creando una de las representaciones más poderosas del Holocausto en el medio del cómic. Ganadora del Premio Pulitzer.'},
    {'nombre': 'Persépolis', 'autor': 'Marjane Satrapi', 'precio': 17.99, 'imagen': 'producto-14-persepolis.jpg', 'categoria': 3, 'stock': 9, 'descripcion': 'Memoria gráfica de una niña en Irán.', 'contraportada': 'La historia autobiográfica de Marjane Satrapi, que crece en Irán durante la Revolución Islámica. Una conmovedora memoria que explora temas de identidad, libertad, opresión y la búsqueda de uno mismo. Una obra que muestra la vida cotidiana durante tiempos turbulentos, combinando lo personal con lo político de manera única y poderosa.'},
    {'nombre': 'Saga Vol. 1', 'autor': 'Brian K. Vaughan', 'precio': 16.99, 'imagen': 'producto-15-saga-vol-1.jpg', 'categoria': 3, 'stock': 11, 'descripcion': 'Una épica historia de ciencia ficción y fantasía.', 'contraportada': 'Una épica historia de ciencia ficción y fantasía que sigue a una joven familia mientras intentan sobrevivir en una guerra galáctica. Marko y Alana son de razas enemigas, pero su amor los une. Ahora deben proteger a su hija recién nacida mientras huyen de ambos bandos de la guerra. Una historia innovadora sobre el amor, la familia y la supervivencia en un universo lleno de peligros.'},
    
    # Libros de No Ficción
    {'nombre': 'Sapiens', 'autor': 'Yuval Noah Harari', 'precio': 20.99, 'imagen': 'producto-16-sapiens.jpg', 'categoria': 4, 'stock': 13, 'descripcion': 'Una breve historia de la humanidad.', 'contraportada': 'Un recorrido fascinante por la historia de la humanidad, desde la aparición del Homo sapiens hasta la actualidad. Harari explora cómo nuestra especie conquistó el mundo, cómo desarrollamos la agricultura, las ciudades, las religiones y el dinero. Una obra que desafía nuestras ideas sobre quiénes somos y cómo llegamos aquí, combinando historia, biología y filosofía de manera accesible y reveladora.'},
    {'nombre': 'El Gen Egoísta', 'autor': 'Richard Dawkins', 'precio': 18.99, 'imagen': 'producto-17-el-gen-egoista.jpg', 'categoria': 4, 'stock': 10, 'descripcion': 'Una perspectiva revolucionaria sobre la evolución.', 'contraportada': 'Una obra revolucionaria que presenta la teoría de que los genes son la unidad fundamental de la evolución. Dawkins explica cómo los genes compiten por la supervivencia y cómo esto da forma al comportamiento de los organismos. Una perspectiva fascinante sobre la evolución que ha influenciado profundamente nuestra comprensión de la biología y el comportamiento humano.'},
    {'nombre': 'Breve Historia del Tiempo', 'autor': 'Stephen Hawking', 'precio': 19.99, 'imagen': 'producto-18-breve-historia-del-tiempo.jpg', 'categoria': 4, 'stock': 12, 'descripcion': 'Los misterios del universo explicados de forma accesible.', 'contraportada': 'Una exploración accesible de los conceptos más complejos de la física moderna, desde el Big Bang hasta los agujeros negros. Hawking explica de manera clara y fascinante los misterios del universo, el tiempo, el espacio y las leyes que gobiernan nuestro cosmos. Una obra que ha hecho accesible la cosmología a millones de lectores en todo el mundo.'},
    {'nombre': 'Educated', 'autor': 'Tara Westover', 'precio': 17.99, 'imagen': 'producto-19-educated.jpg', 'categoria': 4, 'stock': 14, 'descripcion': 'Una memoria sobre educación y autodescubrimiento.', 'contraportada': 'La poderosa memoria de Tara Westover, que creció en una familia mormona fundamentalista en las montañas de Idaho sin educación formal. A los 17 años, ingresó a un aula por primera vez. Su búsqueda del conocimiento la llevó a Harvard y Cambridge, pero también la alejó de su familia. Una historia conmovedora sobre el poder de la educación y el precio de la autodeterminación.'},
    {'nombre': 'El Poder del Ahora', 'autor': 'Eckhart Tolle', 'precio': 16.99, 'imagen': 'producto-20-el-poder-del-ahora.jpg', 'categoria': 4, 'stock': 15, 'descripcion': 'Una guía espiritual para la iluminación.', 'contraportada': 'Una guía transformadora para la iluminación espiritual que enseña cómo liberarse del dolor y el sufrimiento psicológico. Tolle explica cómo vivir en el presente y encontrar la paz interior. Una obra que ha ayudado a millones de personas a encontrar la serenidad y la felicidad en sus vidas, combinando sabiduría espiritual con consejos prácticos.'},
    
    # Cómics
    {'nombre': 'Batman: El Caballero Oscuro', 'autor': 'Frank Miller', 'precio': 23.99, 'imagen': 'producto-21-batman-el-caballero-oscuro.jpg', 'categoria': 5, 'stock': 5, 'descripcion': 'La historia definitiva del Caballero Oscuro.', 'contraportada': 'Una visión oscura y madura de Batman en sus últimos años como vigilante. En un Gotham corrupto y violento, un Batman envejecido debe enfrentarse una vez más a sus enemigos más peligrosos. Una obra que redefinió el personaje de Batman, presentándolo como un antihéroe complejo y moralmente ambiguo. Considerada una de las mejores historias de Batman jamás escritas.'},
    {'nombre': 'Spider-Man: La Última Cacería', 'autor': 'J.M. DeMatteis', 'precio': 21.99, 'imagen': 'producto-22-spider-man-la-ultima-caceria.jpg', 'categoria': 5, 'stock': 6, 'descripcion': 'Una de las historias más oscuras de Spider-Man.', 'contraportada': 'Una de las historias más oscuras y psicológicamente complejas de Spider-Man. Kraven el Cazador, creyendo que ha fallado en su misión de vida, se suicida y deja un testamento que desencadena una serie de eventos que llevan a Spider-Man a cuestionar su identidad y propósito. Una exploración profunda de la psique del Hombre Araña y sus demonios internos.'},
    {'nombre': 'X-Men: Días del Futuro Pasado', 'autor': 'Chris Claremont', 'precio': 20.99, 'imagen': 'producto-23-x-men-dias-del-futuro-pasado.jpg', 'categoria': 5, 'stock': 7, 'descripcion': 'Los X-Men viajan al pasado para salvar el futuro.', 'contraportada': 'En un futuro distópico donde los mutantes son cazados y asesinados por los Centinelas, Kitty Pryde debe viajar al pasado para prevenir el evento que desencadenó esta pesadilla. Una historia épica de viajes en el tiempo que explora temas de destino, sacrificio y esperanza. Una de las historias más icónicas de los X-Men que ha influenciado múltiples adaptaciones.'},
    {'nombre': 'The Walking Dead Vol. 1', 'autor': 'Robert Kirkman', 'precio': 15.99, 'imagen': 'producto-24-the-walking-dead-vol-1.jpg', 'categoria': 5, 'stock': 8, 'descripcion': 'La supervivencia en un mundo post-apocalíptico.', 'contraportada': 'Rick Grimes despierta de un coma para descubrir que el mundo ha sido invadido por zombis. Debe encontrar a su familia y aprender a sobrevivir en este nuevo mundo peligroso. Una historia intensa de supervivencia que explora cómo las personas cambian cuando se enfrentan a la extinción. No es solo sobre zombis, sino sobre la humanidad y las decisiones difíciles que debemos tomar.'},
    {'nombre': 'Sandman Vol. 1', 'autor': 'Neil Gaiman', 'precio': 19.99, 'imagen': 'producto-25-sandman-vol-1.jpg', 'categoria': 5, 'stock': 9, 'descripcion': 'La historia del Señor de los Sueños.', 'contraportada': 'Después de ser encarcelado durante 70 años, Morfeo, el Señor de los Sueños, escapa y debe recuperar sus objetos de poder para restaurar su reino. Una obra maestra que combina mitología, literatura, horror y fantasía. Gaiman crea un universo rico y complejo donde los sueños y la realidad se entrelazan, explorando temas de poder, responsabilidad y la naturaleza de la existencia.'},
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
                self.stdout.write(self.style.SUCCESS(f'[OK] Categoria creada: {categoria.nombre}'))
            else:
                self.stdout.write(self.style.WARNING(f'[INFO] Categoria ya existe: {categoria.nombre}'))

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
                    'contraportada': prod_data.get('contraportada', prod_data['descripcion']),
                }
            )
            if created:
                self.stdout.write(self.style.SUCCESS(f'[OK] Producto creado: {producto.nombre}'))
            else:
                # Actualizar contraportada si no existe o está vacía
                if not producto.contraportada and prod_data.get('contraportada'):
                    producto.contraportada = prod_data['contraportada']
                    producto.save()
                    self.stdout.write(self.style.SUCCESS(f'[OK] Contraportada actualizada: {producto.nombre}'))
                else:
                    self.stdout.write(self.style.WARNING(f'[INFO] Producto ya existe: {producto.nombre}'))

        self.stdout.write(self.style.SUCCESS('\n[OK] Datos poblados exitosamente!'))

