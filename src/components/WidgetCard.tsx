import React, { useState } from 'react';
import { 
  RefreshCw, 
  Bookmark, 
  Play, 
  BookOpen, 
  Check, 
  ChevronDown, 
  ChevronUp, 
  GripVertical,
  ExternalLink
} from 'lucide-react';
import { FeedItem, Source, PlatformSlug } from '../types';

interface WidgetCardProps {
  title: string;
  platform: PlatformSlug;
  source?: Source;
  items: FeedItem[];
  onPlayPiP: (item: FeedItem) => void;
  onOpenReader: (item: FeedItem) => void;
  onToggleBookmark: (id: string) => void;
  onToggleRead: (id: string) => void;
  onRefreshSource?: () => void;
  isSyncing?: boolean;
}

export const WidgetCard: React.FC<WidgetCardProps> = ({
  title,
  platform,
  source,
  items,
  onPlayPiP,
  onOpenReader,
  onToggleBookmark,
  onToggleRead,
  onRefreshSource,
  isSyncing,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Discreet source labels and subtle markers
  const platformMeta = {
    youtube: { tag: 'YT', label: 'YouTube' },
    reddit: { tag: 'RD', label: 'Reddit' },
    rss: { tag: 'RSS', label: 'Feed' },
    github: { tag: 'GH', label: 'GitHub' },
    twitch: { tag: 'TV', label: 'Twitch' },
  }[platform] || { tag: 'FEED', label: 'Fuente' };

  const unreadCount = items.filter(i => !i.isRead).length;

  return (
    <div className="rounded-xl bg-surface border border-subtle shadow-xs overflow-hidden flex flex-col transition-smooth group/card">
      {/* Widget Header - Minimal, quiet, reveals controls on interaction */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-subtle bg-surface select-none">
        <div className="flex items-center gap-2.5 min-w-0">
          <GripVertical className="w-3.5 h-3.5 text-muted/30 group-hover/card:text-muted/80 cursor-grab shrink-0 transition-smooth hidden sm:block" />
          
          <div className="flex items-center gap-2 truncate">
            <span className="font-mono text-[10px] text-muted tracking-wide uppercase px-1.5 py-0.5 rounded bg-surface-elevated border border-subtle">
              {platformMeta.tag}
            </span>
            <h2 className="text-xs font-semibold tracking-tight text-primary truncate">
              {title}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {unreadCount > 0 ? (
            <span className="font-mono text-[11px] text-accent font-medium">
              {unreadCount} nuevo{unreadCount > 1 ? 's' : ''}
            </span>
          ) : (
            <span className="font-mono text-[11px] text-muted">
              Al día
            </span>
          )}

          {/* Action buttons - discreet, enhanced on hover */}
          <div className="flex items-center gap-0.5 opacity-80 group-hover/card:opacity-100 transition-smooth">
            {onRefreshSource && (
              <button
                onClick={onRefreshSource}
                disabled={isSyncing}
                className="p-1 text-muted hover:text-primary rounded transition-smooth hover:bg-surface-elevated"
                title="Actualizar canal"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-accent' : ''}`} />
              </button>
            )}

            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-1 text-muted hover:text-primary rounded transition-smooth hover:bg-surface-elevated"
              title={isCollapsed ? "Expandir" : "Colapsar"}
            >
              {isCollapsed ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Syncing Shimmer Placeholder */}
      {isSyncing && (
        <div className="p-4 space-y-3">
          <div className="h-14 rounded-lg bg-surface-elevated animate-pulse" />
          <div className="h-14 rounded-lg bg-surface-elevated animate-pulse" />
        </div>
      )}

      {/* Feed Items Container - Natural list without nested cards within cards */}
      {!isCollapsed && !isSyncing && (
        <div className="p-1.5 sm:p-2 divide-y divide-subtle sm:max-h-[560px] sm:overflow-y-auto touch-pan-y">
          {items.length === 0 ? (
            <div className="py-12 text-center text-xs text-muted font-mono">
              Sin publicaciones en este canal.
            </div>
          ) : (
            items.map((item) => {
              const isVideo = item.platform === 'youtube' || item.platform === 'twitch' || item.mediaType === 'youtube_video' || item.mediaType === 'twitch_stream';

              return (
                <div
                  key={item.id}
                  className={`group/item p-3 transition-smooth rounded-lg flex flex-col justify-between gap-1.5 ${
                    item.isRead
                      ? 'opacity-70 hover:opacity-100 hover:bg-surface-elevated/40'
                      : 'hover:bg-surface-elevated/70'
                  }`}
                >
                  {/* Top: Metadata in a single quiet line */}
                  <div className="flex items-center justify-between text-[11px] text-muted font-mono">
                    <div className="flex items-center gap-1.5 truncate max-w-[220px]">
                      {/* Quiet unread indicator: amber dot */}
                      {!item.isRead ? (
                        <span 
                          className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" 
                          title="No leído"
                        />
                      ) : (
                        <span className="w-1.5 h-1.5 rounded-full bg-muted/40 shrink-0" />
                      )}

                      <span className="truncate text-secondary font-medium">
                        {item.authorName}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {item.readTimeMinutes !== undefined && item.readTimeMinutes > 0 && (
                        <span>{item.readTimeMinutes} min ·</span>
                      )}
                      <span>{item.publishedAt}</span>
                    </div>
                  </div>

                  {/* Primary Title */}
                  <h3
                    onClick={() => isVideo ? onPlayPiP(item) : onOpenReader(item)}
                    className={`text-xs sm:text-[13px] leading-snug cursor-pointer transition-smooth line-clamp-2 ${
                      item.isRead
                        ? 'text-secondary group-hover/item:text-primary font-normal'
                        : 'text-primary font-medium group-hover/item:text-accent'
                    }`}
                  >
                    {item.title}
                  </h3>

                  {/* Optional short summary (1 line max) */}
                  {item.summary && (
                    <p 
                      onClick={() => isVideo ? onPlayPiP(item) : onOpenReader(item)}
                      className="text-[11px] text-muted line-clamp-1 leading-relaxed cursor-pointer"
                    >
                      {item.summary}
                    </p>
                  )}

                  {/* Bottom Line: Metrics on left, Actions revealed on hover or accessible on tap */}
                  <div className="flex items-center justify-between pt-1 text-[11px] font-mono text-muted">
                    {/* Metrics indicators */}
                    <div className="flex items-center gap-2.5">
                      {item.metrics?.views && (
                        <span>{item.metrics.views} vistas</span>
                      )}
                      {item.metrics?.upvotes !== undefined && (
                        <span>{item.metrics.upvotes} votos</span>
                      )}
                      {item.metrics?.stars !== undefined && (
                        <span>{item.metrics.stars.toLocaleString()} ★</span>
                      )}
                      {item.metrics?.liveViewers && (
                        <span className="text-accent font-medium">● {item.metrics.liveViewers}</span>
                      )}
                    </div>

                    {/* Actions - Subtle, hover-focused on desktop, easy touch on mobile */}
                    <div className="flex items-center gap-1 shrink-0 opacity-90 sm:opacity-0 sm:group-hover/item:opacity-100 transition-smooth">
                      {isVideo ? (
                        <button
                          onClick={() => onPlayPiP(item)}
                          className="flex items-center gap-1 px-2 py-0.5 rounded text-[11px] bg-accent-soft text-accent hover:bg-accent hover:text-[var(--accent-contrast)] transition-smooth font-medium"
                          title="Reproducir en Picture-in-Picture"
                        >
                          <Play className="w-2.5 h-2.5 fill-current" />
                          <span>PiP</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => onOpenReader(item)}
                          className="flex items-center gap-1 px-2 py-0.5 rounded text-[11px] bg-surface-elevated hover:bg-surface-hover text-secondary hover:text-primary transition-smooth"
                          title="Abrir modo lectura"
                        >
                          <BookOpen className="w-2.5 h-2.5 text-accent" />
                          <span>Leer</span>
                        </button>
                      )}

                      {/* Bookmark */}
                      <button
                        onClick={() => onToggleBookmark(item.id)}
                        className={`p-1 rounded transition-smooth hover:bg-surface-elevated ${
                          item.isBookmarked ? 'text-accent' : 'text-muted hover:text-secondary'
                        }`}
                        title={item.isBookmarked ? "Guardado" : "Guardar"}
                      >
                        <Bookmark className={`w-3 h-3 ${item.isBookmarked ? 'fill-current' : ''}`} />
                      </button>

                      {/* Mark Read */}
                      <button
                        onClick={() => onToggleRead(item.id)}
                        className={`p-1 rounded transition-smooth hover:bg-surface-elevated ${
                          item.isRead ? 'text-accent' : 'text-muted hover:text-secondary'
                        }`}
                        title={item.isRead ? "Marcar no leído" : "Marcar leído"}
                      >
                        <Check className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};
