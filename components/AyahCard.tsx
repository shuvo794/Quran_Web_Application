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
              <p 
                className={`${arabicFont} leading-[2.5] text-right text-[var(--foreground)]`}
                style={{ fontSize: `${arabicFontSize}px` }}
                dir="rtl"
              >
                {ayah.words.map((word, idx) => (
                  <span key={word.id || idx} className="relative group cursor-pointer hover:text-brand-500 transition-colors inline-block mx-[0.15em]">
                    {word.charTypeName === 'end' ? (
                      <span className="text-brand-500 opacity-80 select-none text-[1.1em] font-normal mx-1">
                        {word.arabic}&#x06DD;
                      </span>
                    ) : (
                      <span>{word.arabic}</span>
                    )}
                    {word.translation && word.charTypeName === 'word' && (
                      <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-[#333333] text-white text-[15px] px-3 py-1.5 rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50 pointer-events-none shadow-lg font-inter tracking-wide font-medium">
                        {word.translation}
                        <span className="absolute top-full left-1/2 -translate-x-1/2 -mt-0.5 border-4 border-transparent border-t-[#333333]"></span>
                      </span>
                    )}
                  </span>
                ))}
              </p>
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

