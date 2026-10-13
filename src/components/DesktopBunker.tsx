import React from 'react';
import { 
  SearchX 
} from 'lucide-react';
import { FeedItem, Source, PlatformSlug, DashboardWidget } from '../types';
import { WidgetCard } from './WidgetCard';

interface DesktopBunkerProps {
  sources: Source[];
  items: FeedItem[];
  widgets: DashboardWidget[];
  selectedPlatform: PlatformSlug | 'all';
  searchQuery: string;
  columns: number;
  density?: 'comfortable' | 'compact';
  activeItemId?: string;
  onPlayPiP: (item: FeedItem) => void;
  onOpenReader: (item: FeedItem) => void;
  onToggleBookmark: (id: string) => void;
  onToggleRead: (id: string) => void;
  onMarkAllRead: () => void;
  onRefreshSource: (sourceId: string) => void;
  isSyncing: boolean;
  latestIngestedItem?: FeedItem | null;
}

export const DesktopBunker: React.FC<DesktopBunkerProps> = ({
  sources,
  items,
  widgets,
  selectedPlatform,
  searchQuery,
  columns,
  density = 'comfortable',
  activeItemId,
  onPlayPiP,
  onOpenReader,
  onToggleBookmark,
  onToggleRead,
  onMarkAllRead,
  onRefreshSource,
  isSyncing,
}) => {
  const filteredItems = items.filter((item) => {
    const matchesSearch = searchQuery === '' || 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.authorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesPlatform = selectedPlatform === 'all' || item.platform === selectedPlatform;
    return matchesSearch && matchesPlatform;
  });

  const totalUnread = items.filter(i => !i.isRead).length;
  const totalBookmarked = items.filter(i => i.isBookmarked).length;

  const gridColsClass = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 xl:grid-cols-4',
  }[columns] || 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3';

  // Filter widgets by selectedPlatform tab (enfoque directo al widget correspondiente)
  const visibleWidgets = widgets.filter(w => {
    if (!w.isVisible) return false;
    if (selectedPlatform === 'all') return true;
    return w.platform === selectedPlatform;
  });

  // Calculate focal anchor widget (content EN VIVO gets highest priority, then highest unread count)
  const focalWidgetId = visibleWidgets.reduce<{ id: string; score: number }>((best, w) => {
    const wItems = filteredItems.filter(item => !w.platform || item.platform === w.platform);
    const hasLive = wItems.some(i => Boolean(i.metrics?.liveViewers));
    const unreadCount = wItems.filter(i => !i.isRead).length;
    const score = (hasLive ? 100 : 0) + unreadCount * 10;
    if (score > best.score) {
      return { id: w.id, score };
    }
    return best;
  }, { id: visibleWidgets[0]?.id || '', score: -1 }).id;

  // Reorder so focal widget is placed first when in "all" view, preventing layout holes
  const arrangedWidgets = React.useMemo(() => {
    if (selectedPlatform !== 'all' || visibleWidgets.length <= 1) {
      return visibleWidgets;
    }
    const focal = visibleWidgets.find(w => w.id === focalWidgetId);
    if (!focal) return visibleWidgets;
    const rest = visibleWidgets.filter(w => w.id !== focalWidgetId);
    return [focal, ...rest];
  }, [visibleWidgets, focalWidgetId, selectedPlatform]);

  return (
    <div className="max-w-[1600px] mx-auto px-3.5 sm:px-6 py-4 space-y-3.5">
      {/* Discreet single status line: N sin leer · N guardados · Marcar leídos (sin franja Reciente) */}
      <div className="flex items-center justify-between text-xs text-muted border-b border-subtle pb-2.5 font-mono text-[11px] select-none">
        <div className="flex items-center gap-2">
          <span>{totalUnread > 0 ? `${totalUnread} sin leer` : 'Al día'}</span>
          <span className="text-muted/40">·</span>
          <span>{totalBookmarked} guardados</span>
          {totalUnread > 0 && (
            <>
              <span className="text-muted/40">·</span>
              <button
                onClick={onMarkAllRead}
                className="text-muted hover:text-secondary hover:underline transition-smooth cursor-pointer outline-none"
                title="Marcar todas como leídas (R)"
              >
                Marcar leídos
              </button>
            </>
          )}
        </div>
      </div>

      {/* Grid of Modular Widgets with Focal Anchor & Dense Flow to eliminate gaps */}
      <div 
        className={
          selectedPlatform !== 'all'
            ? 'max-w-4xl mx-auto'
            : `grid ${gridColsClass} gap-3.5 sm:gap-4.5 grid-flow-dense`
        }
      >
        {arrangedWidgets.map((widget) => {
          const widgetItems = filteredItems.filter(item => {
            if (widget.platform) return item.platform === widget.platform;
            return true;
          });

          const matchedSource = sources.find(s => s.platformId === widget.platform);
          const isFocal = widget.id === focalWidgetId && columns >= 3 && arrangedWidgets.length > 2 && selectedPlatform === 'all';

          return (
            <div 
              key={widget.id} 
              className={isFocal ? 'col-span-1 md:col-span-2' : 'col-span-1'}
            >
              <WidgetCard
                title={widget.title}
                platform={widget.platform || 'rss'}
                source={matchedSource}
                items={widgetItems}
                activeItemId={activeItemId}
                density={density}
                onPlayPiP={onPlayPiP}
                onOpenReader={onOpenReader}
                onToggleBookmark={onToggleBookmark}
                onToggleRead={onToggleRead}
                onRefreshSource={matchedSource ? () => onRefreshSource(matchedSource.id) : undefined}
                isSyncing={isSyncing}
              />
            </div>
          );
        })}
      </div>

      {/* Clean Empty State */}
      {arrangedWidgets.length > 0 && filteredItems.length === 0 && (
        <div className="py-20 text-center flex flex-col items-center justify-center bg-surface border border-subtle/40 rounded-[10px] p-8 max-w-md mx-auto">
          <div className="w-10 h-10 rounded-[8px] bg-surface-elevated border border-subtle flex items-center justify-center text-muted mb-3">
            <SearchX className="w-5 h-5 stroke-[1.5]" />
          </div>
          <h3 className="text-sm font-semibold text-primary">
            Sin publicaciones coincidentes
          </h3>
          <p className="text-xs text-muted mt-1 leading-relaxed">
            No se encontraron publicaciones con "{searchQuery}". Intenta ajustar el filtro de búsqueda.
          </p>
        </div>
      )}

      {/* Footnote Shortcuts Bar - Desktop only, hidden on touch screens via media query */}
      <div className="touch-hide pt-6 pb-2 text-center text-[11px] font-mono text-muted flex items-center justify-center gap-3 sm:gap-4 select-none">
        <span><kbd className="kbd-tag">J/K</kbd> navegar</span>
        <span>·</span>
        <span><kbd className="kbd-tag">↵</kbd> abrir</span>
        <span>·</span>
        <span><kbd className="kbd-tag">S</kbd> sync</span>
        <span>·</span>
        <span><kbd className="kbd-tag">R</kbd> leer</span>
        <span>·</span>
        <span><kbd className="kbd-tag">⌘K</kbd> buscar</span>
      </div>
    </div>
  );
};
