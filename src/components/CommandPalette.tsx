import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  RefreshCw, 
  CornerDownLeft, 
  X, 
  Plus,
  Compass,
  FileText
} from 'lucide-react';
import { FeedItem, PlatformSlug } from '../types';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  items: FeedItem[];
  onSelectItem: (item: FeedItem) => void;
  onSync: () => void;
  onToggleViewMode?: () => void;
  onOpenArchitecture?: () => void;
  onSelectPlatform: (p: PlatformSlug | 'all') => void;
  onOpenAddSource?: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  items,
  onSelectItem,
  onSync,
  onSelectPlatform,
  onOpenAddSource,
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 40);
      setSelectedIndex(0);
      setQuery('');
    }
  }, [isOpen]);

  // Global keydown for ⌘K or Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) {
          onClose();
        }
      }
      if (isOpen && e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Filter actions and items
  const actions = [
    { id: 'act-add-video', title: 'Agregar Video o Canal (YouTube / Twitch / RSS)', action: () => { onOpenAddSource?.(); onClose(); } },
    { id: 'act-sync', title: 'Sincronizar feeds ahora', action: () => { onSync(); onClose(); } },
    { id: 'act-all', title: 'Ver todas las publicaciones', action: () => { onSelectPlatform('all'); onClose(); } },
    { id: 'act-yt', title: 'Filtrar por YouTube', action: () => { onSelectPlatform('youtube'); onClose(); } },
    { id: 'act-rss', title: 'Filtrar por Artículos y RSS', action: () => { onSelectPlatform('rss'); onClose(); } },
    { id: 'act-reddit', title: 'Filtrar por Reddit', action: () => { onSelectPlatform('reddit'); onClose(); } },
    { id: 'act-gh', title: 'Filtrar por GitHub Trending', action: () => { onSelectPlatform('github'); onClose(); } },
    { id: 'act-twitch', title: 'Filtrar por Twitch Streams', action: () => { onSelectPlatform('twitch'); onClose(); } },
  ];

  const matchedActions = actions.filter(a => a.title.toLowerCase().includes(query.toLowerCase()));
  const matchedItems = items.filter(i => 
    i.title.toLowerCase().includes(query.toLowerCase()) || 
    i.authorName.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 6);

  const combinedResults: { type: 'action' | 'item'; data: any }[] = [
    ...matchedActions.map(a => ({ type: 'action' as const, data: a })),
    ...matchedItems.map(i => ({ type: 'item' as const, data: i }))
  ];

  const handleKeyDownNav = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown' || (e.ctrlKey && e.key === 'j')) {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % Math.max(1, combinedResults.length));
    } else if (e.key === 'ArrowUp' || (e.ctrlKey && e.key === 'k')) {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + combinedResults.length) % Math.max(1, combinedResults.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const current = combinedResults[selectedIndex];
      if (current) {
        if (current.type === 'action') {
          current.data.action();
        } else {
          onSelectItem(current.data);
          onClose();
        }
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-5 sm:pt-[12vh] px-3 sm:px-4 bg-black/60 backdrop-blur-xs transition-smooth animate-fadeIn">
      {/* Click outside to dismiss */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Palette Container */}
      <div className="relative w-full max-w-xl max-h-[85vh] bg-surface border border-subtle rounded-xl shadow-xl overflow-hidden z-10 flex flex-col">
        {/* Search Input Bar */}
        <div className="flex items-center px-3.5 sm:px-4 py-3 border-b border-subtle bg-surface">
          <Search className="w-4 h-4 text-muted mr-3 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDownNav}
            placeholder="Escribe para buscar o saltar a un canal..."
            className="w-full bg-transparent text-xs sm:text-sm text-primary placeholder-muted focus:outline-none font-sans"
          />
          <div className="flex items-center gap-1 shrink-0 ml-2">
            <button 
              onClick={onClose} 
              className="sm:hidden text-muted hover:text-primary p-1"
            >
              <X className="w-4 h-4" />
            </button>
            <span className="touch-hide hidden sm:inline-block kbd-tag">ESC</span>
          </div>
        </div>

        {/* Results List */}
        <div className="max-h-[380px] overflow-y-auto p-2 space-y-0.5">
          {combinedResults.length === 0 ? (
            <div className="py-12 text-center text-xs text-muted font-mono">
              No se encontraron coincidencias para "{query}"
            </div>
          ) : (
            combinedResults.map((res, index) => {
              const isSelected = index === selectedIndex;

              if (res.type === 'action') {
                const act = res.data;
                return (
                  <div
                    key={`act-${act.id}`}
                    onClick={() => act.action()}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-smooth text-xs ${
                      isSelected
                        ? 'bg-surface-elevated text-primary'
                        : 'text-secondary hover:bg-surface-elevated/60'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <span className="w-1.5 h-1.5 rounded-full bg-secondary/40 shrink-0" />
                      <span className="font-medium truncate">{act.title}</span>
                    </div>

                    {isSelected && (
                      <span className="kbd-tag hidden sm:inline-block">↵ ejecutar</span>
                    )}
                  </div>
                );
              } else {
                const item = res.data as FeedItem;
                return (
                  <div
                    key={`item-${item.id}`}
                    onClick={() => {
                      onSelectItem(item);
                      onClose();
                    }}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-smooth text-xs ${
                      isSelected
                        ? 'bg-surface-elevated text-primary'
                        : 'text-secondary hover:bg-surface-elevated/60'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate min-w-0 mr-2">
                      <FileText className="w-3.5 h-3.5 text-muted shrink-0" />
                      <div className="truncate">
                        <span className="font-medium text-primary block truncate">
                          {item.title}
                        </span>
                        <span className="text-[11px] text-muted font-mono block truncate">
                          {item.authorName} · {item.publishedAt}
                        </span>
                      </div>
                    </div>

                    {isSelected && (
                      <CornerDownLeft className="w-3.5 h-3.5 text-accent shrink-0" />
                    )}
                  </div>
                );
              }
            })
          )}
        </div>

        {/* Minimal Footer Helper */}
        <div className="px-4 py-2 bg-surface-elevated border-t border-subtle flex items-center justify-between text-[11px] text-muted font-mono">
          <div className="touch-hide flex items-center gap-3">
            <span><kbd className="kbd-tag">↑</kbd> <kbd className="kbd-tag">↓</kbd> o <kbd className="kbd-tag">Ctrl+J/K</kbd></span>
            <span><kbd className="kbd-tag">↵</kbd> abrir</span>
          </div>
          <span className="w-full sm:w-auto text-center sm:text-right">Paleta de comandos</span>
        </div>
      </div>
    </div>
  );
};
