import React from 'react';
import { X, Keyboard } from 'lucide-react';

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const KeyboardShortcutsModal: React.FC<KeyboardShortcutsModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const shortcuts = [
    { key: '⌘K / Ctrl+K', description: 'Abrir paleta de comandos y búsqueda' },
    { key: 'J / K', description: 'Navegar hacia abajo o arriba en la lista' },
    { key: 'Enter', description: 'Abrir publicación en modo lectura o PiP' },
    { key: 'S', description: 'Sincronizar todos los feeds' },
    { key: 'R', description: 'Marcar todas las publicaciones como leídas' },
    { key: '2 / 3 / 4', description: 'Cambiar cantidad de columnas en el Grid' },
    { key: 'Esc', description: 'Cerrar cualquier ventana flotante o modal abierto' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fadeIn">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative w-full max-w-md bg-surface border border-subtle rounded-xl shadow-xl p-5 sm:p-6 z-10 text-primary transition-smooth">
        <div className="flex items-center justify-between pb-3 border-b border-subtle mb-4">
          <div className="flex items-center gap-2">
            <Keyboard className="w-4 h-4 text-accent" />
            <h3 className="font-semibold text-sm tracking-tight text-primary">
              Atajos de Teclado
            </h3>
          </div>
          <button onClick={onClose} className="p-1 text-muted hover:text-primary rounded-lg transition-smooth hover:bg-surface-elevated">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-1.5 text-xs">
          {shortcuts.map((s, idx) => (
            <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-surface-elevated/70 border border-subtle">
              <span className="text-secondary">{s.description}</span>
              <kbd className="kbd-tag font-semibold">
                {s.key}
              </kbd>
            </div>
          ))}
        </div>

        <div className="mt-5 pt-3 border-t border-subtle text-[11px] font-mono text-muted text-center">
          Navegación de precisión optimizada para teclado.
        </div>
      </div>
    </div>
  );
};
