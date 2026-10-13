import React, { useState } from 'react';
import { 
  X, 
  Play, 
  Radio, 
  Check,
  Compass
} from 'lucide-react';
import { PlatformSlug, Source } from '../types';
import { extractYouTubeId, extractTwitchChannel } from '../utils/videoUtils';

interface AddSourceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddSource: (source: Partial<Source>) => void;
  onAddDirectVideo?: (videoItem: {
    platform: 'youtube' | 'twitch';
    videoId: string;
    title: string;
    authorName: string;
    url: string;
    playImmediately?: boolean;
  }) => void;
}

export const AddSourceModal: React.FC<AddSourceModalProps> = ({
  isOpen,
  onClose,
  onAddSource,
  onAddDirectVideo,
}) => {
  const [modalTab, setModalTab] = useState<'video' | 'source'>('video');

  // Direct video form state
  const [videoUrl, setVideoUrl] = useState('');
  const [videoTitle, setVideoTitle] = useState('');
  const [videoAuthor, setVideoAuthor] = useState('');
  const [playImmediately, setPlayImmediately] = useState(true);
  const [detectedVideoId, setDetectedVideoId] = useState<string | null>(null);

  // Channel/Source form state
  const [platform, setPlatform] = useState<PlatformSlug>('youtube');
  const [sourceTitle, setSourceTitle] = useState('');
  const [sourceTarget, setSourceTarget] = useState('');
  const [category, setCategory] = useState<'Dev' | 'Tech' | 'Gaming' | 'News' | 'Media'>('Dev');
  const [interval, setInterval] = useState(15);

  if (!isOpen) return null;

  const handleVideoUrlChange = (value: string) => {
    setVideoUrl(value);
    const ytid = extractYouTubeId(value);
    if (ytid && ytid !== 'dQw4w9WgXcQ') {
      setDetectedVideoId(ytid);
      if (!videoTitle) {
        setVideoTitle(`Video (${ytid})`);
      }
      if (!videoAuthor) {
        setVideoAuthor('YouTube');
      }
    } else if (value.includes('twitch.tv/')) {
      const channel = extractTwitchChannel(value);
      setDetectedVideoId(channel);
      if (!videoTitle) setVideoTitle(`Stream: ${channel}`);
      if (!videoAuthor) setVideoAuthor(channel);
    } else {
      setDetectedVideoId(null);
    }
  };

  const handleDirectVideoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoUrl.trim()) return;

    const isTwitch = videoUrl.includes('twitch.tv');
    let videoId = detectedVideoId;

    if (!videoId) {
      if (isTwitch) {
        videoId = extractTwitchChannel(videoUrl);
      } else {
        videoId = extractYouTubeId(videoUrl) || 'dQw4w9WgXcQ';
      }
    }

    if (onAddDirectVideo) {
      onAddDirectVideo({
        platform: isTwitch ? 'twitch' : 'youtube',
        videoId: videoId,
        title: videoTitle.trim() || (isTwitch ? `Stream: ${videoId}` : `Video ${videoId}`),
        authorName: videoAuthor.trim() || (isTwitch ? 'Twitch Streamer' : 'YouTube Channel'),
        url: videoUrl.startsWith('http') ? videoUrl : `https://${videoUrl}`,
        playImmediately: playImmediately,
      });
    }

    setVideoUrl('');
    setVideoTitle('');
    setVideoAuthor('');
    setDetectedVideoId(null);
    onClose();
  };

  const handleChannelSourceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sourceTitle.trim() || !sourceTarget.trim()) return;

    onAddSource({
      platformId: platform,
      title: sourceTitle.trim(),
      url: sourceTarget.trim().startsWith('http') ? sourceTarget.trim() : `https://${sourceTarget.trim()}`,
      externalId: sourceTarget.trim(),
      category: category,
      fetchIntervalMinutes: interval,
      itemCount: 1,
      unreadCount: 1,
      status: 'active'
    });

    setSourceTitle('');
    setSourceTarget('');
    onClose();
  };

  const presets = [
    { title: 'Laravel Reverb WebSockets', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', author: 'Laravel Daily', id: 'dQw4w9WgXcQ' },
    { title: 'PHP 8.3 Extreme Benchmark', url: 'https://www.youtube.com/watch?v=L_LUpnjgPso', author: 'DevOps Central', id: 'L_LUpnjgPso' },
    { title: 'ThePrimeagen Live', url: 'https://twitch.tv/theprimeagen', author: 'ThePrimeagen', id: 'theprimeagen' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-4 animate-fadeIn">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative w-full max-w-lg max-h-[92vh] overflow-y-auto bg-surface border border-subtle rounded-xl shadow-xl p-5 sm:p-6 z-10 text-primary overscroll-contain transition-smooth">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-subtle mb-4">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-surface-elevated border border-subtle flex items-center justify-center text-accent shrink-0">
              <Compass className="w-4 h-4 stroke-[1.75]" />
            </div>
            <div className="min-w-0">
              <h3 className="font-semibold text-sm tracking-tight text-primary truncate">
                Agregar Video o Canal
              </h3>
              <p className="text-[11px] text-muted font-mono truncate">
                Ingestión directa para Picture-in-Picture o monitoreo continuo
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-muted hover:text-primary rounded-lg transition-smooth shrink-0 ml-2 hover:bg-surface-elevated">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center p-1 bg-surface-elevated border border-subtle rounded-lg mb-4 text-xs font-mono gap-1">
          <button
            onClick={() => setModalTab('video')}
            className={`flex-1 py-1.5 px-3 rounded-md flex items-center justify-center gap-1.5 transition-smooth ${
              modalTab === 'video'
                ? 'bg-surface text-primary font-medium shadow-xs border border-subtle'
                : 'text-muted hover:text-secondary'
            }`}
          >
            <Play className="w-3 h-3 text-accent fill-accent shrink-0" />
            <span className="truncate">Video Directo (PiP)</span>
          </button>

          <button
            onClick={() => setModalTab('source')}
            className={`flex-1 py-1.5 px-3 rounded-md flex items-center justify-center gap-1.5 transition-smooth ${
              modalTab === 'source'
                ? 'bg-surface text-primary font-medium shadow-xs border border-subtle'
                : 'text-muted hover:text-secondary'
            }`}
          >
            <Radio className="w-3 h-3 text-accent shrink-0" />
            <span className="truncate">Canal Completo</span>
          </button>
        </div>

        {/* TAB 1: Direct Video */}
        {modalTab === 'video' ? (
          <form onSubmit={handleDirectVideoSubmit} className="space-y-3.5 text-xs">
            <div>
              <label className="block text-secondary mb-1 font-medium text-[11px] font-mono">
                URL de YouTube o Canal de Twitch
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={videoUrl}
                  onChange={(e) => handleVideoUrlChange(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=... o youtu.be/..."
                  className="w-full bg-surface-elevated border border-subtle focus:border-accent rounded-lg px-3 py-2 text-primary placeholder-muted focus:outline-none transition-smooth text-xs"
                />
                {detectedVideoId && (
                  <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[11px] text-accent font-mono flex items-center gap-1">
                    <Check className="w-3 h-3" /> Detectado
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-secondary mb-1 font-medium text-[11px] font-mono">
                  Título
                </label>
                <input
                  type="text"
                  value={videoTitle}
                  onChange={(e) => setVideoTitle(e.target.value)}
                  placeholder="Título del video..."
                  className="w-full bg-surface-elevated border border-subtle focus:border-accent rounded-lg px-3 py-2 text-primary placeholder-muted focus:outline-none text-xs"
                />
              </div>

              <div>
                <label className="block text-secondary mb-1 font-medium text-[11px] font-mono">
                  Canal / Creador
                </label>
                <input
                  type="text"
                  value={videoAuthor}
                  onChange={(e) => setVideoAuthor(e.target.value)}
                  placeholder="Autor..."
                  className="w-full bg-surface-elevated border border-subtle focus:border-accent rounded-lg px-3 py-2 text-primary placeholder-muted focus:outline-none text-xs"
                />
              </div>
            </div>

            {/* Checkbox */}
            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="playPiPImmediately"
                checked={playImmediately}
                onChange={(e) => setPlayImmediately(e.target.checked)}
                className="rounded border-subtle bg-surface-elevated text-accent focus:ring-0 shrink-0 cursor-pointer"
              />
              <label htmlFor="playPiPImmediately" className="text-secondary cursor-pointer select-none text-[11px]">
                Reproducir de inmediato en ventana Picture-in-Picture
              </label>
            </div>

            {/* Quick Presets */}
            <div className="pt-3 border-t border-subtle">
              <span className="text-[10px] text-muted uppercase font-mono block mb-1.5">
                Probar con un clic:
              </span>
              <div className="space-y-1">
                {presets.map((p, idx) => (
                  <button
                    type="button"
                    key={idx}
                    onClick={() => {
                      handleVideoUrlChange(p.url);
                      setVideoTitle(p.title);
                      setVideoAuthor(p.author);
                      setDetectedVideoId(p.id);
                    }}
                    className="w-full text-left p-1.5 rounded-md bg-surface-elevated hover:bg-surface-hover border border-subtle text-[11px] text-secondary hover:text-primary flex items-center justify-between transition-smooth"
                  >
                    <span className="truncate">{p.title}</span>
                    <span className="text-[10px] text-accent font-mono shrink-0 ml-2">Cargar →</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-2.5 rounded-lg bg-accent text-[var(--accent-contrast)] hover:opacity-90 font-medium transition-smooth shadow-xs flex items-center justify-center gap-2"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Agregar Video al Feed & PiP</span>
              </button>
            </div>
          </form>
        ) : (
          /* TAB 2: Full Channel */
          <form onSubmit={handleChannelSourceSubmit} className="space-y-3.5 text-xs">
            <div>
              <label className="block text-secondary mb-1.5 font-medium text-[11px] font-mono">
                Plataforma
              </label>
              <div className="grid grid-cols-5 gap-1.5 font-mono text-[11px]">
                {[
                  { slug: 'youtube' as PlatformSlug, label: 'YouTube' },
                  { slug: 'rss' as PlatformSlug, label: 'RSS' },
                  { slug: 'reddit' as PlatformSlug, label: 'Reddit' },
                  { slug: 'github' as PlatformSlug, label: 'GitHub' },
                  { slug: 'twitch' as PlatformSlug, label: 'Twitch' },
                ].map(p => (
                  <button
                    type="button"
                    key={p.slug}
                    onClick={() => setPlatform(p.slug)}
                    className={`py-1.5 px-2 rounded-md border text-center transition-smooth ${
                      platform === p.slug
                        ? 'bg-surface-elevated border-accent text-primary font-medium'
                        : 'bg-surface border-subtle text-muted hover:text-secondary'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-secondary mb-1 font-medium text-[11px] font-mono">
                Nombre de la Fuente
              </label>
              <input
                type="text"
                required
                value={sourceTitle}
                onChange={(e) => setSourceTitle(e.target.value)}
                placeholder="Ej: Fireship, Laravel Daily..."
                className="w-full bg-surface-elevated border border-subtle focus:border-accent rounded-lg px-3 py-2 text-primary placeholder-muted focus:outline-none text-xs"
              />
            </div>

            <div>
              <label className="block text-secondary mb-1 font-medium text-[11px] font-mono">
                URL o Identificador
              </label>
              <input
                type="text"
                required
                value={sourceTarget}
                onChange={(e) => setSourceTarget(e.target.value)}
                placeholder={platform === 'youtube' ? 'Handle (@LaravelDaily) o Channel ID' : 'URL de feed o identificador'}
                className="w-full bg-surface-elevated border border-subtle focus:border-accent rounded-lg px-3 py-2 text-primary placeholder-muted focus:outline-none text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-secondary mb-1 font-medium text-[11px] font-mono">Categoría</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full bg-surface-elevated border border-subtle rounded-lg px-2.5 py-2 text-primary focus:outline-none text-xs font-mono"
                >
                  <option value="Dev">Dev</option>
                  <option value="Tech">Tech</option>
                  <option value="Gaming">Gaming</option>
                  <option value="News">News</option>
                  <option value="Media">Media</option>
                </select>
              </div>

              <div>
                <label className="block text-secondary mb-1 font-medium text-[11px] font-mono">Intervalo</label>
                <select
                  value={interval}
                  onChange={(e) => setInterval(Number(e.target.value))}
                  className="w-full bg-surface-elevated border border-subtle rounded-lg px-2.5 py-2 text-primary focus:outline-none text-xs font-mono"
                >
                  <option value={5}>Cada 5 min</option>
                  <option value={15}>Cada 15 min</option>
                  <option value={30}>Cada 30 min</option>
                </select>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-2.5 rounded-lg bg-accent text-[var(--accent-contrast)] hover:opacity-90 font-medium transition-smooth shadow-xs"
              >
                Conectar Fuente
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
