import React from 'react';
import { 
  Check, 
  Layers, 
  SearchX,
  SlidersHorizontal,
  ArrowUpDown
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
  onPlayPiP: (item: FeedItem) => void;
  onOpenReader: (item: FeedItem) => void;
  onToggleBookmark: (id: string) => void;
  onToggleRead: (id: string) => void;
  onMarkAllRead: () => void;
  onRefreshSource: (sourceId: string) => void;
  isSyncing: boolean;
  latestIngestedItem: FeedItem | null;
}

export const DesktopBunker: React.FC<DesktopBunkerProps> = ({
  sources,
  items,
  widgets,
  selectedPlatform,
  searchQuery,
  columns,
  onPlayPiP,
  onOpenReader,
  onToggleBookmark,
  onToggleRead,
  onMarkAllRead,
  onRefreshSource,
  isSyncing,
  latestIngestedItem,
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

  const visibleWidgets = widgets.filter(w => {
    if (!w.isVisible) return false;
    if (selectedPlatform === 'all') return true;
    return w.platform === selectedPlatform;
  });

  return (
    <div className="max-w-[1600px] mx-auto px-3.5 sm:px-6 py-4 sm:py-6 space-y-4">
      {/* Quiet Status & Non-intrusive Live Notice Strip */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-muted border-b border-subtle pb-3">
        {/* Left: Gentle real-time notice without jumping */}
        <div className="flex items-center gap-2">
          {latestIngestedItem ? (
            <div className="flex items-center gap-2 text-secondary animate-fadeIn">
              <span className="w-1.5 h-1.5 rounded-full bg-accent" />
              <span className="font-mono text-[11px] text-muted">Reciente:</span>
              <span className="truncate max-w-sm sm:max-w-md font-medium text-primary">
                {latestIngestedItem.title}
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-muted/60" />
              <span>Conexión de feeds al día</span>
            </div>
          )}
        </div>

        {/* Right: Unboxed Counts & Mark Read Action */}
        <div className="flex items-center gap-3 font-mono text-[11px]">
          <span>{sources.length} canales</span>
          <span className="text-muted/40">·</span>
          <span>
            {totalUnread > 0 ? (
              <span className="text-primary font-medium">{totalUnread} sin leer</span>
            ) : (
              <span>Al día</span>
            )}
          </span>
          <span className="text-muted/40">·</span>
          <span>{totalBookmarked} guardados</span>

          {totalUnread > 0 && (
            <>
              <span className="text-muted/40">·</span>
              <button
                onClick={onMarkAllRead}
                className="hover:text-primary transition-smooth text-accent underline underline-offset-4 cursor-pointer"
                title="Marcar todas como leídas (R)"
              >
                Marcar leídos
              </button>
            </>
          )}
        </div>
      </div>

      {/* Grid of Feed Cards */}
      <div className={`grid ${gridColsClass} gap-4 sm:gap-5`}>
        {visibleWidgets.map((widget) => {
          const widgetItems = filteredItems.filter(item => {
            if (widget.platform) return item.platform === widget.platform;
            return true;
          });

          const matchedSource = sources.find(s => s.platformId === widget.platform);

          return (
            <WidgetCard
              key={widget.id}
              title={widget.title}
              platform={widget.platform || 'rss'}
              source={matchedSource}
              items={widgetItems}
              onPlayPiP={onPlayPiP}
              onOpenReader={onOpenReader}
              onToggleBookmark={onToggleBookmark}
              onToggleRead={onToggleRead}
              onRefreshSource={matchedSource ? () => onRefreshSource(matchedSource.id) : undefined}
              isSyncing={isSyncing}
            />
          );
        })}
      </div>

      {/* Clean Empty State */}
      {visibleWidgets.length > 0 && filteredItems.length === 0 && (
        <div className="py-20 text-center flex flex-col items-center justify-center bg-surface border border-subtle rounded-xl p-8 max-w-md mx-auto">
          <div className="w-10 h-10 rounded-lg bg-surface-elevated border border-subtle flex items-center justify-center text-muted mb-3">
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

      {/* Subtle Bottom Navigation Hints */}
      <div className="pt-6 pb-2 text-center text-[11px] font-mono text-muted flex items-center justify-center gap-4">
        <span><kbd className="kbd-tag">S</kbd> sincronizar</span>
        <span>·</span>
        <span><kbd className="kbd-tag">R</kbd> marcar leídos</span>
        <span>·</span>
        <span><kbd className="kbd-tag">⌘K</kbd> buscar</span>
        <span>·</span>
        <span><kbd className="kbd-tag">?</kbd> atajos</span>
      </div>
    </div>
  );
};
