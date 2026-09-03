# SolBemol — Landing page

Landing estático (HTML + CSS + JS puro, **sin frameworks ni build tools**) para
SolBemol, talleres de música para empresas. Pensado para subirse a GitHub,
previsualizarse con GitHub Pages y migrar después a un tema de WordPress sin
romper rutas.

---

## Estructura de archivos

```
Web Solbemol/
├── index.html            # Página principal (una sola)
├── css/
│   └── styles.css        # Estilos (variables de marca, layout, componentes)
├── js/
│   └── main.js           # Interacciones (menú, scroll, animaciones, formulario)
├── assets/               # Imágenes y gráficos
│   ├── hero-placeholder.svg   # Placeholder del hero (reemplazar por foto)
│   └── SVG/
│       ├── Logo_negro.svg     # Logo header (fondo claro)
│       ├── logo_blanco.svg    # Logo footer (fondo oscuro)
│       ├── Logo_crema.svg     # Variante crema
│       └── Favicon.svg        # Favicon
├── robots.txt
├── sitemap.xml
└── README.md
```

Todas las rutas son **relativas** (`css/…`, `assets/…`) para que funcione igual
en GitHub Pages, en local y al portarlo a WordPress.

---

## Uso / previsualización local

No requiere compilación. Opciones:

- **Abrir directo:** doble clic en `index.html`.
- **Servidor local (recomendado, evita problemas de rutas):**
  ```bash
  # Python 3
  python3 -m http.server 8000
  # luego abrir http://localhost:8000
  ```

### Publicar en GitHub Pages
1. Crear un repositorio y subir estos archivos (la carpeta ya trae `.gitignore`).
   ```bash
   git init
   git add .
   git commit -m "Landing SolBemol — base + hero"
   git branch -M main
   git remote add origin <URL-de-tu-repo>
   git push -u origin main
   ```
2. En GitHub: **Settings → Pages → Branch: `main` / root** y guardar.
3. Quedará en `https://<usuario>.github.io/<repo>/`.

---

## Marca: paleta y tipografías

### Colores (variables CSS en `:root`, dentro de `css/styles.css`)
| Variable        | Hex       | Uso                        |
|-----------------|-----------|----------------------------|
| `--c-indigo`    | `#383A5B` | Índigo oscuro (fondos, texto de marca) |
| `--c-terracota` | `#E07A5F` | Acento / botones (CTA)     |
| `--c-arena`     | `#F2CB8D` | Amarillo arena             |
| `--c-salvia`    | `#73B193` | Verde salvia               |
| `--c-texto`     | `#333333` | Texto base                 |
| `--c-crema`     | `#F3F0DD` | Crema (fondos)             |

### Tipografías (Google Fonts, con `preconnect` + `display=swap`)
- **Títulos y destacados:** Jost (SemiBold 600), gobernada por la variable
  `--font-display`.
- **Cuerpo:** Instrument Sans.

#### Cambiar a la fuente de marca "Ouma Latin" (a futuro)
Está preparado para cambiar **una sola línea**:
1. Deja los archivos de la fuente en `assets/fonts/` (p. ej. `.woff2`/`.woff`).
2. Descomenta el bloque `@font-face` de "Ouma Latin" en `css/styles.css`
   (arriba del todo) y ajusta rutas/formatos.
3. Cambia el valor de la variable:
   ```css
   --font-display: 'Ouma Latin', 'Jost', system-ui, sans-serif;
   ```

---

## Imágenes que faltan por cargar en `assets/`
- **`hero.jpg`** (o `.webp`): foto protagonista del hero. Reemplaza el
  `src` del `<img>` dentro de `.hero__blob` en `index.html`
  (hoy apunta a `assets/hero-placeholder.svg`).
- **`og-image.jpg`** (1200×630): imagen para compartir en redes (Open Graph /
  Twitter). Las etiquetas ya están en el `<head>`; solo falta el archivo.
- *(Opcional)* `favicon.png` como respaldo del favicon SVG.

---

## Formulario de contacto

El formulario (Nombre · Empresa *(opcional)* · Email · Teléfono · Mensaje) está
maquetado y con **validación básica en el front (JS)**. **No** incluye envío
real de correo.

> **Envío de correo — se conecta en WordPress:**
> El envío se resolverá al migrar a WordPress usando **WP Mail SMTP**, conectado
> a la casilla de correo del hosting vía **SMTP**. En el landing estático el
> formulario solo valida y muestra confirmación en pantalla; no envía datos a
> ningún backend. No se implementó backend de envío a propósito.

---

## SEO incluido
- Un único `<h1>` (título del hero) y jerarquía de `<h2>`/`<h3>`.
- HTML semántico: `<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`.
- `<head>` con `title`, `meta description`, `charset`, `viewport`, `lang="es"`.
- Open Graph + Twitter Cards.
- `alt` descriptivo en imágenes y `loading="lazy"` donde corresponde.
- Favicon enlazado.
- JSON-LD (Schema.org `Organization`).
- `sitemap.xml` y `robots.txt` básicos.

> **Pendiente al publicar:** reemplazar el dominio de ejemplo
> `https://www.solbemol.cl/` por el definitivo en `index.html` (canonical, OG,
> JSON-LD), `robots.txt` y `sitemap.xml`.
