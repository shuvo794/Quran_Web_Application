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
    const audio = new Audio(url);
    audio.play();
  },
  stopAudio: () => set({ currentAudioUrl: null, activeAyahNumber: null, isPlaying: false }),
  setPlaying: (playing) => set({ isPlaying: playing }),
}));
