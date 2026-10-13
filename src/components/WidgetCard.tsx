import React, { useState } from 'react';
import { 
  RefreshCw, 
  Bookmark, 
  Play, 
  BookOpen, 
  Check, 
  ChevronDown, 
  ChevronUp, 
  GripVertical
} from 'lucide-react';
import { FeedItem, Source, PlatformSlug } from '../types';

interface WidgetCardProps {
  title: string;
  platform: PlatformSlug;
  source?: Source;
  items: FeedItem[];
  activeItemId?: string;
  density?: 'comfortable' | 'compact';
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
  activeItemId,
  density = 'comfortable',
  onPlayPiP,
  onOpenReader,
  onToggleBookmark,
  onToggleRead,
  onRefreshSource,
  isSyncing,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const unreadCount = items.filter(i => !i.isRead).length;

  return (
    <div className="widget-card flex flex-col group/card overflow-hidden select-none">
      {/* Widget Header: Title and unread count ALWAYS visible; actions appear only on hover */}
      <div className="widget-header flex items-center justify-between px-3.5 py-2.5 bg-surface select-none">
        <div className="flex items-center gap-2 min-w-0">
          {/* Drag Handle: ONLY on hover, subtle */}
          <GripVertical className="w-3.5 h-3.5 text-muted opacity-0 group-hover/card:opacity-100 cursor-grab shrink-0 transition-opacity duration-150 hidden sm:block -ml-1" />
          
          <h2 className="text-xs font-semibold tracking-tight text-primary truncate">
            {title}
          </h2>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {/* Always visible: quiet unread count in subtle gray */}
          <span className="font-mono text-[11px] text-muted">
            {unreadCount > 0 ? `${unreadCount} nuevos` : 'Al día'}
          </span>

          {/* Action buttons: REVEAL ONLY ON HOVER */}
          <div className="flex items-center gap-0.5 opacity-0 group-hover/card:opacity-100 transition-opacity duration-150">
            {onRefreshSource && (
              <button
                onClick={onRefreshSource}
                disabled={isSyncing}
                className="p-1 text-muted hover:text-primary rounded-[6px] transition-smooth hover:bg-surface-elevated outline-none"
                title="Actualizar canal"
              >
                <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin text-primary' : ''}`} />
              </button>
            )}

            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-1 text-muted hover:text-primary rounded-[6px] transition-smooth hover:bg-surface-elevated outline-none"
              title={isCollapsed ? "Expandir" : "Colapsar"}
            >
              {isCollapsed ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />}
            </button>
          </div>
        </div>
      </div>

      {/* Syncing Shimmer */}
      {isSyncing && (
        <div className="p-3 space-y-2">
          <div className="h-11 rounded-[8px] bg-surface-elevated animate-pulse" />
          <div className="h-11 rounded-[8px] bg-surface-elevated animate-pulse" />
        </div>
      )}

      {/* Feed Items Container: Spaced without nested cards, subtle internal scroll */}
      {!isCollapsed && !isSyncing && (
        <div className="p-1.5 space-y-1 sm:max-h-[640px] sm:overflow-y-auto touch-pan-y">
          {items.length === 0 ? (
            <div className="py-10 text-center text-xs text-muted font-mono">
              Sin publicaciones en este canal.
            </div>
          ) : (
            items.map((item) => {
              const isVideo = item.platform === 'youtube' || item.platform === 'twitch' || item.mediaType === 'youtube_video' || item.mediaType === 'twitch_stream';
              const isLive = Boolean(item.metrics?.liveViewers);
              const isFocused = activeItemId === item.id;

              // Video thumbnail URLs (16:9)
              const youtubeThumb = item.platform === 'youtube' && (item.externalId || item.mediaUrl)
                ? `https://img.youtube.com/vi/${item.externalId || item.mediaUrl}/mqdefault.jpg`
                : null;
              const twitchThumb = item.platform === 'twitch'
                ? 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=280&auto=format&fit=crop&q=70'
                : null;
              const videoThumbnail = youtubeThumb || twitchThumb;

              return (
                <div
                  key={item.id}
                  className={`group/item p-2.5 rounded-[8px] transition-smooth flex flex-col justify-between gap-1.5 outline-none relative select-none ${
                    isFocused
                      ? 'bg-surface-elevated item-focus-indicator before:absolute before:left-0 before:top-1.5 before:bottom-1.5 before:w-[2px] before:bg-accent before:rounded-r'
                      : 'hover:bg-surface-elevated/60'
                  }`}
                >
                  <div className="flex gap-2.5 items-start">
                    {/* 16:9 Thumbnail for YouTube & Twitch videos */}
                    {isVideo && videoThumbnail && (
                      <div 
                        onClick={() => onPlayPiP(item)}
                        className="relative w-20 sm:w-24 aspect-video rounded-[6px] overflow-hidden bg-surface-elevated shrink-0 cursor-pointer group/thumb shadow-none"
                      >
                        <img 
                          src={videoThumbnail} 
                          alt="" 
                          className="w-full h-full object-cover transition-smooth group-hover/thumb:scale-105"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-80 group-hover/thumb:opacity-100 transition-smooth">
                          <Play className="w-3.5 h-3.5 text-white fill-white" />
                        </div>
                      </div>
                    )}

                    {/* Content Column */}
                    <div className="flex-1 min-w-0">
                      {/* Top: Metadata in ONE single quiet line */}
                      <div className="flex items-center justify-between text-[11px] text-muted font-mono mb-1">
                        <div className="flex items-center gap-1.5 truncate max-w-[210px]">
                          {/* Live indicator vs Unread amber dot vs Read */}
                          {isLive ? (
                            <span className="flex items-center gap-1 font-semibold text-red-500 shrink-0">
                              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse shrink-0" />
                              <span className="text-[10px] tracking-wider font-bold">EN VIVO</span>
                            </span>
                          ) : !item.isRead ? (
                            <span 
                              className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" 
                              title="No leído"
                            />
                          ) : null}

                          <span className="truncate text-secondary font-medium">
                            {item.authorName}
                          </span>
                        </div>

                        {/* One single time reference · Reading time only on articles */}
                        <div className="flex items-center gap-1 shrink-0 text-muted font-mono text-[11px]">
                          <span>{item.publishedAt}</span>
                          {!isVideo && item.mediaType === 'article' && item.readTimeMinutes !== undefined && item.readTimeMinutes > 0 && (
                            <span>· {item.readTimeMinutes} min de lectura</span>
                          )}
                          {isLive && item.metrics?.liveViewers && (
                            <span>· {item.metrics.liveViewers} esp.</span>
                          )}
                        </div>
                      </div>

                      {/* Primary Title (High contrast AA, read is normal weight without accent dot) */}
                      <h3
                        onClick={() => isVideo ? onPlayPiP(item) : onOpenReader(item)}
                        className={`text-xs sm:text-[13px] leading-snug cursor-pointer transition-smooth line-clamp-2 ${
                          item.isRead
                            ? 'text-secondary hover:text-primary font-normal'
                            : 'text-primary font-medium hover:text-primary'
                        }`}
                      >
                        {item.title}
                      </h3>

                      {/* Description: Shown only in comfortable density or when focused */}
                      {(density === 'comfortable' || isFocused) && item.summary && (
                        <p 
                          onClick={() => isVideo ? onPlayPiP(item) : onOpenReader(item)}
                          className="text-[11px] sm:text-xs text-secondary mt-1 line-clamp-2 leading-relaxed cursor-pointer"
                        >
                          {item.summary}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Bottom Line: Metrics and discreet hover actions */}
                  <div className="flex items-center justify-between pt-0.5 text-[11px] font-mono text-muted">
                    {/* Metrics indicators */}
                    <div className="flex items-center gap-2">
                      {item.metrics?.views && !isLive && (
                        <span>{item.metrics.views} vistas</span>
                      )}
                      {item.metrics?.upvotes !== undefined && (
                        <span>{item.metrics.upvotes} votos</span>
                      )}
                      {item.metrics?.stars !== undefined && (
                        <span>{item.metrics.stars.toLocaleString()} ★</span>
                      )}
                    </div>

                    {/* Actions: Subtle, appear on hover on desktop, accessible on tap on mobile */}
                    <div className="flex items-center gap-1 shrink-0 opacity-80 sm:opacity-0 sm:group-hover/item:opacity-100 transition-opacity duration-150 ml-auto">
                      {isVideo ? (
                        <button
                          onClick={() => onPlayPiP(item)}
                          className="flex items-center gap-1 px-2 py-0.5 rounded-[6px] text-[11px] bg-surface-elevated hover:bg-surface-hover text-secondary hover:text-primary transition-smooth font-medium outline-none"
                          title="Reproducir en Picture-in-Picture"
                        >
                          <Play className="w-2.5 h-2.5 fill-current" />
                          <span>PiP</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => onOpenReader(item)}
                          className="flex items-center gap-1 px-2 py-0.5 rounded-[6px] text-[11px] bg-surface-elevated hover:bg-surface-hover text-secondary hover:text-primary transition-smooth font-medium outline-none"
                          title="Abrir modo lectura"
                        >
                          <BookOpen className="w-2.5 h-2.5" />
                          <span>Leer</span>
                        </button>
                      )}

                      {/* Bookmark: subtle neutral fill when saved */}
                      <button
                        onClick={() => onToggleBookmark(item.id)}
                        className={`p-1 rounded-[6px] transition-smooth hover:bg-surface-elevated outline-none ${
                          item.isBookmarked ? 'text-primary' : 'text-muted hover:text-secondary'
                        }`}
                        title={item.isBookmarked ? "Guardado" : "Guardar"}
                      >
                        <Bookmark className={`w-3 h-3 ${item.isBookmarked ? 'fill-current' : ''}`} />
                      </button>

                      {/* Mark Read */}
                      <button
                        onClick={() => onToggleRead(item.id)}
                        className={`p-1 rounded-[6px] transition-smooth hover:bg-surface-elevated outline-none ${
                          item.isRead ? 'text-secondary' : 'text-muted hover:text-secondary'
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
