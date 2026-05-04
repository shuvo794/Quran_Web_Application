'use client';

import { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import SurahListSidebar from './SurahListSidebar';
import SettingsPanel from './SettingsPanel';
import AudioPlayer from './AudioPlayer';
import MobileBottomNav from './MobileBottomNav';
import { Surah } from '@/lib/api';
import { Menu, Search, Settings, Moon, Sun } from 'lucide-react';
import { useSettingsStore } from '@/store/settings';

interface Props {
  children: React.ReactNode;
  surahs: Surah[];
}

export default function ClientLayout({ children, surahs }: Props) {
  const [isSurahListOpen, setIsSurahListOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { theme, setTheme } = useSettingsStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--background)] text-[var(--foreground)] font-sans">
      <AudioPlayer />
      
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar onOpenSettings={() => setIsSettingsOpen(true)} />
      </div>
      
      <div className="flex-1 flex overflow-hidden relative">
        <SurahListSidebar 
          surahs={surahs} 
          isOpen={isSurahListOpen} 
          onClose={() => setIsSurahListOpen(false)} 
        />
        
        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto scrollbar-thin bg-[var(--background)] flex flex-col relative pb-16 lg:pb-0">
          
          {/* Header */}
          <header className="sticky top-0 z-30 bg-white dark:bg-[#1F1F1F] border-b border-[var(--border)] px-4 lg:px-8 h-16 shrink-0 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button onClick={() => setIsSurahListOpen(true)} className="p-2 text-gray-500 dark:text-white hover:text-brand-500 transition-colors">
                <Menu size={24} />
              </button>
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-lg lg:text-xl text-[var(--foreground)]">Quran Mazid</h1>
              </div>
            </div>
            
            <div className="flex items-center gap-2 sm:gap-3">
              <button className="p-2.5 text-gray-400 dark:text-gray-300 hover:text-brand-500 bg-gray-50 dark:bg-[#222] rounded-full transition-all" onClick={() => window.location.href='/search'}>
                <Search size={20} />
              </button>
              
              {mounted && (
                <button 
                  className="p-2.5 text-gray-400 dark:text-gray-300 hover:text-brand-500 bg-gray-50 dark:bg-[#222] rounded-full transition-all" 
                  onClick={toggleTheme}
                >
                  {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                </button>
              )}
              
              <button className="p-2.5 text-gray-400 dark:text-gray-300 hover:text-brand-500 bg-gray-50 dark:bg-[#222] rounded-full transition-all" onClick={() => setIsSettingsOpen(true)}>
                <Settings size={20} />
              </button>

              <button className="hidden sm:flex items-center gap-2 bg-[#2E7D32] hover:bg-[#256629] text-white px-5 py-2 rounded-full font-bold text-sm transition-all shadow-lg shadow-brand-500/10">
                Support Us
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="opacity-90">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
              </button>
            </div>
          </header>

          <div className="flex-1 p-4 lg:p-8">
            {children}
          </div>
        </main>
      </div>

      <MobileBottomNav />
      <SettingsPanel isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </div>
  );
}
