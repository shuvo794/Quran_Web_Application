'use client';

import { useSettingsStore } from '@/store/settings';
import { X } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function SettingsPanel({ isOpen, onClose }: Props) {
  const { arabicFont, arabicFontSize, translationFontSize, setArabicFont, setArabicFontSize, setTranslationFontSize } = useSettingsStore();

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50" onClick={onClose} />
      <div className="fixed right-0 top-0 h-screen w-80 bg-[var(--surface)] border-l border-[var(--border)] z-50 p-6 flex flex-col shadow-2xl animate-in slide-in-from-right">
        <div className="flex justify-between items-center mb-8 border-b border-[var(--border)] pb-4">
          <h2 className="text-xl font-bold">Settings</h2>
          <button onClick={onClose} className="p-2 hover:bg-[var(--border)] rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-8 flex-1 overflow-y-auto pr-2">
          {/* Arabic Font Select */}
          <div>
            <label className="block text-sm font-semibold mb-3 text-gray-300">Arabic Font</label>
            <div className="space-y-2">
              <label className="flex items-center gap-3 p-3 rounded-xl border border-[var(--border)] hover:border-brand-500 cursor-pointer transition-colors bg-[var(--background)]">
                <input 
                  type="radio" 
                  name="arabicFont" 
                  value="font-amiri" 
                  checked={arabicFont === 'font-amiri'}
                  onChange={() => setArabicFont('font-amiri')}
                  className="accent-brand-500"
                />
                <span className="font-amiri text-xl">Amiri Quran</span>
              </label>
              <label className="flex items-center gap-3 p-3 rounded-xl border border-[var(--border)] hover:border-brand-500 cursor-pointer transition-colors bg-[var(--background)]">
                <input 
                  type="radio" 
                  name="arabicFont" 
                  value="font-scheherazade" 
                  checked={arabicFont === 'font-scheherazade'}
                  onChange={() => setArabicFont('font-scheherazade')}
                  className="accent-brand-500"
                />
                <span className="font-scheherazade text-xl">Scheherazade New</span>
              </label>
            </div>
          </div>

          {/* Arabic Font Size */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <label className="text-sm font-semibold text-gray-300">Arabic Font Size</label>
              <span className="text-sm text-brand-500">{arabicFontSize}px</span>
            </div>
            <input 
              type="range" 
              min="24" max="64" step="2"
              value={arabicFontSize}
              onChange={(e) => setArabicFontSize(Number(e.target.value))}
              className="w-full accent-brand-500"
            />
          </div>

          {/* Translation Font Size */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <label className="text-sm font-semibold text-gray-300">Translation Size</label>
              <span className="text-sm text-brand-500">{translationFontSize}px</span>
            </div>
            <input 
              type="range" 
              min="12" max="32" step="1"
              value={translationFontSize}
              onChange={(e) => setTranslationFontSize(Number(e.target.value))}
              className="w-full accent-brand-500"
            />
          </div>
        </div>
      </div>
    </>
  );
}
