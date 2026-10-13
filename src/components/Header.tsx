import React, { useState } from 'react';
import { 
  RefreshCw, 
  Search, 
  Plus, 
  Download, 
  Sun, 
  Moon,
  Keyboard,
  Compass
} from 'lucide-react';
import { PlatformSlug } from '../types';
import { usePWAInstall } from '../hooks/usePWAInstall';

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
  unreadTotal,
  theme = 'dark',
  onToggleTheme,
}) => {
  const { isInstallable, install, isIOS } = usePWAInstall();
  const [showIOSModal, setShowIOSModal] = useState(false);

  // Discreet source labels with neutral markers
  const platforms: { slug: PlatformSlug; label: string; code: string }[] = [
    { slug: 'youtube', label: 'YouTube', code: 'YT' },
    { slug: 'rss', label: 'Artículos & RSS', code: 'RSS' },
    { slug: 'reddit', label: 'Reddit', code: 'RD' },
    { slug: 'github', label: 'GitHub', code: 'GH' },
    { slug: 'twitch', label: 'Twitch', code: 'TV' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-surface/95 backdrop-blur-md border-b border-subtle transition-smooth">
      {/* Main Bar */}
      <div className="max-w-[1600px] mx-auto px-3.5 sm:px-6 py-2.5 flex items-center justify-between gap-3">
        {/* Brand Zone */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-surface-elevated border border-subtle flex items-center justify-center text-accent">
            <Compass className="w-4 h-4 stroke-[1.75]" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="font-semibold text-sm sm:text-base tracking-tight text-primary">
              StreamPulse
            </span>
            <span className="text-accent text-xs font-mono font-medium">·</span>
          </div>
        </div>

        {/* Center: Omnibox Trigger */}
        <div className="flex-1 max-w-md mx-1 sm:mx-4 min-w-0">
          <button
            onClick={onOpenCommandPalette}
            className="w-full flex items-center justify-between bg-surface-elevated hover:bg-surface-hover border border-subtle rounded-lg px-3 py-1.5 text-xs text-secondary transition-smooth group"
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

        {/* Right Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Desktop Grid Columns Selector */}
          <div className="hidden xl:flex items-center bg-surface-elevated border border-subtle rounded-lg p-0.5 text-xs font-mono">
            {[2, 3, 4].map(c => (
              <button
                key={c}
                onClick={() => onColumnsChange(c)}
                className={`px-2 py-0.5 rounded transition-smooth text-[11px] ${
                  columns === c 
                    ? 'bg-surface text-primary font-medium shadow-xs' 
                    : 'text-muted hover:text-secondary'
                }`}
                title={`Ver en ${c} columnas`}
              >
                {c}C
              </button>
            ))}
          </div>

          {/* Sync Button */}
          <button
            onClick={onSync}
            disabled={isSyncing}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-mono border border-subtle transition-smooth bg-surface-elevated hover:bg-surface-hover text-secondary ${
              isSyncing ? 'text-accent' : ''
            }`}
            title="Sincronizar fuentes (S)"
          >
            <RefreshCw className={`w-3.5 h-3.5 shrink-0 ${isSyncing ? 'animate-spin text-accent' : 'text-muted'}`} />
            <span className="hidden md:inline">{isSyncing ? 'Actualizando' : 'Sync'}</span>
          </button>

          {/* Theme Toggle (Warm Graphite <-> Warm Paper) */}
          {onToggleTheme && (
            <button
              onClick={onToggleTheme}
              className="p-1.5 rounded-lg border border-subtle bg-surface-elevated hover:bg-surface-hover text-muted hover:text-primary transition-smooth"
              title={theme === 'dark' ? "Cambiar a Papel Cálido (Modo claro)" : "Cambiar a Grafito Cálido (Modo oscuro)"}
            >
              {theme === 'dark' ? (
                <Sun className="w-3.5 h-3.5" />
              ) : (
                <Moon className="w-3.5 h-3.5" />
              )}
            </button>
          )}

          {/* Primary Action Button */}
          <button
            onClick={onOpenAddSource}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-accent text-[var(--accent-contrast)] hover:opacity-90 active:scale-[0.98] transition-smooth shadow-xs"
            title="Agregar enlace de video o canal"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.25]" />
            <span className="hidden sm:inline">Agregar Fuente</span>
            <span className="sm:hidden">+ Video</span>
          </button>

          {/* Shortcuts button */}
          <button
            onClick={onOpenShortcuts}
            className="hidden sm:block p-1.5 text-muted hover:text-primary rounded-lg transition-smooth hover:bg-surface-elevated"
            title="Atajos de teclado (?)"
          >
            <Keyboard className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Filter Ribbon: Quiet typographic tabs with discreet markers */}
      <div className="max-w-[1600px] mx-auto px-3.5 sm:px-6 py-1.5 flex items-center gap-1 overflow-x-auto no-scrollbar border-t border-subtle text-xs">
        <button
          onClick={() => onPlatformSelect('all')}
          className={`shrink-0 px-2.5 py-1 rounded-md text-xs font-medium transition-smooth ${
            selectedPlatform === 'all'
              ? 'bg-surface-elevated text-primary border border-subtle'
              : 'text-muted hover:text-secondary'
          }`}
        >
          Todo {unreadTotal > 0 && <span className="font-mono text-muted text-[11px]">({unreadTotal})</span>}
        </button>

        {platforms.map(p => {
          const isActive = selectedPlatform === p.slug;
          return (
            <button
              key={p.slug}
              onClick={() => onPlatformSelect(p.slug)}
              className={`shrink-0 px-2.5 py-1 rounded-md text-xs font-medium transition-smooth flex items-center gap-1.5 ${
                isActive
                  ? 'bg-surface-elevated text-primary border border-subtle'
                  : 'text-muted hover:text-secondary'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-accent' : 'bg-muted/40'}`} />
              <span>{p.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
