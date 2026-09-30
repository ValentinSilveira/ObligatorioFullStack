# API de Gestión Veterinaria

Aplicación backend desarrollada para facilitar la gestión de una veterinaria. La API permite registrar e iniciar sesión de usuarios, administrar categorías y gestionar reservas de forma segura.

## Funcionalidades principales

- Registro e inicio de sesión de usuarios.
- Creación, consulta, modificación y eliminación de categorías.
- Creación, consulta, modificación y eliminación de reservas.
- Autenticación mediante tokens.
- Control de acceso según el rol del usuario.
- Generación de códigos QR con la información de una reserva.
- Mejora automática del motivo de una reserva mediante inteligencia artificial.

## Autenticación y roles

Para acceder a las operaciones protegidas es necesario iniciar sesión y enviar un token válido.

Cada usuario nuevo recibe el rol `user` de forma predeterminada. Algunas funcionalidades están reservadas exclusivamente para usuarios con el rol `admin`.

## Integraciones externas

### Generación de códigos QR

La aplicación utiliza una API externa para generar un código QR con los datos de una reserva. Esta funcionalidad se puede probar y verificar desde Postman.

### Mejora de texto con inteligencia artificial

La integración con Gemini mejora el texto ingresado en el campo `motivo` al crear una reserva. El contenido se reformula automáticamente para que sea más claro, prolijo y profesional para el personal veterinario.

Esta funcionalidad también se encuentra disponible mediante un endpoint específico.

## Documentación de la API

La colección y la documentación de los endpoints están disponibles en Postman:

[Ver documentación en Postman](https://documenter.getpostman.com/view/55527769/2sBYB4M7gw)

También se incluye una colección de Postman dentro de la carpeta `test` del proyecto.
