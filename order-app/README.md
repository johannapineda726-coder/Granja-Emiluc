# order-app (Granja Emiluc)

Esta carpeta contiene una app web estática para tomar pedidos y enviarlos por WhatsApp al número +57 350 518 2091.

Archivos:
- index.html — interfaz de catálogo y carrito.
- styles.css — estilos.
- app.js — lógica del carrito y generación del mensaje para WhatsApp.
- products.json — lista de productos (editar aquí para cambiar catálogo).

Mejoras realizadas en esta versión:
- Controles de cantidad (+ / -) tanto en el catálogo como en el carrito.
- Validación simple de teléfono antes de proceder al envío por WhatsApp.
- Confirmación modal antes de abrir WhatsApp para enviar el pedido.
- Mejor manejo del mensaje: ensamblado como texto y codificado con `encodeURIComponent` una sola vez.
- Indicador de carrito vacío y mejor UI para cantidades.

Instalación y despliegue rápido:
1. Los archivos ya están en la carpeta `order-app/` del repo.
2. Para probar localmente: abre `order-app/index.html` en el navegador o usa un servidor estático (por ejemplo: `python -m http.server 8000` en la carpeta `order-app`).
3. Para publicar en GitHub Pages:
   - Ve a Settings > Pages en el repositorio.
   - Selecciona la rama `main` y la carpeta `/ (root)` y guarda.
   - Si Pages ya está activado para el `root`, la URL pública será:
     `https://johannapineda726-coder.github.io/Granja-Emiluc/order-app/`
   - Espera unos minutos para la activación y luego visita la URL.

Notas:
- Si quieres, puedo también intentar extraer productos desde los archivos PDF/HTML del repo y rellenar `products.json`, pero ten en cuenta que muchos documentos están convertidos a imágenes/base64 y requerirán transcripción manual.
- Para cambiar el número de WhatsApp edita `order-app/app.js` (const WA_NUMBER).

Contacto: WhatsApp Granja Emiluc +57 350 518 2091
