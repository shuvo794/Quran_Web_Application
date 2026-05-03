import { create } from 'zustand';

interface AudioState {
  currentAudioUrl: string | null;
  isPlaying: boolean;
  activeAyahNumber: number | null;
  playAudio: (url: string, ayahNumber: number) => void;
  playWordAudio: (url: string) => void;
  stopAudio: () => void;
  setPlaying: (playing: boolean) => void;
}

export const useAudioStore = create<AudioState>((set) => ({
  currentAudioUrl: null,
  isPlaying: false,
  activeAyahNumber: null,
  playAudio: (url, ayahNumber) => set({ currentAudioUrl: url, activeAyahNumber: ayahNumber, isPlaying: true }),
  playWordAudio: (url) => {
    try {
      // Ensure the URL is always absolute - relative paths break in browser
      const absoluteUrl = url.startsWith('http')
        ? url
        : `https://audio.qurancdn.com/${url}`;
      const audio = new Audio(absoluteUrl);
      audio.onerror = (e) => console.warn('Word audio unavailable:', absoluteUrl);
      audio.play().catch(e => console.warn('Word audio play failed:', e));
    } catch (err) {
      console.warn('Word audio error:', err);
    }
  },
  stopAudio: () => set({ currentAudioUrl: null, activeAyahNumber: null, isPlaying: false }),
  setPlaying: (playing) => set({ isPlaying: playing }),
}));
