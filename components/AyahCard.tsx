"use client";

import { memo } from "react";
import { Ayah } from "@/lib/api";
import { useSettingsStore } from "@/store/settings";
import { useAudioStore } from "@/store/audio";
import { Play, Pause, BookOpen, Bookmark, MoreHorizontal } from "lucide-react";

interface Props {
  ayah: Ayah;
  surahId: number;
}

export default memo(function AyahCard({ ayah, surahId }: Props) {
  const arabicFont = useSettingsStore(state => state.arabicFont);
  const arabicFontSize = useSettingsStore(state => state.arabicFontSize);
  const translationFontSize = useSettingsStore(state => state.translationFontSize);
  
  const currentAudioUrl = useAudioStore(state => state.currentAudioUrl);
  const isPlaying = useAudioStore(state => state.isPlaying);
  const playAudio = useAudioStore(state => state.playAudio);
  const stopAudio = useAudioStore(state => state.stopAudio);
  const playWordAudio = useAudioStore(state => state.playWordAudio);

  const audioUrl = ayah.audio;
  const isThisPlaying = currentAudioUrl === audioUrl && isPlaying;

  return (
    <div
      className={`p-6 md:p-10 mb-6 md:mb-10 rounded-2xl bg-[var(--surface)] shadow-[0_4px_20px_-12px_rgba(0,0,0,0.05)] border border-[var(--border)] transition-all duration-300 flex gap-6 md:gap-10 ${isThisPlaying ? "ring-2 ring-[#2E7D32]" : ""}`}
    >
      {/* Left Sidebar Column (Verse Info & Actions) */}
      <div className="flex flex-col items-center gap-8 pt-2 shrink-0">
        <div className="text-[#2E7D32] font-bold text-sm md:text-base tracking-tight whitespace-nowrap">
          {surahId}:{ayah.number}
        </div>
        
        <div className="flex flex-col items-center gap-8">
          <button
            onClick={() =>
              isThisPlaying ? stopAudio() : playAudio(audioUrl, ayah.number)
            }
            className="text-gray-400 hover:text-[#2E7D32] transition-colors"
            title="Play Audio"
          >
            {isThisPlaying ? (
              <Pause size={20} fill="currentColor" />
            ) : (
              <Play size={20} fill="currentColor" />
            )}
          </button>
          
          <button className="text-gray-400 hover:text-[#2E7D32] transition-colors">
            <BookOpen size={20} />
          </button>

          <button className="text-gray-400 hover:text-[#2E7D32] transition-colors">
            <Bookmark size={20} />
          </button>
          
          <button className="text-gray-400 hover:text-[#2E7D32] transition-colors">
            <MoreHorizontal size={20} />
          </button>
        </div>
      </div>

      {/* Main Content Area (Arabic & Translation) */}
      <div className="flex-1 min-w-0">
        {/* Arabic Text */}
        <div 
          className="mb-8 md:mb-12 cursor-pointer group/ayah"
          onClick={() => isThisPlaying ? stopAudio() : playAudio(audioUrl, ayah.number)}
        >
          {ayah.words && ayah.words.length > 0 ? (
            <p
              className={`${arabicFont} leading-[2.8] md:leading-[3.2] text-right text-[var(--foreground)] group-hover/ayah:text-[#2E7D32] transition-colors duration-300`}
              style={{ fontSize: `${arabicFontSize}px` }}
              dir="rtl"
            >
              {ayah.words.map((word, idx) => {
                const wordAudioUrl = word.charTypeName === "word"
                  ? `https://audio.qurancdn.com/wbw/${String(surahId).padStart(3, '0')}_${String(ayah.number).padStart(3, '0')}_${String(word.position).padStart(3, '0')}.mp3`
                  : null;

                return (
                  <span
                    key={word.id || idx}
                    className="relative group cursor-pointer inline-block mx-[0.1em]"
                    onClick={(e) => {
                      if (wordAudioUrl && word.charTypeName === "word") {
                        e.stopPropagation();
                        playWordAudio(wordAudioUrl);
                      }
                    }}
                  >
                    {word.charTypeName === "end" ? (
                      <span className="relative inline-flex items-center justify-center w-[1.2em] h-[1.2em] mx-2 text-gray-400 dark:text-gray-300 select-none align-middle translate-y-[0.1em]">
                        <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full opacity-60 dark:opacity-40" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="50" cy="50" r="44" />
                          <circle cx="50" cy="50" r="36" strokeWidth="1" />
                          <path d="M50 2 C54 2 56 6 50 12 C44 6 46 2 50 2 Z" fill="currentColor" stroke="none" />
                          <path d="M50 98 C54 98 56 94 50 88 C44 94 46 98 50 98 Z" fill="currentColor" stroke="none" />
                          <path d="M2 50 C2 46 6 44 12 50 C6 56 2 54 2 50 Z" fill="currentColor" stroke="none" />
                          <path d="M98 50 C98 46 94 44 88 50 C94 56 98 54 98 50 Z" fill="currentColor" stroke="none" />
                        </svg>
                        <span className="relative z-10 font-bold text-[#2E7D32] dark:text-[#4CAF50]" style={{ fontSize: '0.45em', fontFamily: 'var(--font-amiri)' }}>
                          {word.arabic}
                        </span>
                      </span>
                    ) : (
                      <span className="hover:text-[#2E7D32] transition-colors">{word.arabic}</span>
                    )}
                    {word.translation && word.charTypeName === "word" && (
                      <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-[#333333] text-white text-[12px] px-2 py-1 rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50 pointer-events-none">
                        {word.translation}
                      </span>
                    )}
                  </span>
                );
              })}
            </p>
          ) : (
            <p
              className={`${arabicFont} leading-loose text-right text-[var(--foreground)] transition-colors`}
              style={{ fontSize: `${arabicFontSize}px` }}
              dir="rtl"
            >
              {ayah.arabic}
            </p>
          )}
        </div>

        {/* Translation */}
        <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800/30">
          <p className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3 font-bold">
            SAHEEH INTERNATIONAL
          </p>
          <p
            className="text-[var(--foreground)] font-inter leading-relaxed font-normal"
            style={{ fontSize: `${translationFontSize}px` }}
          >
            {ayah.translation}
          </p>
        </div>
      </div>
    </div>
  );
});
