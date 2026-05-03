'use client';

import { useEffect, useRef } from 'react';
import { useAudioStore } from '@/store/audio';

export default function AudioPlayer() {
  const { currentAudioUrl, isPlaying, setPlaying, stopAudio } = useAudioStore();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.addEventListener('ended', () => {
        stopAudio();
      });
      audioRef.current.addEventListener('pause', () => {
        setPlaying(false);
      });
      audioRef.current.addEventListener('play', () => {
        setPlaying(true);
      });
    }

    if (currentAudioUrl) {
      // If a new audio is selected
      if (audioRef.current.src !== currentAudioUrl) {
        audioRef.current.src = currentAudioUrl;
        audioRef.current.play().catch(console.error);
      } else {
        // If same audio, toggle play/pause
        if (isPlaying) {
          audioRef.current.play().catch(console.error);
        } else {
          audioRef.current.pause();
        }
      }
    } else {
      audioRef.current.pause();
      audioRef.current.src = '';
    }
  }, [currentAudioUrl, isPlaying, setPlaying, stopAudio]);

  return null; // This is a logic-only component that handles the global audio instance
}
