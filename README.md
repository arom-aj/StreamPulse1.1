# ⚡ StreamPulse — Centro de Comando de Feeds & Videos en Tiempo Real

> Agregador y monitor de alta densidad para desarrolladores y creadores. Centraliza noticias, videos de **YouTube**, streams de **Twitch**, repositorios de **GitHub**, comunidades de **Reddit** y feeds **RSS/Atom** en una interfaz oscura, limpia y libre de algoritmos invasivos.

![StreamPulse UI](https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200&auto=format&fit=crop&q=80)

---

## 🚀 Características Principales

* **Multifuente Unificada:** Monitorea en paralelo canales de YouTube, streams de Twitch, subreddits, tendencias de GitHub y blogs tecnológicos.
* **Reproductor Picture-in-Picture (PiP) Universal:** Mira videos de YouTube o directos de Twitch en una ventana flotante persistente con modo *solo audio en segundo plano*, sin interrumpir tu navegación.
* **Lector Limpio (Readability Drawer):** Panel lateral para leer artículos sin distracciones, anuncios ni popups, con selector tipográfico (Serif/Sans) y barra de progreso de lectura.
* **Estética Luxury Dark Dense (Raycast / Linear / Vercel):** Micro-indicadores con halos cian, chips de etiquetas `#tags`, métricas compactas y efectos dinámicos de cursor *Spotlight*.
* **Buscador Omnibox (`⌘K` / `Ctrl+K`):** Paleta de comandos rápida para filtrar por plataforma, buscar palabras clave o añadir enlaces al instante.
* **PWA & Modo Offline:** Instalable como aplicación de escritorio o móvil, con soporte para caché sin conexión.

---

## 🛠️ Cambios Clave y Evolución del Proyecto

A lo largo del desarrollo se han implementado mejoras fundamentales que transformaron la aplicación:

### 1. Ingestión y Reproducción Instantánea de Video (YouTube & Twitch)
* **Extractor Universal de Enlaces (`videoUtils.ts`):** Parser inteligente capaz de procesar enlaces estándar de YouTube (`watch?v=`), enlaces cortos (`youtu.be/`), Shorts, handles de canal y enlaces de Twitch.
* **Incrustación Segura sin Bloqueos:** Migración a `youtube-nocookie.com` con cabeceras de aceleración y soporte de PiP nativo, evitando bloqueos por políticas de cookies de terceros y errores de origen en iframes.
* **Apertura Automática en PiP:** Al pegar cualquier URL desde el botón `+ Video / Fuente`, el video se agrega al feed y se abre de inmediato en el reproductor flotante.

### 2. Rediseño Ergonómico y Responsividad Móvil Real
* **Eliminación del "Scroll Trap":** Se eliminó el contenedor con altura fija y `overscroll-contain` que atrapaba el dedo en pantallas táctiles. Ahora el scroll vertical (`touch-action: pan-y`) es **100% natural y fluido a 60 FPS**, tocando en cualquier parte de las tarjetas.
* **Encabezado y Barra de Filtros Proporcionales:** 
  * Botón compacto `+ Video` adaptado al ancho de pantallas táctiles.
  * Cinta horizontal de categorías con deslizamiento táctil suave por inercia (`no-scrollbar`).
  * Barra de estado en móviles optimizada a una sola línea para no restar espacio a la lectura.
* **PiP Acoplado en Móviles:** El reproductor flotante ya no se desborda con anchos fijos de PC; en teléfonos se ancla con margen simétrico (`bottom-3 left-3 right-3`), ofreciendo una experiencia adaptativa.

### 3. Depuración Visual y Enfoque en el Usuario
* **Consistencia de Tarjetas Leídas:** Se corrigió el problema en el que marcar un elemento como leído lo convertía en un bloque transparente desalineado; ahora todos los elementos conservan su tarjeta estructurada diferenciando su estado con un micro-indicador cian (`shadow-[0_0_8px_#00F0FF]`).
* **Botones de Acción Siempre Visibles:** Acceso directo a `[▶ PiP]`, `[Leer]`, guardar y marcar como leído con áreas táctiles accesibles.
* **Limpieza de Ruidos Técnicos:** Eliminación de insignias internas como *"CORE 11"*, conmutadores artificiales de vista y telemetría de depuración para entregar un producto pulido para el usuario final.

---

## ⌨️ Atajos de Teclado (Command Center)

| Atajo | Acción |
| :--- | :--- |
| <kbd>⌘K</kbd> / <kbd>Ctrl+K</kbd> | Abrir Omnibox de Búsqueda Rápida y Acciones |
| <kbd>S</kbd> | Sincronizar todos los feeds en tiempo real |
| <kbd>R</kbd> | Marcar todas las publicaciones activas como leídas |
| <kbd>2</kbd> / <kbd>3</kbd> / <kbd>4</kbd> | Alternar entre 2, 3 o 4 columnas en la cuadrícula de escritorio |
| <kbd>Esc</kbd> | Cerrar cualquier reproductor, lector o ventana modal |

---

## 🧱 Arquitectura Tecnológica

* **Frontend:** React 19 + TypeScript + Vite
* **Estilos:** Tailwind CSS v4 con paleta Luxury Dark (`#090D16`, `#111726`, `#00F0FF`)
* **Iconografía:** Lucide React
* **PWA:** Web App Manifest + Service Worker con caché offline
* **Diseño para Backend:** Arquitectura desacoplada lista para sincronización vía Laravel 11, WebSockets con Laravel Reverb y colas asíncronas Redis Horizon.

---

## 📦 Instalación y Puesta en Marcha

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/tu-usuario/streampulse.git
   cd streampulse
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Iniciar entorno de desarrollo:**
   ```bash
   npm run dev
   ```

4. **Compilar para producción:**
   ```bash
   npm run build
   ```

---

## 📄 Licencia

Este proyecto está bajo la licencia [MIT](LICENSE).
