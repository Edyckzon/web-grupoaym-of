# Publicar A&M GROUP con Cloudflare Pages

Repositorio: https://github.com/Edyckzon/web-grupoaym-of
Dominio principal: grupoaym.com

## Ramas

- main: versión de producción, destinada a grupoaym.com.
- dev: desarrollo y despliegues de vista previa. Integrar en main cuando los cambios estén listos para publicar.

## Primera conexión

1. Entrar en la cuenta de Cloudflare que contiene la zona grupoaym.com.
2. Abrir Workers & Pages y crear un proyecto de Pages conectado a Git.
3. Conectar GitHub y autorizar el repositorio Edyckzon/web-grupoaym-of.
4. Configurar:
   - Nombre propuesto del proyecto: web-grupoaym-of
   - Rama de producción: main
   - Framework: React (Vite)
   - Comando de compilación: npm run build
   - Carpeta de salida: dist
   - Directorio raíz: dejar vacío (raíz del repositorio)
   - Variable NODE_VERSION: 24.16.0 para Production y Preview
5. Guardar y desplegar. Verificar primero la URL pages.dev entregada por Cloudflare.
6. Abrir el proyecto > Custom domains > Set up a custom domain.
7. Añadir grupoaym.com y confirmar el registro DNS que propone Cloudflare. No apuntar el dominio a GitHub: GitHub almacena el código y Cloudflare sirve la web.
8. Esperar a que el dominio aparezca Active y comprobar https://grupoaym.com.

Conservar los registros MX y TXT de Google Workspace, SPF, DKIM, DMARC y verificación del dominio. No son registros de alojamiento web.

## Actualizaciones

Trabajar en dev y subir los cambios. Cloudflare Pages generará una vista previa para esa rama si están habilitados los despliegues de Preview. Crear un pull request de dev a main; al integrarlo, Cloudflare actualizará producción.

## Documentación oficial

- https://developers.cloudflare.com/pages/get-started/git-integration/
- https://developers.cloudflare.com/pages/configuration/build-configuration/
- https://developers.cloudflare.com/pages/configuration/custom-domains/

## Portada y rutas de la revisión v1.1

El comando `npm run build` genera HTML estático por página. Mantener este comando completo para incluir el paso de prerenderizado. La carpeta de salida sigue siendo `dist`. El archivo `_redirects` conserva las URL antiguas del portal; no cambia los dominios de las marcas.

En la sesión actual, el trabajo local se realiza en `main` por indicación del usuario. No se han subido estos cambios ni activado un despliegue. Los valores de contacto y las variables del formulario deben configurarse antes de activar el envío real.
