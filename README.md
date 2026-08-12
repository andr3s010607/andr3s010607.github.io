# E-portafolio — Bases de Datos 1

E-portafolio académico estático de **Geovanny Andres Riaño Perez**. Está construido con Astro y Tailwind CSS; no usa backend, base de datos ni autenticación.

## Ejecutarlo localmente

Requiere Node.js 22.12 o superior.

~~~sh
npm install
npm run dev
~~~

Abre la dirección que muestra Astro, normalmente http://localhost:4321.

Para generar la versión de producción:

~~~sh
npm run build
~~~

El resultado queda en la carpeta **dist/**. Puedes comprobarlo localmente con:

~~~sh
npm run preview
~~~

## Personalizar la presentación

- **Foto:** coloca una imagen llamada **avatar.jpg** en **public/assets/img/**. También se detectan avatar.jpeg, avatar.png, avatar.webp y avatar.avif. Si todavía no existe, se muestra un avatar de reserva sin solicitudes rotas.
- **Video:** coloca el archivo **presentacion.mp4** en **public/assets/video/**. El reproductor HTML5 aparecerá automáticamente al volver a compilar; mientras tanto se muestra un mensaje de disponibilidad próxima.
- **Guía del video:** los cuatro textos editables están concentrados en **src/components/Presentation.astro**.

## Agregar evidencias

No hay que editar un registro ni un componente. Copia cada archivo a la categoría adecuada y vuelve a compilar o publicar:

~~~text
public/
  evidencias/
    modelado/
    normalizacion/
    sql/
    proyecto/
~~~

El sitio analiza esas carpetas durante el build y crea una tarjeta por archivo. El título se obtiene del nombre de archivo; por ejemplo, modelo-entidad-relacion.pdf se mostrará como “Modelo entidad relacion”.

La implementación reconoce y etiqueta PDF, imágenes, SQL, TXT, CSV, JSON, Markdown, documentos Office y ZIP. Las imágenes muestran miniatura; los formatos que el navegador puede abrir incluyen el botón **Ver evidencia** y todos los archivos incluyen **Descargar**. Puedes organizar archivos en subcarpetas si lo necesitas.

Los archivos .gitkeep ya incluidos solo mantienen las carpetas vacías en Git y no se publican como evidencias.

## Publicar en GitHub Pages

El flujo de trabajo en **.github/workflows/deploy.yml** publica automáticamente al hacer push a la rama **master**.

~~~sh
git add .
git commit -m "Publicar e-portafolio"
git push origin master
~~~

La configuración de Astro detecta si el repositorio se publica en la raíz usuario.github.io o bajo usuario.github.io/nombre-repositorio/. Por eso los enlaces, recursos, sitemap, robots y metadatos conservan la ruta correcta en ambos casos.

Para simular localmente una publicación en subruta:

~~~powershell
$env:PUBLIC_SITE_URL='https://usuario.github.io'
$env:PUBLIC_BASE_PATH='/nombre-repositorio'
npm run build
~~~

Después de esa prueba, abre una consola nueva o elimina las variables antes de generar el build final.
