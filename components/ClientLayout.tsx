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
              <button onClick={() => setIsSurahListOpen(true)} className="p-2 text-gray-500 hover:text-brand-500 transition-colors">
                <Menu size={24} />
              </button>
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-lg lg:text-xl text-[var(--foreground)]">Quran Mazid</h1>
              </div>
            </div>
            
            <div className="flex items-center gap-1 sm:gap-4">
              <button className="p-2 text-gray-400 hover:text-brand-500 transition-colors rounded-full" onClick={() => window.location.href='/search'}>
                <Search size={22} />
              </button>
              
              {mounted && (
                <button 
                  className="p-2 text-gray-400 hover:text-brand-500 transition-colors rounded-full" 
                  onClick={toggleTheme}
                >
                  {theme === 'light' ? <Moon size={22} fill="currentColor" /> : <Sun size={22} fill="currentColor" />}
                </button>
              )}
              
              <button className="p-2 text-gray-400 hover:text-brand-500 transition-colors rounded-full" onClick={() => setIsSettingsOpen(true)}>
                <Settings size={22} fill="currentColor" />
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
