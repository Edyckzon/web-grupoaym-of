# Grupo AyM

Portal corporativo con React, TypeScript y Vite. Tres marcas: A&M Asesores Contables, ContaWeb A&M (Facturación Electrónica y ERP) y Renting Car A&M.

## Desarrollo

Con Node 24:

```sh
npm ci
npm run dev
```

En esta sesión se utiliza el pnpm del entorno de Codex, sin modificar el archivo de bloqueo de npm.

## Comprobaciones

```sh
npm run build
npm test
npm run lint
```

El build genera HTML completo para Inicio, Nosotros y Contacto, con hidratación de React para las interacciones. No requiere un servidor de renderizado en producción. Publicar la carpeta `dist` completa, que incluye metadatos por página, sitemap, robots y página 404.

## Rutas

- `/`: portada, marcas, ecosistema e historia resumida.
- `/nosotros`: historia y propósito del grupo.
- `/contacto`: canales por marca y formulario que prepara una consulta en la aplicación de correo.
- `/#empresas` y `/#ecosistema`: accesos directos a las secciones.
- `/grupo`, `/empresas` y `/experiencia`: compatibilidad con enlaces antiguos mediante `public/_redirects`; también se resuelven en desarrollo.

Las tarjetas tienen el mismo ancho en escritorio. En móvil se deslizan horizontalmente con botones alternativos. Todas conservan su modal Descubrir. ContaWeb muestra dos destinos independientes, sin redirigir ni alterar sus dominios.

## Contenido y contacto

`src/siteData.ts` concentra marcas, destinos, metadatos y campos de contacto. Los campos vacíos no se publican. Los logos originales se conservan y la web utiliza copias WebP optimizadas.

Para habilitar el formulario, completar `VITE_CONTACT_ENDPOINT` y `VITE_PRIVACY_URL` según `.env.example`. El endpoint debe recibir JSON, validar y enrutar `brand` en el servidor, y responder con un estado 2xx solo cuando acepte el mensaje. El envío real, los correos destinatarios y la configuración del proveedor aún no están implementados. Sin endpoint, el formulario abre la aplicación de correo con destinatario, asunto y mensaje preparados. El usuario revisa y envía el correo; no se presenta como un envío recibido por el servidor. Asesores Contables usa informes@asesorescontablesaym.com; las demás consultas usan administracion@grupoaym.com.

WhatsApp y teléfono están conectados al +51 981 204 258. El correo general es administracion@grupoaym.com. Quedan pendientes dirección, horario y dominio de Renting Car.

Se emiten eventos locales `grupoaym:event` para clics de salida y contacto. Están listos para conectar una herramienta de medición; no hay una cuenta analítica ni un gestor de etiquetas instalado. Los eventos contienen marca, producto y ubicación del enlace, nunca los campos del formulario.

## Alcance de esta revisión

Aplicadas las mejoras de estructura, textos, navegación, tarjetas, móvil, footer, rendimiento de logos y HTML inicial de la auditoría v1.1. Se conservaron los modales solicitados y ambos sitios de ContaWeb.

Pendientes de información: envío directo desde el servidor, dominio de Renting Car, dirección, horario, fotografías propias, cifras documentadas y cuenta analítica. El año 2007 y el relato provienen del documento entregado. No se publicaron las cifras +500, +100 ni cinco países. Los textos legales, RUC y cambios en los sitios externos quedan fuera de esta implementación.
