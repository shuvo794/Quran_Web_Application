"use client";

import { Ayah } from "@/lib/api";
import { useSettingsStore } from "@/store/settings";
import { useAudioStore } from "@/store/audio";
import { Play, Pause, BookOpen, Bookmark, MoreHorizontal } from "lucide-react";

interface Props {
  ayah: Ayah;
  surahId: number;
}

export default function AyahCard({ ayah, surahId }: Props) {
  const { arabicFont, arabicFontSize, translationFontSize } = useSettingsStore();
  const { currentAudioUrl, isPlaying, playAudio, stopAudio, playWordAudio } = useAudioStore();

  const audioUrl = ayah.audio;
  const isThisPlaying = currentAudioUrl === audioUrl && isPlaying;

  return (
    <div
      className={`p-10 mb-10 rounded-2xl bg-[var(--surface)] shadow-[0_10px_40px_-12px_rgba(0,0,0,0.05)] border border-[var(--border)] transition-all duration-300 ${isThisPlaying ? "ring-2 ring-[#2E7D32]" : ""}`}
    >
      <div className="flex gap-12">
        {/* Left Action Column */}
        <div className="flex flex-col items-center gap-8 shrink-0 pt-1">
          <div className="text-[#2E7D32] font-bold text-2xl tracking-tight">
            {surahId}:{ayah.number}
          </div>
          <div className="flex flex-col items-center gap-6 mt-4">
            <button
              onClick={() =>
                isThisPlaying ? stopAudio() : playAudio(audioUrl, ayah.number)
              }
              className="text-gray-300 hover:text-[#2E7D32] transition-colors"
              title="Play Audio"
            >
              {isThisPlaying ? (
                <Pause size={28} fill="currentColor" />
              ) : (
                <Play size={28} />
              )}
            </button>
            <button
              className="text-gray-300 hover:text-[#2E7D32] transition-colors"
              title="Read"
            >
              <BookOpen size={24} />
            </button>
            <button
              className="text-gray-300 hover:text-[#2E7D32] transition-colors"
              title="Bookmark"
            >
              <Bookmark size={24} />
            </button>
            <button
              className="text-gray-300 hover:text-[#2E7D32] transition-colors"
              title="More"
            >
              <MoreHorizontal size={24} />
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          <div 
            className="mb-14 cursor-pointer group/ayah"
            onClick={() => isThisPlaying ? stopAudio() : playAudio(audioUrl, ayah.number)}
            title="Click to play audio"
          >
            {ayah.words && ayah.words.length > 0 ? (
              <p
                className={`${arabicFont} leading-[2.8] text-right text-gray-800 dark:text-gray-100 group-hover/ayah:text-[#2E7D32] transition-colors duration-300`}
                style={{ fontSize: `${arabicFontSize}px` }}
                dir="rtl"
              >
                {ayah.words.map((word, idx) => {
                  // Build direct CDN URL from surahId:ayahNumber:position
                  // Format: https://audio.qurancdn.com/wbw/001_001_001.mp3
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
                      <span className="relative flex items-center justify-center w-[2.6em] h-[2.6em] mx-2 text-gray-500 select-none transition-all duration-300">
                        <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full opacity-80" fill="none" stroke="currentColor" strokeWidth="1.2">
                          <path d="M50 4C55 12 75 14 82 22C86 28 92 35 92 50C92 65 86 72 82 78C75 86 55 88 50 96C45 88 25 86 18 78C14 72 8 65 8 50C8 35 14 28 18 22C25 14 45 12 50 4Z" strokeLinejoin="round" />
                          <circle cx="50" cy="50" r="32" strokeWidth="1" />
                          <circle cx="50" cy="50" r="28" strokeWidth="0.5" opacity="0.5" />
                          <path d="M40 15Q50 20 60 15" strokeWidth="0.8" />
                          <path d="M40 85Q50 80 60 85" strokeWidth="0.8" />
                          <path d="M15 40Q20 50 15 60" strokeWidth="0.8" />
                          <path d="M85 40Q80 50 85 60" strokeWidth="0.8" />
                          <path d="M45 5C50 1 55 5" strokeWidth="1.5" />
                        </svg>
                        <span className="relative z-10 font-bold text-[#2E7D32] drop-shadow-sm" style={{ fontSize: '0.45em', transform: 'translateY(5%)' }}>
                          {word.arabic}
                        </span>
                      </span>
                    ) : (
                      <span className="hover:text-[#2E7D32] transition-colors">{word.arabic}</span>
                    )}
                    {word.translation && word.charTypeName === "word" && (
                      <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-[#333333] text-white text-[15px] px-3 py-1.5 rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50 pointer-events-none shadow-lg font-inter tracking-wide font-medium">
                        {word.translation}
                        <span className="absolute top-full left-1/2 -translate-x-1/2 -mt-0.5 border-4 border-transparent border-t-[#333333]"></span>
                      </span>
                    )}
                  </span>
                  );
                })}
              </p>
            ) : (
              <p
                className={`${arabicFont} leading-loose text-right text-gray-800 dark:text-gray-100 group-hover/ayah:text-[#2E7D32] transition-colors`}
                style={{ fontSize: `${arabicFontSize}px` }}
                dir="rtl"
              >
                {ayah.arabic}
              </p>
            )}
          </div>

          <div className="mt-10 pt-8 border-t border-gray-50 dark:border-gray-800/30">
            <p className="text-[11px] text-gray-400 uppercase tracking-[0.15em] mb-4 font-bold">
              SAHEEH INTERNATIONAL
            </p>
            <p
              className="text-gray-700 dark:text-gray-300 font-inter leading-relaxed text-xl font-normal opacity-90"
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
