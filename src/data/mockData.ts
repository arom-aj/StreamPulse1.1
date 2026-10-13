import { Platform, Source, FeedItem, DashboardWidget } from '../types';

export const PLATFORMS: Platform[] = [
  {
    id: '1',
    name: 'YouTube',
    slug: 'youtube',
    icon: 'Youtube',
    apiBaseUrl: 'https://www.googleapis.com/youtube/v3',
    authType: 'api_key',
    color: '#ef4444'
  },
  {
    id: '2',
    name: 'Reddit',
    slug: 'reddit',
    icon: 'MessageSquare',
    apiBaseUrl: 'https://oauth.reddit.com',
    authType: 'oauth2',
    color: '#f97316'
  },
  {
    id: '3',
    name: 'RSS / Atom',
    slug: 'rss',
    icon: 'Rss',
    apiBaseUrl: '',
    authType: 'none',
    color: '#06b6d4'
  },
  {
    id: '4',
    name: 'GitHub',
    slug: 'github',
    icon: 'GitBranch',
    apiBaseUrl: 'https://api.github.com',
    authType: 'oauth2',
    color: '#a855f7'
  },
  {
    id: '5',
    name: 'Twitch',
    slug: 'twitch',
    icon: 'Tv',
    apiBaseUrl: 'https://api.twitch.tv/helix',
    authType: 'oauth2',
    color: '#8b5cf6'
  }
];

export const INITIAL_SOURCES: Source[] = [
  {
    id: 'src-yt-1',
    platformId: 'youtube',
    externalId: 'UC_x5XG1OV2P6uZZ5FSM9Ttw',
    title: 'Laravel Daily',
    url: 'https://www.youtube.com/@LaravelDaily',
    avatarUrl: 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=100&auto=format&fit=crop&q=60',
    fetchIntervalMinutes: 15,
    lastFetchedAt: 'Hace 3 min',
    status: 'active',
    category: 'Dev',
    itemCount: 4,
    unreadCount: 2,
    colorAccent: '#ef4444'
  },
  {
    id: 'src-reddit-1',
    platformId: 'reddit',
    externalId: 'r/programming',
    title: 'r/programming',
    url: 'https://reddit.com/r/programming',
    avatarUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=100&auto=format&fit=crop&q=60',
    fetchIntervalMinutes: 10,
    lastFetchedAt: 'Hace 1 min',
    status: 'active',
    category: 'Dev',
    itemCount: 4,
    unreadCount: 1,
    colorAccent: '#f97316'
  },
  {
    id: 'src-rss-hn',
    platformId: 'rss',
    externalId: 'https://news.ycombinator.com/rss',
    title: 'Hacker News Frontpage',
    url: 'https://news.ycombinator.com',
    avatarUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=100&auto=format&fit=crop&q=60',
    fetchIntervalMinutes: 5,
    lastFetchedAt: 'Justo ahora',
    status: 'active',
    category: 'Tech',
    itemCount: 4,
    unreadCount: 3,
    colorAccent: '#06b6d4'
  },
  {
    id: 'src-github-1',
    platformId: 'github',
    externalId: 'trending/php-ts',
    title: 'GitHub Trending (PHP & TS)',
    url: 'https://github.com/trending',
    avatarUrl: 'https://images.unsplash.com/photo-1618401479427-c8ef9465fbe1?w=100&auto=format&fit=crop&q=60',
    fetchIntervalMinutes: 20,
    lastFetchedAt: 'Hace 8 min',
    status: 'active',
    category: 'Dev',
    itemCount: 3,
    unreadCount: 1,
    colorAccent: '#a855f7'
  },
  {
    id: 'src-twitch-1',
    platformId: 'twitch',
    externalId: 'twitch/dev-streams',
    title: 'Software & Game Dev Live',
    url: 'https://twitch.tv/directory/game/Software%20and%20Game%20Development',
    avatarUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=100&auto=format&fit=crop&q=60',
    fetchIntervalMinutes: 5,
    lastFetchedAt: 'Hace 2 min',
    status: 'active',
    category: 'Gaming',
    itemCount: 2,
    unreadCount: 1,
    colorAccent: '#8b5cf6'
  }
];

export const INITIAL_FEED_ITEMS: FeedItem[] = [
  {
    id: 'item-yt-1',
    sourceId: 'src-yt-1',
    platform: 'youtube',
    externalId: 'dQw4w9WgXcQ', // fallback or real video id
    title: 'Laravel 11 Reverb + Horizon: Configuración de WebSockets de Alta Concurrencia',
    summary: 'Aprende a configurar el nuevo servidor de WebSockets nativo Laravel Reverb junto con Redis y Horizon para procesar 100,000 conexiones concurrentes sin cuellos de botella.',
    contentCleanHtml: `
      <h2>Dominando Laravel Reverb en Producción</h2>
      <p>Laravel 11 introdujo <strong>Reverb</strong>, un servidor de WebSockets de alto rendimiento diseñado específicamente para el ecosistema de Laravel.</p>
      <h3>Arquitectura recomendada</h3>
      <ul>
        <li><strong>Nginx Reverse Proxy:</strong> Terminación SSL y balanceo con cabeceras Upgrade.</li>
        <li><strong>Redis Pub/Sub:</strong> Distribución de eventos entre múltiples servidores Laravel workers.</li>
        <li><strong>Supervisor:</strong> Monitorización de procesos daemon <code>php artisan reverb:start</code>.</li>
      </ul>
      <p>En este tutorial analizamos la configuración de escalado horizontal con Docker Swarm y Kubernetes, reduciendo la latencia de ingestión a menos de 15ms.</p>
    `,
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    mediaUrl: 'dQw4w9WgXcQ',
    mediaType: 'youtube_video',
    authorName: 'Laravel Daily',
    authorAvatar: 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=100&auto=format&fit=crop&q=60',
    publishedAt: 'hace 25 min',
    readTimeMinutes: 14,
    isRead: false,
    isBookmarked: true,
    metrics: {
      views: '12.4K',
      upvotes: 940,
      comments: 78
    },
    tags: ['Laravel 11', 'WebSockets', 'Reverb', 'PHP 8.3']
  },
  {
    id: 'item-rss-1',
    sourceId: 'src-rss-hn',
    platform: 'rss',
    externalId: 'hn-39882104',
    title: 'Show HN: StreamPulse - Feed Aggregator con Ingestión Asíncrona en Laravel 11',
    summary: 'Presentamos una arquitectura desacoplada para agregación de noticias en tiempo real con SimplePie, colas Redis distribuidas y modo lectura sin trackers ni JavaScript invasivo.',
    contentCleanHtml: `
      <h2>StreamPulse: Privacidad, Rendimiento y Cero Algoritmos</h2>
      <p>Los algoritmos de redes sociales están optimizados para retención adictiva en lugar de consumo de información productivo. StreamPulse nació para solucionar esto en computadoras de alto rendimiento y teléfonos móviles.</p>
      <h3>Puntos Clave del Pipeline:</h3>
      <ol>
        <li><strong>Normalización de Fuentes:</strong> Cada API externa (RSS, Reddit JSON, YouTube Data API v3, GitHub Events) se procesa a través de un contrato estricto <code>SourceAdapterInterface</code>.</li>
        <li><strong>Limpieza con Readability:</strong> Extraemos el DOM principal eliminando iframes de anuncios, banners de suscripción y scripts de telemetría.</li>
        <li><strong>Desduplicación por Hash & External ID:</strong> Prevención de colisiones en base de datos mediante índice compuesto <code>(source_id, external_id)</code>.</li>
      </ol>
      <p>Resultados preliminares muestran un ahorro del 82% en consumo de datos móviles y un tiempo de carga inicial de 180ms gracias a Service Workers.</p>
    `,
    url: 'https://news.ycombinator.com/item?id=39882104',
    mediaType: 'article',
    authorName: 'dang',
    publishedAt: 'hace 42 min',
    readTimeMinutes: 5,
    isRead: false,
    isBookmarked: false,
    metrics: {
      upvotes: 412,
      comments: 139
    },
    tags: ['Architecture', 'OpenSource', 'Performance', 'Laravel']
  },
  {
    id: 'item-reddit-1',
    sourceId: 'src-reddit-1',
    platform: 'reddit',
    externalId: 'reddit-t3_1bp6z7',
    title: 'Por qué cambiamos nuestro stack frontend a Livewire 3 + Alpine.js en 2024',
    summary: 'Discusión en r/programming sobre la reducción de complejidad al eliminar microservicios frontend redundantes y volver a componentes reactivos impulsados por el servidor con Alpine para animaciones táctiles.',
    contentCleanHtml: `
      <h2>La fatiga del ecosistema SPA y el renacimiento de Livewire 3</h2>
      <p>Durante 5 años mantuvimos dos repositorios separados: una API en PHP/Laravel y un frontend en Next.js con GraphQL. La carga cognitiva y la duplicación de tipos TypeScript se volvió insostenible.</p>
      <h3>Ventajas experimentadas con Livewire 3:</h3>
      <ul>
        <li><strong>Morfing inteligente de DOM:</strong> El nuevo algoritmo de Alpine.js fusiona diferencias sin romper el estado del reproductor de video o elementos en foco.</li>
        <li><strong>Lazy loading nativo:</strong> Las tarjetas de feeds se renderizan bajo demanda con un simple atributo <code>wire:navigate</code>.</li>
        <li><strong>Cero endpoints REST huérfanos:</strong> La lógica de validación reside 100% en las clases PHP del componente.</li>
      </ul>
      <blockquote>"Menos código que mantener equivale a más tiempo optimizando consultas de base de datos e índices en MySQL."</blockquote>
    `,
    url: 'https://reddit.com/r/programming/comments/1bp6z7',
    mediaType: 'article',
    authorName: 'u/fullstack_architect',
    publishedAt: 'hace 1 h',
    readTimeMinutes: 6,
    isRead: true,
    isBookmarked: false,
    metrics: {
      upvotes: 890,
      comments: 245
    },
    tags: ['Livewire 3', 'Alpine.js', 'Frontend Architecture', 'PHP']
  },
  {
    id: 'item-gh-1',
    sourceId: 'src-github-1',
    platform: 'github',
    externalId: 'gh-livewire-livewire',
    title: 'livewire/livewire v3.5.0: Soporte mejorado para WebSockets Reverb y File Uploads Concurrentes',
    summary: 'Nueva versión oficial con listeners de eventos en tiempo real sin polling continuo, optimizaciones de memoria en uploads pesados y hooks nativos para Gridstack y Drag-and-Drop.',
    contentCleanHtml: `
      <h2>Novedades en Livewire v3.5.0</h2>
      <p>El equipo de Livewire ha liberado una versión mayor enfocada en rendimiento en tiempo real y compatibilidad con interfaces táctiles móviles.</p>
      <h3>Changelog destacado:</h3>
      <ul>
        <li><code>@listenToReverb('FeedItemIngested')</code>: Vinculación declarativa directa en vistas Blade.</li>
        <li>Soporte de gestos táctiles tipo swipe para aplicaciones instaladas como PWA.</li>
        <li>Reducción del tamaño del payload JSON en un 38% mediante compresión LZString opcional.</li>
      </ul>
    `,
    url: 'https://github.com/livewire/livewire/releases/tag/v3.5.0',
    mediaType: 'code',
    authorName: 'calebporzio',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=60',
    publishedAt: 'hace 2 h',
    readTimeMinutes: 3,
    isRead: false,
    isBookmarked: false,
    metrics: {
      stars: 28400,
      forks: 1820,
      language: 'PHP'
    },
    tags: ['GitHub', 'Release', 'Livewire', 'Open Source']
  },
  {
    id: 'item-twitch-1',
    sourceId: 'src-twitch-1',
    platform: 'twitch',
    externalId: 'twitch-stream-primeagen',
    title: 'EN VIVO: Refactorizando el pipeline de ingestión con Redis Streams y PHP 8.3 JIT',
    summary: 'Stream técnico en vivo: benchmark comparativo entre MySQL bulk inserts vs Redis pipeline, pruebas de carga con k6 simulando 50,000 requests/sec.',
    contentCleanHtml: `
      <h2>Stream en Vivo: Ingestión a Escala Extrema</h2>
      <p>Estamos optimizando la ingestión masiva de feeds de noticias utilizando Redis Streams como buffer temporal antes del batch insert en PostgreSQL/MySQL.</p>
      <h3>Tópicos en la sesión:</h3>
      <ul>
        <li>PHP 8.3 Typed Class Constants y Dynamic Class Fetch.</li>
        <li>Cómo prevenir bloqueos de tabla en feeds de alta frecuencia.</li>
        <li>Configuración de supervisor con 16 workers paralelos.</li>
      </ul>
    `,
    url: 'https://twitch.tv/ThePrimeagen',
    mediaUrl: 'theprimeagen',
    mediaType: 'twitch_stream',
    authorName: 'ThePrimeagen',
    publishedAt: 'hace 20 min',
    readTimeMinutes: 0,
    isRead: false,
    isBookmarked: false,
    metrics: {
      liveViewers: '4.8K',
      language: 'English'
    },
    tags: ['Twitch', 'Live', 'PHP', 'Redis', 'Performance']
  },
  {
    id: 'item-yt-2',
    sourceId: 'src-yt-1',
    platform: 'youtube',
    externalId: 'L_LUpnjgPso',
    title: 'Laravel Horizon & Redis Queues: Prevención de Memory Leaks en Workers 24/7',
    summary: 'Técnicas esenciales para monitorear el consumo de memoria RAM en tareas prolongadas de scraping y parsing de XML/RSS, configurando auto-reinicio seguro con --max-jobs.',
    contentCleanHtml: `
      <h2>Gestión de Recursos en Laravel Queues de Alta Exigencia</h2>
      <p>Cuando los workers de Laravel procesan miles de feeds RSS con SimplePie y DOMDocument, la memoria en PHP puede fragmentarse si no se gestionan adecuadamente las instancias de objetos.</p>
      <p>En este video revisamos cómo implementar <code>gc_collect_cycles()</code> y cómo Horizon monitoriza el uso de CPU y memoria en tiempo real.</p>
    `,
    url: 'https://www.youtube.com/watch?v=L_LUpnjgPso',
    mediaUrl: 'L_LUpnjgPso',
    mediaType: 'youtube_video',
    authorName: 'Laravel Daily',
    publishedAt: 'hace 5 h',
    readTimeMinutes: 18,
    isRead: true,
    isBookmarked: false,
    metrics: {
      views: '8.2K',
      upvotes: 620,
      comments: 45
    },
    tags: ['Laravel Horizon', 'Queues', 'Redis', 'DevOps']
  },
  {
    id: 'item-yt-3',
    sourceId: 'src-yt-1',
    platform: 'youtube',
    externalId: 'dQw4w9WgXcQ',
    title: 'Migraciones Zero-Downtime y Particionamiento en PostgreSQL',
    summary: 'Estrategias para alterar tablas de más de 50 millones de filas sin bloquear escrituras ni degradar el pool de conexiones.',
    contentCleanHtml: `
      <h2>Zero-Downtime Migrations</h2>
      <p>Aprende a ejecutar operaciones DDL seguras usando bloqueos transaccionales breves y triggers de replicación gradual.</p>
    `,
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    mediaUrl: 'dQw4w9WgXcQ',
    mediaType: 'youtube_video',
    authorName: 'Aaron Francis',
    publishedAt: 'hace 8 h',
    readTimeMinutes: 15,
    isRead: false,
    isBookmarked: false,
    metrics: {
      views: '5.1K',
      upvotes: 480
    },
    tags: ['PostgreSQL', 'Databases', 'Performance']
  },
  {
    id: 'item-rss-2',
    sourceId: 'src-rss-hn',
    platform: 'rss',
    externalId: 'hn-39884512',
    title: 'SQLite en Producción: Lecciones de 10 Millones de Consultas Diarias',
    summary: 'Por qué muchas aplicaciones web modernas rinden significativamente mejor con SQLite embebido en NVMe local que con clusters de red.',
    contentCleanHtml: `
      <h2>El Renacimiento de SQLite</h2>
      <p>La latencia de red suele ser el principal factor de demora en microservicios. Almacenar datos en el mismo nodo físico elimina el handshake de socket.</p>
    `,
    url: 'https://fly.io/blog/all-in-on-sqlite',
    mediaType: 'article',
    authorName: 'Fly.io Tech Blog',
    publishedAt: 'hace 1 h',
    readTimeMinutes: 6,
    isRead: false,
    isBookmarked: false,
    metrics: {
      upvotes: 532,
      comments: 184
    },
    tags: ['SQLite', 'Architecture', 'Storage']
  },
  {
    id: 'item-rss-3',
    sourceId: 'src-rss-hn',
    platform: 'rss',
    externalId: 'hn-39887100',
    title: 'Diseño de Interfaces Tranquilas: Menos Notificaciones y Cero Métricas de Vanidad',
    summary: 'Principios de diseño para herramientas de información que respetan la atención del lector en lugar de competir por dopamina.',
    contentCleanHtml: `
      <h2>La Filosofía de las Herramientas Tranquilas</h2>
      <p>Una herramienta debe responder con precisión, sin animaciones innecesarias ni elementos que compitan por la mirada.</p>
    `,
    url: 'https://news.ycombinator.com',
    mediaType: 'article',
    authorName: 'Substack Dev',
    publishedAt: 'hace 4 h',
    readTimeMinutes: 4,
    isRead: true,
    isBookmarked: true,
    metrics: {
      upvotes: 310,
      comments: 67
    },
    tags: ['UX', 'Editorial', 'Productivity']
  },
  {
    id: 'item-reddit-2',
    sourceId: 'src-reddit-1',
    platform: 'reddit',
    externalId: 'reddit-t3_2cp89a',
    title: 'Arquitecturas Monolíticas Modulares: ¿Cuándo dejar de dividir en microservicios?',
    summary: 'Reflexión en r/programming sobre los costes ocultos de orquestación, contratos de red y depuración entre servicios distribuidos.',
    contentCleanHtml: `
      <h2>Monolitos Modulares</h2>
      <p>La modularidad a nivel de paquetes de código proporciona aislamiento sin el peaje de red ni la complejidad de Kubernetes.</p>
    `,
    url: 'https://reddit.com/r/programming',
    mediaType: 'article',
    authorName: 'u/system_craft',
    publishedAt: 'hace 2 h',
    readTimeMinutes: 5,
    isRead: false,
    isBookmarked: false,
    metrics: {
      upvotes: 640,
      comments: 198
    },
    tags: ['Architecture', 'DevOps', 'Microservices']
  },
  {
    id: 'item-reddit-3',
    sourceId: 'src-reddit-1',
    platform: 'reddit',
    externalId: 'reddit-t3_3dp91c',
    title: 'Comparativa de consumo de memoria y concurrencia entre Node 22 y PHP 8.3 JIT',
    summary: 'Análisis independiente con cargas reales de ingestión de JSON y serialización en buffers de alto volumen.',
    contentCleanHtml: `
      <h2>Benchmarks de Concurrencia</h2>
      <p>Resultados detallados sobre uso de RSS memory y latencia en el percentil 99.</p>
    `,
    url: 'https://reddit.com/r/programming',
    mediaType: 'article',
    authorName: 'u/benchmark_geek',
    publishedAt: 'hace 6 h',
    readTimeMinutes: 7,
    isRead: true,
    isBookmarked: false,
    metrics: {
      upvotes: 420,
      comments: 112
    },
    tags: ['Performance', 'Benchmarks', 'NodeJS', 'PHP']
  },
  {
    id: 'item-gh-2',
    sourceId: 'src-github-1',
    platform: 'github',
    externalId: 'gh-shadcn-ui-v2',
    title: 'shadcn/ui v2.1: Soporte completo para Tailwind v4 y variables CSS nativas',
    summary: 'Nueva release optimizada para bundlers modernos, reduciendo el bundle de utilidades a cero código JavaScript extra.',
    contentCleanHtml: `
      <h2>Changelog shadcn/ui v2.1</h2>
      <p>Compatibilidad directa con <code>@import "tailwindcss"</code> y paletas de color con variables dinámicas.</p>
    `,
    url: 'https://github.com/shadcn-ui/ui/releases',
    mediaType: 'code',
    authorName: 'shadcn',
    publishedAt: 'hace 50 min',
    readTimeMinutes: 2,
    isRead: false,
    isBookmarked: false,
    metrics: {
      stars: 64200,
      forks: 5100
    },
    tags: ['GitHub', 'Release', 'Frontend']
  },
  {
    id: 'item-twitch-2',
    sourceId: 'src-twitch-1',
    platform: 'twitch',
    externalId: 'twitch-stream-tsoding',
    title: 'EN VIVO: Programando un motor de feeds ultraliviano en Rust y WebAssembly',
    summary: 'Desarrollo interactivo en vivo: parsing de XML a 1 GB/segundo sin allocations en el heap principal.',
    contentCleanHtml: `
      <h2>Desarrollo en Vivo con Rust</h2>
      <p>Explorando arquitecturas de cero copias para procesamiento de flujos de texto en tiempo real.</p>
    `,
    url: 'https://twitch.tv/tsoding',
    mediaUrl: 'tsoding',
    mediaType: 'twitch_stream',
    authorName: 'Tsoding',
    publishedAt: 'hace 15 min',
    readTimeMinutes: 0,
    isRead: false,
    isBookmarked: false,
    metrics: {
      liveViewers: '2.4K',
      language: 'English'
    },
    tags: ['Twitch', 'Live', 'Rust', 'Wasm']
  }
];

export const INITIAL_WIDGETS: DashboardWidget[] = [
  {
    id: 'w-youtube',
    sourceIdOrCategory: 'youtube',
    widgetType: 'source_feed',
    title: 'Canales de Video',
    platform: 'youtube',
    width: 2,
    posX: 0,
    posY: 0,
    isVisible: true
  },
  {
    id: 'w-rss-hn',
    sourceIdOrCategory: 'rss',
    widgetType: 'source_feed',
    title: 'Artículos & Ensayos',
    platform: 'rss',
    width: 2,
    posX: 2,
    posY: 0,
    isVisible: true
  },
  {
    id: 'w-reddit',
    sourceIdOrCategory: 'reddit',
    widgetType: 'source_feed',
    title: 'Debates & Comunidad',
    platform: 'reddit',
    width: 2,
    posX: 0,
    posY: 1,
    isVisible: true
  },
  {
    id: 'w-github',
    sourceIdOrCategory: 'github',
    widgetType: 'source_feed',
    title: 'Repositorios & Lanzamientos',
    platform: 'github',
    width: 2,
    posX: 2,
    posY: 1,
    isVisible: true
  },
  {
    id: 'w-twitch',
    sourceIdOrCategory: 'twitch',
    widgetType: 'source_feed',
    title: 'Transmisiones en Vivo',
    platform: 'twitch',
    width: 2,
    posX: 0,
    posY: 2,
    isVisible: true
  }
];
