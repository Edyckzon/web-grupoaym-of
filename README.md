# A&M GROUP — versión 1

Web corporativa local con React, TypeScript y Vite. Diseño en blanco, negro, naranja y amarillo, paneles de empresas con profundidad y cristal, GSAP y escena WebGL de Three.js.

## Iniciar

Doble clic en `Iniciar-web.cmd`. Utiliza el Node 24.16.0 instalado en esta PC. Mantener la terminal abierta mientras se utiliza la web.

Desde una terminal con Node 24 activo:

```sh
npm install
npm run dev
npm run build
```

## Contenido e interacciones

- Cinco empresas seleccionables con clic, botones anterior/siguiente y flechas del teclado cuando el foco está en la galería.
- Fichas de empresa en un diálogo accesible; Escape cierra la ficha.
- Áreas de especialidad desplegables.
- Menú móvil y navegación a las secciones.
- Se respeta la preferencia de movimiento reducido del sistema.
- La escena 3D se carga por separado y no bloquea el contenido si WebGL no está disponible.

## Editar

`src/App.tsx`: nombres, descripciones y contenido.
`src/App.css`: composición y estilos.
`src/index.css`: tipografía y colores globales.
`src/BrandScene.tsx`: monograma A&M con letras extruidas y marco translúcido.
`public/images`: fotografías locales; fuentes en ASSETS.md.

Las fotografías son ilustrativas y las descripciones son propuestas para revisar con A&M GROUP. No se han inventado teléfonos, direcciones, estadísticas ni enlaces comerciales. La tipografía utiliza la fuente del sistema, sin descargas externas de fuentes.

Preparado para Cloudflare Pages. Consulta DEPLOYMENT.md para conectar el repositorio, configurar main como producción y dev como vista previa, y vincular grupoaym.com.

## Navegación

- `/`: inicio.
- `/grupo`: presentación del grupo.
- `/experiencia`: áreas de especialidad.
- `/empresas`: galería de empresas.

Son rutas de acceso a las secciones de la misma página. La navegación utiliza History API, admite atrás/adelante, abrir en nueva pestaña y enlaces directos. Los enlaces antiguos con #grupo, #expertise y #empresas se normalizan conservando su destino. `public/_redirects` configura las rutas limpias para Cloudflare Pages.
