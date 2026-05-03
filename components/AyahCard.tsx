'use client';

import { Ayah } from '@/lib/api';
import { useSettingsStore } from '@/store/settings';
import { useAudioStore } from '@/store/audio';
import { Play, Pause } from 'lucide-react';
import { useEffect, useRef } from 'react';

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
    <div className={`p-6 border-b border-[var(--border)] hover:bg-[var(--surface)]/50 transition-colors ${isThisPlaying ? 'bg-brand-500/10' : ''}`}>
      <div className="flex justify-between items-start mb-6 gap-6">
        <div className="flex items-center gap-4 shrink-0">
          <div className="w-12 h-12 rounded-full border-2 border-brand-500 text-brand-500 flex items-center justify-center font-bold text-lg bg-[var(--surface)]">
            {ayah.number}
          </div>
          <button 
            onClick={() => isThisPlaying ? stopAudio() : playAudio(audioUrl, ayah.number)}
            className="w-10 h-10 rounded-full bg-brand-500 text-white flex items-center justify-center hover:bg-brand-600 transition-colors shadow-lg"
            title="Play Audio"
          >
            {isThisPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-1" />}
          </button>
        </div>
        
        <div className="flex-1 text-right">
          <p 
            className={`${arabicFont} leading-relaxed text-right`} 
            style={{ fontSize: `${arabicFontSize}px`, lineHeight: 2 }}
            dir="rtl"
          >
            {ayah.arabic}
          </p>
        </div>
      </div>
      
      <div className="mt-6 border-t border-[var(--border)] pt-4">
        <p 
          className="text-gray-300 font-inter leading-relaxed" 
          style={{ fontSize: `${translationFontSize}px` }}
        >
          {ayah.translation}
        </p>
      </div>
    </div>
  );
}
