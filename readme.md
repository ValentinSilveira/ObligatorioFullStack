Creamos una aplicacion para veterinarias, la cual puede registrar y loguear usuarios, crear categorias y reservas.

En esa aplicacion, se puede ver, modificar, eliminar y listar, tanto las categorias como las  reservas. Para eso es necesario estar logueado y se valida por token. 
Hay funciones que solo estan disponibles para el rol admin (cada usuario que se registra queda con rol "user" de forma predeterminada).

Ademas tenemos una api externa la cual te muestra un codigo QR con los datos de la reserva que se puede probar y verificar por postman. 

Con la IA lo que implementamos fue un arreglo en el texto que ingresa el usuario (parametro "motivo" del body de la reserva) para dejarlo un poco mas prolijo y formal. Una vez que el usuario registra la reserva, este motivo quedara modificado con un formato mas profesial para un veterinario gracias a la IA de Gemini. Eso se puede probar tambien por endpoint.

URL de Postamn: https://documenter.getpostman.com/view/55527769/2sBYB4M7gw