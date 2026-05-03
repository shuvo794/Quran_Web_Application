'use client';

import { useSettingsStore } from '@/store/settings';
import { Sun, Moon, X } from 'lucide-react';
import { useEffect, useState } from 'react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function SettingsPanel({ isOpen, onClose }: Props) {
  const { 
    theme, 
    setTheme, 
    arabicFont, 
    setArabicFont, 
    arabicFontSize, 
    setArabicFontSize,
    translationFontSize,
    setTranslationFontSize
  } = useSettingsStore();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />
      
      <div className="fixed right-0 top-0 h-full w-[380px] bg-[var(--surface)] shadow-2xl z-50 overflow-y-auto transform transition-transform duration-300">
        <div className="p-6 border-b border-[var(--border)] flex justify-between items-center sticky top-0 bg-[var(--surface)]/90 backdrop-blur-sm z-10">
          <h2 className="text-xl font-bold text-[var(--foreground)]">Settings</h2>
          <button onClick={onClose} className="p-2 text-gray-500 hover:text-[var(--foreground)] hover:bg-[var(--border)] rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-10">
          
          {/* Appearance Section */}
          <section>
            <h3 className="text-sm font-bold uppercase text-gray-400 tracking-wider mb-4 flex items-center gap-2">
              <Sun size={16} /> Appearance
            </h3>
            
            {mounted && (
              <div className="flex bg-[var(--border)] rounded-xl p-1 relative shadow-inner">
                <button 
                  onClick={() => setTheme('light')}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 z-10 flex items-center justify-center gap-2 ${theme === 'light' ? 'text-gray-900 bg-white shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  <Sun size={16} /> Light
                </button>
                <button 
                  onClick={() => setTheme('dark')}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 z-10 flex items-center justify-center gap-2 ${theme === 'dark' ? 'text-white bg-[#2A2A2A] shadow-sm' : 'text-gray-500 hover:text-gray-300'}`}
                >
                  <Moon size={16} /> Dark
                </button>
              </div>
            )}
          </section>

          {/* Arabic Font Select */}
          <div>
            <label className="block text-sm font-semibold mb-3 text-gray-500 dark:text-gray-300">Arabic Font</label>
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
              <label className="text-sm font-semibold text-gray-500 dark:text-gray-300">Arabic Font Size</label>
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
              <label className="text-sm font-semibold text-gray-500 dark:text-gray-300">Translation Size</label>
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
