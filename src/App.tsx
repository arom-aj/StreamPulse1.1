/**
 * StreamPulse — Instrumento de Feeds y Lectura
 * Diseño de precisión editorial: grafito cálido & papel cálido
 */

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Compass, 
  Play, 
  BookOpen, 
  Plus, 
  WifiOff 
} from 'lucide-react';
import { PlatformSlug, Source, FeedItem, DashboardWidget } from './types';
import { INITIAL_SOURCES, INITIAL_FEED_ITEMS, INITIAL_WIDGETS } from './data/mockData';
import { Header } from './components/Header';
import { DesktopBunker } from './components/DesktopBunker';
import { PiPPlayer } from './components/PiPPlayer';
import { CleanReaderModal } from './components/CleanReaderModal';
import { AddSourceModal } from './components/AddSourceModal';
import { KeyboardShortcutsModal } from './components/KeyboardShortcutsModal';
import { CommandPalette } from './components/CommandPalette';
import { extractYouTubeId, extractTwitchChannel } from './utils/videoUtils';

export default function App() {
  const [sources, setSources] = useState<Source[]>(INITIAL_SOURCES);
  const [items, setItems] = useState<FeedItem[]>(INITIAL_FEED_ITEMS);
  const [widgets, setWidgets] = useState<DashboardWidget[]>(INITIAL_WIDGETS);
  
  const [selectedPlatform, setSelectedPlatform] = useState<PlatformSlug | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [columns, setColumns] = useState<number>(3);
  const [density, setDensity] = useState<'comfortable' | 'compact'>('comfortable');

  // Theme: Warm Graphite (dark) vs Warm Paper (light)
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('streampulse_theme') as 'dark' | 'light') || 'dark';
    }
    return 'dark';
  });

  useEffect(() => {
    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      if (theme === 'dark') {
        root.classList.add('dark');
        root.classList.remove('light');
      } else {
        root.classList.add('light');
        root.classList.remove('dark');
      }
      localStorage.setItem('streampulse_theme', theme);
    }
  }, [theme]);

  const handleToggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  // Active PiP video and Reader Item
  const [pipItem, setPipItem] = useState<FeedItem | null>(null);
  const [readerItem, setReaderItem] = useState<FeedItem | null>(null);

  // Modals & Command Palette
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  const [isAddSourceOpen, setIsAddSourceOpen] = useState(false);
  
  // Real-time states
  const [isSyncing, setIsSyncing] = useState(false);
  const [latestIngestedItem, setLatestIngestedItem] = useState<FeedItem | null>(INITIAL_FEED_ITEMS[0]);
  const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);

  // J/K Keyboard navigation active item index
  const [activeItemIndex, setActiveItemIndex] = useState<number>(-1);

  // Register PWA Service Worker
  useEffect(() => {
    if ('serviceWorker' in navigator && process.env.NODE_ENV !== 'test') {
      navigator.serviceWorker.register('/sw.js')
        .then((reg) => console.log('StreamPulse Service Worker registrado:', reg.scope))
        .catch((err) => console.log('Error registrando Service Worker:', err));
    }

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Sync action (non-disruptive, gentle update)
  const handleSync = useCallback(() => {
    setIsSyncing(true);

    setTimeout(() => {
      const newItem: FeedItem = {
        id: `item-live-${Date.now()}`,
        sourceId: 'src-rss-hn',
        platform: 'rss',
        externalId: `hn-${Date.now()}`,
        title: `Actualización: Métricas de concurrencia en Laravel Octane y PHP 8.3 JIT`,
        summary: 'Nuevos análisis de latencia sostienen tiempos de respuesta por debajo de 5ms en arquitecturas orientadas a eventos.',
        contentCleanHtml: `
          <h2>Rendimiento Sostenido con PHP 8.3 JIT</h2>
          <p>La combinación de compilación JIT con event loops asíncronos en memoria optimiza el consumo de recursos en servidores de alto volumen.</p>
          <p>StreamPulse mantiene su caché en memoria y transmite actualizaciones sin interrumpir la lectura.</p>
        `,
        url: 'https://news.ycombinator.com',
        mediaType: 'article',
        authorName: 'Hacker News',
        publishedAt: 'hace 1 min',
        readTimeMinutes: 3,
        isRead: false,
        isBookmarked: false,
        metrics: {
          upvotes: 42,
          comments: 9
        },
        tags: ['Performance', 'PHP 8.3', 'Architecture']
      };

      setItems(prev => [newItem, ...prev]);
      setLatestIngestedItem(newItem);
      setIsSyncing(false);
    }, 700);
  }, []);

  // Filtered items list for J/K navigation
  const visibleItems = items.filter(item => {
    const matchesSearch = searchQuery === '' || 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.summary.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPlatform = selectedPlatform === 'all' || item.platform === selectedPlatform;
    return matchesSearch && matchesPlatform;
  });

  // Global Keyboard Shortcuts (⌘K, J/K, Enter, S, R, 2/3/4)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
        return;
      }

      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement).tagName)) {
        return;
      }

      // J / K Navigation
      if (e.key === 'j') {
        e.preventDefault();
        setActiveItemIndex(prev => Math.min(prev + 1, visibleItems.length - 1));
        return;
      } else if (e.key === 'k') {
        e.preventDefault();
        setActiveItemIndex(prev => Math.max(prev - 1, 0));
        return;
      } else if (e.key === 'Enter' && activeItemIndex >= 0 && activeItemIndex < visibleItems.length) {
        e.preventDefault();
        const item = visibleItems[activeItemIndex];
        if (item) {
          const isVideo = item.platform === 'youtube' || item.platform === 'twitch' || item.mediaType === 'youtube_video' || item.mediaType === 'twitch_stream';
          if (isVideo) {
            setPipItem(item);
          } else {
            setReaderItem(item);
            handleToggleRead(item.id);
          }
        }
        return;
      }

      const key = e.key.toUpperCase();
      if (key === 'S') {
        e.preventDefault();
        handleSync();
      } else if (key === 'R') {
        e.preventDefault();
        handleMarkAllRead();
      } else if (key === '2') {
        setColumns(2);
      } else if (key === '3') {
        setColumns(3);
      } else if (key === '4') {
        setColumns(4);
      } else if (e.key === '?') {
        setIsShortcutsOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleSync, visibleItems, activeItemIndex]);

  // Toggle Bookmark
  const handleToggleBookmark = (id: string) => {
    setItems(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, isBookmarked: !item.isBookmarked };
      }
      return item;
    }));
  };

  // Toggle Read Status
  const handleToggleRead = (id: string) => {
    setItems(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, isRead: !item.isRead };
      }
      return item;
    }));
  };

  // Mark All Read
  const handleMarkAllRead = () => {
    setItems(prev => prev.map(item => ({ ...item, isRead: true })));
  };

  // Refresh Single Source
  const handleRefreshSource = (sourceId: string) => {
    setIsSyncing(true);
    setTimeout(() => {
      setSources(prev => prev.map(s => {
        if (s.id === sourceId) {
          return { ...s, lastFetchedAt: 'Justo ahora', unreadCount: 0 };
        }
        return s;
      }));
      setIsSyncing(false);
    }, 600);
  };

  // Add Source
  const handleAddSource = (newSourceData: Partial<Source>) => {
    const newId = `src-custom-${Date.now()}`;
    const newSource: Source = {
      id: newId,
      platformId: newSourceData.platformId || 'rss',
      externalId: newSourceData.externalId || 'custom-feed',
      title: newSourceData.title || 'Nueva Fuente',
      url: newSourceData.url || 'https://news.ycombinator.com/rss',
      avatarUrl: '',
      fetchIntervalMinutes: newSourceData.fetchIntervalMinutes || 15,
      lastFetchedAt: 'Reciente',
      status: 'active',
      category: newSourceData.category || 'Tech',
      itemCount: 1,
      unreadCount: 1
    };

    setSources(prev => [newSource, ...prev]);

    const isYt = newSource.platformId === 'youtube';
    const isTwitchSource = newSource.platformId === 'twitch';
    const parsedId = isYt 
      ? extractYouTubeId(newSource.url) 
      : isTwitchSource 
        ? extractTwitchChannel(newSource.url) 
        : `ext-${Date.now()}`;

    const newItem: FeedItem = {
      id: `item-${Date.now()}`,
      sourceId: newId,
      platform: newSource.platformId,
      externalId: parsedId,
      title: `${newSource.title} — Primer monitoreo activo`,
      summary: `Fuente agregada exitosamente. Verificación programada cada ${newSource.fetchIntervalMinutes} minutos.`,
      contentCleanHtml: `
        <h2>Canal Conectado</h2>
        <p>Se ha registrado un nuevo canal con URL <code>${newSource.url}</code>.</p>
        <p>StreamPulse continuará monitoreando publicaciones nuevas en segundo plano.</p>
      `,
      url: newSource.url,
      mediaUrl: (isYt || isTwitchSource) ? parsedId : undefined,
      mediaType: isYt ? 'youtube_video' : isTwitchSource ? 'twitch_stream' : 'article',
      authorName: newSource.title,
      publishedAt: 'hace 1 min',
      readTimeMinutes: 2,
      isRead: false,
      isBookmarked: false,
      tags: [newSource.category]
    };

    setItems(prev => [newItem, ...prev]);
    setLatestIngestedItem(newItem);

    if (isYt || isTwitchSource) {
      setPipItem(newItem);
    }

    if (!widgets.some(w => w.platform === newSource.platformId)) {
      setWidgets(prev => [
        ...prev,
        {
          id: `w-${newSource.platformId}-${Date.now()}`,
          sourceIdOrCategory: newSource.platformId,
          widgetType: 'source_feed',
          title: newSource.title,
          platform: newSource.platformId,
          width: 2,
          posX: 0,
          posY: 3,
          isVisible: true
        }
      ]);
    }
  };

  // Add Direct Video or Stream
  const handleAddDirectVideo = (videoData: {
    platform: 'youtube' | 'twitch';
    videoId: string;
    title: string;
    authorName: string;
    url: string;
    playImmediately?: boolean;
  }) => {
    const isTwitch = videoData.platform === 'twitch';
    const sourceId = isTwitch ? 'src-twitch-1' : 'src-yt-1';
    const cleanVideoId = isTwitch 
      ? extractTwitchChannel(videoData.videoId || videoData.url)
      : extractYouTubeId(videoData.videoId || videoData.url);

    const newVideoItem: FeedItem = {
      id: `item-video-${Date.now()}`,
      sourceId: sourceId,
      platform: videoData.platform,
      externalId: cleanVideoId,
      title: videoData.title.trim() || (isTwitch ? `Stream de ${cleanVideoId}` : `Video (${cleanVideoId})`),
      summary: isTwitch
        ? `Transmisión en directo del canal ${videoData.authorName || cleanVideoId}.`
        : `Video (${cleanVideoId}) integrado al monitor de StreamPulse.`,
      contentCleanHtml: `
        <h2>${videoData.title || cleanVideoId}</h2>
        <p>Contenido integrado desde ${isTwitch ? 'Twitch' : 'YouTube'}.</p>
      `,
      url: videoData.url.startsWith('http') ? videoData.url : (isTwitch ? `https://twitch.tv/${cleanVideoId}` : `https://www.youtube.com/watch?v=${cleanVideoId}`),
      mediaUrl: cleanVideoId,
      mediaType: isTwitch ? 'twitch_stream' : 'youtube_video',
      authorName: videoData.authorName.trim() || (isTwitch ? cleanVideoId : 'YouTube'),
      publishedAt: 'hace 1 min',
      readTimeMinutes: isTwitch ? 0 : 12,
      isRead: false,
      isBookmarked: false,
      metrics: isTwitch ? { liveViewers: 'En Vivo' } : { views: '1.2K', upvotes: 1 },
      tags: ['Video']
    };

    setItems(prev => [newVideoItem, ...prev]);
    setLatestIngestedItem(newVideoItem);
    setPipItem(newVideoItem);
  };

  const handleSelectItemFromPalette = (item: FeedItem) => {
    const isVideo = item.platform === 'youtube' || item.platform === 'twitch' || item.mediaType === 'youtube_video' || item.mediaType === 'twitch_stream';
    if (isVideo) {
      setPipItem(item);
    } else {
      setReaderItem(item);
      handleToggleRead(item.id);
    }
  };

  const unreadTotal = items.filter(i => !i.isRead).length;

  return (
    <div className="min-h-screen bg-canvas text-primary flex flex-col font-sans transition-smooth pb-16 md:pb-0">
      {/* Offline Status Warning Bar - Discreet unboxed notice */}
      {!isOnline && (
        <div className="bg-surface border-b border-subtle text-secondary text-xs font-mono py-1.5 px-4 flex items-center justify-center gap-2">
          <WifiOff className="w-3.5 h-3.5 text-secondary" />
          <span>Sin conexión · Navegando en modo lectura con caché local</span>
        </div>
      )}

      {/* Main Command Header */}
      <Header
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        selectedPlatform={selectedPlatform}
        onPlatformSelect={setSelectedPlatform}
        onSync={handleSync}
        isSyncing={isSyncing}
        onOpenShortcuts={() => setIsShortcutsOpen(true)}
        onOpenAddSource={() => setIsAddSourceOpen(true)}
        columns={columns}
        onColumnsChange={setColumns}
        density={density}
        onDensityChange={setDensity}
        unreadTotal={unreadTotal}
        theme={theme}
        onToggleTheme={handleToggleTheme}
      />

      {/* Main Content Area - Modular Grid */}
      <main className="flex-1">
        <DesktopBunker
          sources={sources}
          items={items}
          widgets={widgets}
          selectedPlatform={selectedPlatform}
          searchQuery={searchQuery}
          columns={columns}
          density={density}
          activeItemId={visibleItems[activeItemIndex]?.id}
          onPlayPiP={(item) => setPipItem(item)}
          onOpenReader={(item) => {
            setReaderItem(item);
            handleToggleRead(item.id);
          }}
          onToggleBookmark={handleToggleBookmark}
          onToggleRead={handleToggleRead}
          onMarkAllRead={handleMarkAllRead}
          onRefreshSource={handleRefreshSource}
          isSyncing={isSyncing}
          latestIngestedItem={latestIngestedItem}
        />
      </main>

      {/* MÓVIL (PWA): Bottom Navigation Bar in the thumb zone (100% Opaque, >=44px) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-surface border-t border-subtle pb-[max(env(safe-area-inset-bottom),0.35rem)] pt-1 px-3 flex items-center justify-around text-xs font-medium transition-smooth shadow-none">
        <button
          onClick={() => setSelectedPlatform('all')}
          className={`flex flex-col items-center justify-center gap-1 min-h-[44px] min-w-[56px] transition-smooth ${
            selectedPlatform === 'all' ? 'text-primary font-medium' : 'text-muted'
          }`}
        >
          <Compass className="w-4 h-4 stroke-[1.75]" />
          <span className="text-[10px]">Todo</span>
        </button>

        <button
          onClick={() => setSelectedPlatform('youtube')}
          className={`flex flex-col items-center justify-center gap-1 min-h-[44px] min-w-[56px] transition-smooth ${
            selectedPlatform === 'youtube' ? 'text-primary font-medium' : 'text-muted'
          }`}
        >
          <Play className="w-4 h-4 stroke-[1.75]" />
          <span className="text-[10px]">Video</span>
        </button>

        <button
          onClick={() => setSelectedPlatform('rss')}
          className={`flex flex-col items-center justify-center gap-1 min-h-[44px] min-w-[56px] transition-smooth ${
            selectedPlatform === 'rss' ? 'text-primary font-medium' : 'text-muted'
          }`}
        >
          <BookOpen className="w-4 h-4 stroke-[1.75]" />
          <span className="text-[10px]">Lecturas</span>
        </button>

        <button
          onClick={() => setIsAddSourceOpen(true)}
          className="flex flex-col items-center justify-center gap-1 min-h-[44px] min-w-[56px] text-muted active:text-primary transition-smooth"
        >
          <Plus className="w-4 h-4 stroke-[2]" />
          <span className="text-[10px]">Agregar</span>
        </button>
      </nav>

      {/* Command Palette (Raycast-style Omnibox) */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        items={items}
        onSelectItem={handleSelectItemFromPalette}
        onSync={handleSync}
        onSelectPlatform={setSelectedPlatform}
        onOpenAddSource={() => setIsAddSourceOpen(true)}
      />

      {/* Floating Picture-in-Picture Player (YouTube / Twitch) */}
      <PiPPlayer
        item={pipItem}
        onClose={() => setPipItem(null)}
      />

      {/* Clean Readability Drawer (Newsreader editorial) */}
      <CleanReaderModal
        item={readerItem}
        onClose={() => setReaderItem(null)}
        onToggleBookmark={handleToggleBookmark}
      />

      {/* Add Source Modal */}
      <AddSourceModal
        isOpen={isAddSourceOpen}
        onClose={() => setIsAddSourceOpen(false)}
        onAddSource={handleAddSource}
        onAddDirectVideo={handleAddDirectVideo}
      />

      {/* Keyboard Shortcuts Modal */}
      <KeyboardShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
      />
    </div>
  );
}
