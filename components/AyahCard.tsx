'use client';

import { Ayah } from '@/lib/api';
import { useSettingsStore } from '@/store/settings';
import { useAudioStore } from '@/store/audio';
import { Play, Pause, Copy, Bookmark, MoreHorizontal } from 'lucide-react';

interface Props {
  ayah: Ayah;
  surahId: number;
}

export default function AyahCard({ ayah, surahId }: Props) {
  const { arabicFont, arabicFontSize, translationFontSize } = useSettingsStore();
  const { currentAudioUrl, isPlaying, playAudio, stopAudio } = useAudioStore();
  
  const audioUrl = ayah.audio;
  const isThisPlaying = currentAudioUrl === audioUrl && isPlaying;

  return (
    <div className={`p-6 mb-4 rounded-xl bg-[var(--surface)] shadow-sm border border-[var(--border)] transition-colors ${isThisPlaying ? 'ring-2 ring-brand-500' : ''}`}>
      <div className="flex gap-6">
        
        {/* Left Action Column */}
        <div className="flex flex-col items-center gap-6 shrink-0 pt-2">
          <div className="text-brand-500 font-semibold text-sm">
            {surahId}:{ayah.number}
          </div>
          <button 
            onClick={() => isThisPlaying ? stopAudio() : playAudio(audioUrl, ayah.number)}
            className="text-gray-400 hover:text-brand-500 transition-colors"
            title="Play Audio"
          >
            {isThisPlaying ? <Pause size={22} fill="currentColor" /> : <Play size={22} />}
          </button>
          <button className="text-gray-400 hover:text-brand-500 transition-colors" title="Copy">
            <Copy size={20} />
          </button>
          <button className="text-gray-400 hover:text-brand-500 transition-colors" title="Bookmark">
            <Bookmark size={20} />
          </button>
          <button className="text-gray-400 hover:text-brand-500 transition-colors" title="More">
            <MoreHorizontal size={20} />
          </button>
        </div>
        
        {/* Main Content */}
        <div className="flex-1 min-w-0">
          <div className="mb-8">
            {ayah.words && ayah.words.length > 0 ? (
              <div 
                className={`${arabicFont} leading-loose text-right text-[var(--foreground)] flex flex-wrap justify-start items-center gap-x-2.5 gap-y-6`}
                style={{ fontSize: `${arabicFontSize}px` }}
                dir="rtl"
              >
                {ayah.words.map((word, idx) => (
                  <div key={word.id || idx} className="relative group cursor-pointer hover:text-brand-500 transition-colors">
                    {word.charTypeName === 'end' ? (
                      <span className="relative flex items-center justify-center w-[2.2em] h-[2.2em] mx-1.5 text-brand-500 opacity-90 select-none group-hover:text-brand-600 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className="absolute inset-0 w-full h-full" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <path d="M50 4 C 55 12, 75 14, 82 22 C 86 28, 96 35, 96 50 C 96 65, 86 72, 82 78 C 75 86, 55 88, 50 96 C 45 88, 25 86, 18 78 C 14 72, 4 65, 4 50 C 4 35, 14 28, 18 22 C 25 14, 45 12, 50 4 Z" strokeLinejoin="round" fill="currentColor" fillOpacity="0.05"/>
                          <circle cx="50" cy="50" r="30" strokeWidth="2" opacity="0.6"/>
                          <circle cx="50" cy="50" r="26" strokeWidth="1" opacity="0.3"/>
                        </svg>
                        <span className="relative z-10 font-bold" style={{ fontSize: '0.5em', transform: 'translateY(2%)' }}>
                          {word.arabic}
                        </span>
                      </span>
                    ) : (
                      <span>{word.arabic}</span>
                    )}
                    {word.translation && word.charTypeName === 'word' && (
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-[#333333] text-white text-[15px] px-3 py-1.5 rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50 pointer-events-none shadow-lg font-inter tracking-wide font-medium">
                        {word.translation}
                        {/* Tooltip triangle */}
                        <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-0.5 border-4 border-transparent border-t-[#333333]"></div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p 
                className={`${arabicFont} leading-loose text-right text-[var(--foreground)]`} 
                style={{ fontSize: `${arabicFontSize}px` }}
                dir="rtl"
              >
                {ayah.arabic}
              </p>
            )}
          </div>
          
          <div>
            <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-2 font-semibold">
              TRANSLATION
            </p>
            <p 
              className="text-[var(--foreground)] font-inter leading-relaxed" 
              style={{ fontSize: `${translationFontSize}px` }}
            >
              {ayah.translation}
            </p>
          </div>
        </div>
        
      </div>
    </div>
  );
}

