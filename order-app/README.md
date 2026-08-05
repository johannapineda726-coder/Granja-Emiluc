# order-app (Granja Emiluc)

Esta carpeta contiene una app web estática para tomar pedidos y enviarlos por WhatsApp al número +57 350 518 2091.

Archivos:
- index.html — interfaz de catálogo y carrito.
- styles.css — estilos.
- app.js — lógica del carrito y generación del mensaje para WhatsApp.
- products.json — lista de productos (editar aquí para cambiar catálogo).

Instalación y despliegue rápido:
1. Los archivos ya están en la carpeta `order-app/` del repo.
2. Para probar localmente: abre `order-app/index.html` en el navegador (o usa un servidor estático).
3. Para publicar en GitHub Pages:
   - Ve a Settings > Pages en el repositorio.
   - Selecciona la rama `main` y la carpeta `/ (root)` y guarda.
   - La URL pública será algo como: `https://johannapineda726-coder.github.io/Granja-Emiluc/order-app/` (puede tardar unos minutos en activarse).

Uso:
- El cliente añade productos al carrito, completa nombre/teléfono/dirección y presiona "Enviar por WhatsApp".
- La app abrirá WhatsApp Web o la app móvil con el pedido prellenado listo para enviar al número de Granja Emiluc.

Notas y mejoras posibles:
- Integrar imágenes reales en `products.json`.
- Validaciones de teléfono y datos del cliente.
- Conectar con Google Sheets o backend para almacenar pedidos.
- Hacer una PWA para instalación en móviles.

Contacto: WhatsApp Granja Emiluc +57 350 518 2091
