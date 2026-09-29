Creamos una aplicacion para veterinarias, la cual puede registrar usuarios, crear categorias y reservas.
En la misma se puede aparte de registrar, modificar, eliminar y listar, tanto las categorias como las  reservas,
es necesario estar logueado y se valida por token, hay funciones que solo estan disponibles para el rol admin. Cada usuario que se registra queda con rol "user" de forma predeterminada.
Tenemos una api externa la cual te muestra un codigo QR con los datos de la reserva, con la IA lo que implementamos fue un arreglo en el texto que ingresa el usuario para dejarlo un poco mas prolijo y formal, esto mismo es en la creacion de la reserva y modifica el motivo.
