import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Bookmark, 
  Share2, 
  ExternalLink, 
  Check, 
  ArrowLeft
} from 'lucide-react';
import { FeedItem } from '../types';

interface CleanReaderModalProps {
  item: FeedItem | null;
  onClose: () => void;
  onToggleBookmark: (id: string) => void;
}

export const CleanReaderModal: React.FC<CleanReaderModalProps> = ({
  item,
  onClose,
  onToggleBookmark,
}) => {
  const [fontSize, setFontSize] = useState<'sm' | 'base' | 'lg'>('base');
  const [copied, setCopied] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    setScrollProgress(0);
  }, [item]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollHeight > clientHeight) {
      const progress = (scrollTop / (scrollHeight - clientHeight)) * 100;
      setScrollProgress(Math.min(100, Math.max(0, progress)));
    }
  };

  if (!item) return null;

  const handleShare = async () => {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(item.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const fontSizeClass = {
    sm: 'text-[15px] sm:text-[16px] leading-[1.7]',
    base: 'text-[17px] sm:text-[18px] leading-[1.75]',
    lg: 'text-[19px] sm:text-[21px] leading-[1.8]',
  }[fontSize];

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs transition-smooth">
      {/* Click outside backdrop to dismiss */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Reader Drawer */}
      <div className="relative w-full max-w-2xl h-full bg-surface border-l border-subtle shadow-xl flex flex-col z-10 transition-smooth animate-slideLeft">
        {/* Top Reading Progress Bar */}
        <div className="h-0.5 w-full bg-surface-elevated">
          <div 
            className="h-full bg-accent transition-smooth"
            style={{ width: `${scrollProgress}%` }}
          />
        </div>

        {/* Minimal Control Bar */}
        <div className="flex items-center justify-between px-4 sm:px-8 py-3.5 border-b border-subtle bg-surface select-none">
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="flex items-center gap-1.5 text-xs text-muted hover:text-primary transition-smooth p-1 -ml-1 rounded hover:bg-surface-elevated"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="font-mono text-[11px]">Volver</span>
            </button>
          </div>

          {/* Minimal right controls */}
          <div className="flex items-center gap-1.5 text-xs font-mono">
            {/* Font Size A- / A+ */}
            <div className="flex items-center bg-surface-elevated border border-subtle rounded p-0.5">
              <button
                onClick={() => setFontSize('sm')}
                className={`px-2 py-0.5 rounded transition-smooth text-[11px] ${fontSize === 'sm' ? 'bg-surface text-primary font-medium' : 'text-muted'}`}
                title="Texto pequeño"
              >
                A-
              </button>
              <button
                onClick={() => setFontSize('base')}
                className={`px-2 py-0.5 rounded transition-smooth text-[11px] ${fontSize === 'base' ? 'bg-surface text-primary font-medium' : 'text-muted'}`}
                title="Texto estándar"
              >
                A
              </button>
              <button
                onClick={() => setFontSize('lg')}
                className={`px-2 py-0.5 rounded transition-smooth text-[11px] ${fontSize === 'lg' ? 'bg-surface text-primary font-medium' : 'text-muted'}`}
                title="Texto grande"
              >
                A+
              </button>
            </div>

            {/* Bookmark */}
            <button
              onClick={() => onToggleBookmark(item.id)}
              className={`p-1.5 rounded transition-smooth hover:bg-surface-elevated ${
                item.isBookmarked ? 'text-accent' : 'text-muted hover:text-secondary'
              }`}
              title={item.isBookmarked ? "Guardado" : "Guardar para después"}
            >
              <Bookmark className={`w-3.5 h-3.5 ${item.isBookmarked ? 'fill-current' : ''}`} />
            </button>

            {/* Share */}
            <button
              onClick={handleShare}
              className="p-1.5 rounded text-muted hover:text-primary transition-smooth hover:bg-surface-elevated"
              title="Copiar enlace"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-accent" /> : <Share2 className="w-3.5 h-3.5" />}
            </button>

            {/* Open Original */}
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded text-muted hover:text-primary transition-smooth hover:bg-surface-elevated"
              title="Abrir artículo original"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            {/* Close */}
            <button
              onClick={onClose}
              className="p-1.5 rounded text-muted hover:text-primary transition-smooth hover:bg-surface-elevated ml-1"
              title="Cerrar (Esc)"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Body: Column of 60-70 characters, Serif Newsreader, airy */}
        <div 
          ref={contentRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto px-5 sm:px-12 py-8 text-primary"
        >
          <div className="max-w-[65ch] mx-auto">
            {/* Header metadata */}
            <header className="mb-8 pb-6 border-b border-subtle">
              <div className="flex flex-wrap items-center gap-2 text-xs text-muted font-mono mb-3">
                <span className="text-secondary font-medium">{item.authorName}</span>
                <span>·</span>
                <span>{item.publishedAt}</span>
                {item.readTimeMinutes !== undefined && item.readTimeMinutes > 0 && (
                  <>
                    <span>·</span>
                    <span>{item.readTimeMinutes} min de lectura</span>
                  </>
                )}
              </div>

              <h1 className="text-xl sm:text-2xl md:text-3xl font-editorial font-medium tracking-tight text-primary leading-tight">
                {item.title}
              </h1>
            </header>

            {/* Clean Serif Editorial Prose */}
            <article className={`font-editorial ${fontSizeClass} text-primary/95 space-y-5 selection:bg-accent-soft selection:text-accent`}>
              <div 
                dangerouslySetInnerHTML={{ __html: item.contentCleanHtml }} 
                className="[&>h2]:text-lg sm:[&>h2]:text-xl [&>h2]:font-sans [&>h2]:font-semibold [&>h2]:text-primary [&>h2]:mt-8 [&>h2]:mb-3 [&>h3]:text-base [&>h3]:font-sans [&>h3]:font-medium [&>h3]:text-secondary [&>h3]:mt-6 [&>h3]:mb-2 [&>p]:mb-4 [&>ul]:list-disc [&>ul]:pl-5 [&>ol]:list-decimal [&>ol]:pl-5 [&>blockquote]:border-l-2 [&>blockquote]:border-accent [&>blockquote]:pl-4 [&>blockquote]:italic [&>blockquote]:text-secondary [&>code]:bg-surface-elevated [&>code]:text-accent [&>code]:px-1.5 [&>code]:py-0.5 [&>code]:rounded [&>code]:font-mono [&>code]:text-[0.9em] [&>pre]:bg-surface-elevated [&>pre]:p-4 [&>pre]:rounded-lg [&>pre]:border [&>pre]:border-subtle [&>pre]:overflow-x-auto [&>pre]:my-4"
              />
            </article>

            {/* Editorial Footer */}
            <footer className="mt-12 pt-6 border-t border-subtle flex items-center justify-between text-xs text-muted font-mono">
              <span>Lectura enfocada en StreamPulse</span>
              <a 
                href={item.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-accent hover:underline flex items-center gap-1 font-medium"
              >
                Ver fuente original <ExternalLink className="w-3 h-3" />
              </a>
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
};
