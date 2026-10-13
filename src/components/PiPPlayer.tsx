import React, { useState } from 'react';
import { 
  X, 
  Maximize2, 
  Minimize2, 
  ExternalLink, 
  Volume2, 
  Headphones,
  Play
} from 'lucide-react';
import { FeedItem } from '../types';
import { getYouTubeEmbedUrl, getTwitchEmbedUrl } from '../utils/videoUtils';

interface PiPPlayerProps {
  item: FeedItem | null;
  onClose: () => void;
}

export const PiPPlayer: React.FC<PiPPlayerProps> = ({ item, onClose }) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAudioOnly, setIsAudioOnly] = useState(false);

  if (!item) return null;

  const isYouTube = item.platform === 'youtube' || item.mediaType === 'youtube_video';
  const isTwitch = item.platform === 'twitch' || item.mediaType === 'twitch_stream';

  let embedUrl = '';
  if (isYouTube) {
    embedUrl = getYouTubeEmbedUrl(item.mediaUrl || item.externalId || item.url);
  } else if (isTwitch) {
    embedUrl = getTwitchEmbedUrl(item.mediaUrl || item.externalId || item.url);
  }

  return (
    <div 
      className={`fixed z-50 transition-smooth rounded-xl border border-subtle bg-surface shadow-md overflow-hidden group/pip ${
        isAudioOnly || isMinimized
          ? 'bottom-3 left-3 right-3 sm:left-auto sm:right-5 sm:bottom-5 sm:w-72 h-13' 
          : isExpanded 
            ? 'bottom-3 left-3 right-3 sm:bottom-6 sm:right-6 sm:left-auto sm:w-[580px] sm:h-[360px] h-64' 
            : 'bottom-3 left-3 right-3 sm:bottom-5 sm:right-5 sm:left-auto sm:w-92 sm:h-60 h-56'
      }`}
    >
      {/* Header Bar - Discreet, revealed on hover or tap */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-surface border-b border-subtle select-none text-xs transition-smooth opacity-95 sm:opacity-80 sm:group-hover/pip:opacity-100">
        <div className="flex items-center gap-2 truncate mr-2 min-w-0">
          <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
          <span className="text-primary font-medium truncate text-[11px] sm:text-xs">
            {item.title}
          </span>
        </div>

        {/* Minimal Controls */}
        <div className="flex items-center gap-1 shrink-0 text-muted">
          {/* Audio toggle */}
          <button
            onClick={() => setIsAudioOnly(!isAudioOnly)}
            className={`p-1 rounded transition-smooth hover:bg-surface-elevated hover:text-primary ${
              isAudioOnly ? 'text-accent' : ''
            }`}
            title={isAudioOnly ? "Ver video" : "Solo audio"}
          >
            <Headphones className="w-3.5 h-3.5" />
          </button>

          {/* Expand toggle */}
          {!isAudioOnly && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="hidden sm:block p-1 hover:text-primary rounded transition-smooth hover:bg-surface-elevated"
              title={isExpanded ? "Tamaño estándar" : "Expandir"}
            >
              {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            </button>
          )}

          {/* External */}
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1 hover:text-primary rounded transition-smooth hover:bg-surface-elevated"
            title="Abrir en pestaña nueva"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          {/* Close */}
          <button
            onClick={onClose}
            className="p-1 hover:text-primary rounded transition-smooth hover:bg-surface-elevated"
            title="Cerrar"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Video Surface or Audio-only Mode */}
      {!isAudioOnly && !isMinimized ? (
        <div className="relative w-full h-[calc(100%-32px)] bg-black">
          {embedUrl ? (
            <iframe
              src={embedUrl}
              title={item.title}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-muted">
              <Play className="w-6 h-6 mb-1 text-muted" />
              <p className="text-[11px] font-mono">No se pudo cargar el stream</p>
            </div>
          )}
        </div>
      ) : (
        <div className="flex items-center justify-between px-3 h-full text-xs font-mono">
          <div className="flex items-center gap-2 text-accent min-w-0">
            <Volume2 className="w-3.5 h-3.5 animate-pulse shrink-0" />
            <span className="truncate text-secondary text-[11px]">
              {isAudioOnly ? 'Audio en segundo plano' : 'Minimizado'}
            </span>
          </div>
          <button 
            onClick={() => {
              setIsAudioOnly(false);
              setIsMinimized(false);
            }}
            className="text-[11px] text-accent hover:underline shrink-0 ml-2"
          >
            Ver video
          </button>
        </div>
      )}
    </div>
  );
};
