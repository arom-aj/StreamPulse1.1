import React, { useState, useRef, useEffect } from 'react';
import { 
  RefreshCw, 
  Search, 
  Plus, 
  Sun, 
  Moon, 
  SlidersHorizontal,
  Compass,
  AlignLeft,
  Menu
} from 'lucide-react';
import { PlatformSlug } from '../types';

interface HeaderProps {
  onOpenCommandPalette: () => void;
  selectedPlatform: PlatformSlug | 'all';
  onPlatformSelect: (platform: PlatformSlug | 'all') => void;
  onSync: () => void;
  isSyncing: boolean;
  onOpenShortcuts: () => void;
  onOpenAddSource: () => void;
  columns: number;
  onColumnsChange: (cols: number) => void;
  density: 'comfortable' | 'compact';
  onDensityChange: (d: 'comfortable' | 'compact') => void;
  unreadTotal: number;
  theme?: 'dark' | 'light';
  onToggleTheme?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenCommandPalette,
  selectedPlatform,
  onPlatformSelect,
  onSync,
  isSyncing,
  onOpenShortcuts,
  onOpenAddSource,
  columns,
  onColumnsChange,
  density,
  onDensityChange,
  unreadTotal,
  theme = 'dark',
  onToggleTheme,
}) => {
  const [isViewMenuOpen, setIsViewMenuOpen] = useState(false);
  const viewMenuRef = useRef<HTMLDivElement>(null);

  // Close view menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (viewMenuRef.current && !viewMenuRef.current.contains(e.target as Node)) {
        setIsViewMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Clean platform tabs without abbreviations
  const platforms: { slug: PlatformSlug; label: string }[] = [
    { slug: 'youtube', label: 'YouTube' },
    { slug: 'rss', label: 'Artículos & RSS' },
    { slug: 'reddit', label: 'Reddit' },
    { slug: 'github', label: 'GitHub' },
    { slug: 'twitch', label: 'Twitch' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-surface border-b border-subtle select-none shadow-none">
      {/* Main Bar - 100% Solid Opaque (no transparency or blur) */}
      <div className="max-w-[1600px] mx-auto px-3.5 sm:px-6 py-2.5 flex items-center justify-between gap-3 bg-surface">
        {/* Brand Zone */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-[8px] bg-surface-elevated border border-subtle flex items-center justify-center text-secondary">
            <Compass className="w-4 h-4 stroke-[1.75]" />
          </div>
          <span className="font-semibold text-sm sm:text-base tracking-tight text-primary">
            StreamPulse
          </span>
        </div>

        {/* Center: Omnibox Search */}
        <div className="flex-1 max-w-md mx-1 sm:mx-4 min-w-0">
          <button
            onClick={onOpenCommandPalette}
            className="w-full flex items-center justify-between bg-surface-elevated hover:bg-surface-hover border border-subtle rounded-[8px] px-3 py-1.5 text-xs text-secondary transition-smooth group outline-none"
          >
            <div className="flex items-center gap-2.5 truncate">
              <Search className="w-3.5 h-3.5 text-muted group-hover:text-primary transition-smooth shrink-0" />
              <span className="truncate hidden sm:inline">Buscar publicaciones o acciones...</span>
              <span className="truncate sm:hidden">Buscar...</span>
            </div>
            <div className="flex items-center gap-1 shrink-0 ml-1">
              <span className="kbd-tag hidden sm:inline-block">⌘K</span>
            </div>
          </button>
        </div>

        {/* Right Controls: Only Search, Sync, Vista menu, and Secondary Add button */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Sync Button: Restrained, subtle gray without amber */}
          <button
            onClick={onSync}
            disabled={isSyncing}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-[8px] text-xs font-mono border border-subtle transition-smooth bg-surface-elevated hover:bg-surface-hover text-secondary outline-none"
            title="Sincronizar feeds (S)"
          >
            <RefreshCw className={`w-3.5 h-3.5 shrink-0 ${isSyncing ? 'animate-spin text-primary' : 'text-muted'}`} />
            <span className="hidden md:inline">{isSyncing ? 'Actualizando' : 'Sync'}</span>
          </button>

          {/* Unified "Vista" Menu Dropdown */}
          <div className="relative" ref={viewMenuRef}>
            <button
              onClick={() => setIsViewMenuOpen(!isViewMenuOpen)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-[8px] text-xs font-medium border border-subtle transition-smooth bg-surface-elevated hover:bg-surface-hover text-secondary hover:text-primary ${
                isViewMenuOpen ? 'border-strong text-primary' : ''
              } outline-none`}
              title="Ajustes de vista"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 stroke-[1.75]" />
              <span className="hidden sm:inline">Vista</span>
            </button>

            {isViewMenuOpen && (
              <div className="absolute right-0 mt-1.5 w-60 rounded-[10px] bg-surface border border-subtle shadow-xl p-2.5 text-xs z-50 animate-fadeIn">
                {/* Column layout */}
                <div className="px-2 py-1 text-[11px] font-mono text-muted uppercase tracking-wider">
                  Columnas
                </div>
                <div className="flex items-center gap-1 p-1 bg-surface-elevated rounded-[8px] mb-2.5">
                  {[2, 3, 4].map(c => (
                    <button
                      key={c}
                      onClick={() => {
                        onColumnsChange(c);
                        setIsViewMenuOpen(false);
                      }}
                      className={`flex-1 py-1 rounded-[6px] text-center text-xs font-mono transition-smooth ${
                        columns === c
                          ? 'bg-surface text-primary font-medium shadow-xs'
                          : 'text-muted hover:text-secondary'
                      }`}
                    >
                      {c} cols
                    </button>
                  ))}
                </div>

                {/* Density selector (Comfortable vs Compact) */}
                <div className="px-2 py-1 text-[11px] font-mono text-muted uppercase tracking-wider">
                  Densidad
                </div>
                <div className="flex items-center gap-1 p-1 bg-surface-elevated rounded-[8px] mb-2.5">
                  <button
                    onClick={() => {
                      onDensityChange('comfortable');
                      setIsViewMenuOpen(false);
                    }}
                    className={`flex-1 py-1 rounded-[6px] text-center text-xs transition-smooth ${
                      density === 'comfortable'
                        ? 'bg-surface text-primary font-medium shadow-xs'
                        : 'text-muted hover:text-secondary'
                    }`}
                  >
                    Cómoda
                  </button>
                  <button
                    onClick={() => {
                      onDensityChange('compact');
                      setIsViewMenuOpen(false);
                    }}
                    className={`flex-1 py-1 rounded-[6px] text-center text-xs transition-smooth ${
                      density === 'compact'
                        ? 'bg-surface text-primary font-medium shadow-xs'
                        : 'text-muted hover:text-secondary'
                    }`}
                  >
                    Compacta
                  </button>
                </div>

                {/* Theme selector */}
                <div className="px-2 py-1 text-[11px] font-mono text-muted uppercase tracking-wider">
                  Tema
                </div>
                <div className="flex items-center gap-1 p-1 bg-surface-elevated rounded-[8px] mb-2.5">
                  <button
                    onClick={() => {
                      if (theme !== 'dark') onToggleTheme?.();
                      setIsViewMenuOpen(false);
                    }}
                    className={`flex-1 py-1 px-2 rounded-[6px] text-center text-xs flex items-center justify-center gap-1.5 transition-smooth ${
                      theme === 'dark'
                        ? 'bg-surface text-primary font-medium shadow-xs'
                        : 'text-muted hover:text-secondary'
                    }`}
                  >
                    <Moon className="w-3 h-3" />
                    <span>Grafito</span>
                  </button>
                  <button
                    onClick={() => {
                      if (theme !== 'light') onToggleTheme?.();
                      setIsViewMenuOpen(false);
                    }}
                    className={`flex-1 py-1 px-2 rounded-[6px] text-center text-xs flex items-center justify-center gap-1.5 transition-smooth ${
                      theme === 'light'
                        ? 'bg-surface text-primary font-medium shadow-xs'
                        : 'text-muted hover:text-secondary'
                    }`}
                  >
                    <Sun className="w-3 h-3" />
                    <span>Papel</span>
                  </button>
                </div>

                {/* Keyboard Shortcuts entry (Eliminated keyboard icon from header, placed inside Vista menu) */}
                <button
                  onClick={() => {
                    setIsViewMenuOpen(false);
                    onOpenShortcuts();
                  }}
                  className="w-full text-left px-2 py-1.5 rounded-[8px] text-secondary hover:text-primary hover:bg-surface-elevated transition-smooth flex items-center justify-between"
                >
                  <span>Atajos de teclado</span>
                  <span className="kbd-tag">?</span>
                </button>
              </div>
            )}
          </div>

          {/* Secondary Action: Agregar Fuente (Subtle border, no amber fill) */}
          <button
            onClick={onOpenAddSource}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] text-xs font-medium border border-subtle bg-surface-elevated hover:bg-surface-hover text-secondary hover:text-primary transition-smooth outline-none"
            title="Agregar enlace de video o canal"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2]" />
            <span className="hidden sm:inline">Agregar Fuente</span>
            <span className="sm:hidden">+ Fuente</span>
          </button>
        </div>
      </div>

      {/* Filter Ribbon: 100% Solid Opaque, subtle bottom line, focuses/filters widgets */}
      <div className="max-w-[1600px] mx-auto px-3.5 sm:px-6 py-1.5 flex items-center gap-1.5 overflow-x-auto no-scrollbar border-t border-subtle text-xs bg-surface">
        <button
          onClick={() => onPlatformSelect('all')}
          className={`shrink-0 px-2.5 py-1 rounded-[6px] text-xs font-medium transition-smooth ${
            selectedPlatform === 'all'
              ? 'bg-surface-elevated text-primary font-medium'
              : 'text-muted hover:text-secondary'
          } outline-none`}
        >
          Todo {unreadTotal > 0 && <span className="font-mono text-muted text-[11px]">({unreadTotal})</span>}
        </button>

        {platforms.map(p => {
          const isActive = selectedPlatform === p.slug;
          return (
            <button
              key={p.slug}
              onClick={() => onPlatformSelect(p.slug)}
              className={`shrink-0 px-2.5 py-1 rounded-[6px] text-xs font-medium transition-smooth ${
                isActive
                  ? 'bg-surface-elevated text-primary font-medium'
                  : 'text-muted hover:text-secondary'
              } outline-none`}
            >
              <span>{p.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
