'use client';

import { useState } from 'react';
import Sidebar from './Sidebar';
import SurahListSidebar from './SurahListSidebar';
import SettingsPanel from './SettingsPanel';
import AudioPlayer from './AudioPlayer';
import { Surah } from '@/lib/api';
import { Menu } from 'lucide-react';

interface Props {
  children: React.ReactNode;
  surahs: Surah[];
}

export default function ClientLayout({ children, surahs }: Props) {
  const [isSurahListOpen, setIsSurahListOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--background)] text-[var(--foreground)] font-sans">
      <AudioPlayer />
      <Sidebar onOpenSettings={() => setIsSettingsOpen(true)} />
      
      <div className="flex-1 flex overflow-hidden relative">
        {/* Mobile Header for hamburger */}
        <div className="lg:hidden absolute top-0 left-0 w-full h-16 bg-[var(--surface)] border-b border-[var(--border)] flex items-center px-4 z-30">
          <button onClick={() => setIsSurahListOpen(true)} className="p-2">
            <Menu size={24} />
          </button>
          <h1 className="ml-4 font-bold text-lg text-brand-500">Quran App</h1>
        </div>

        {/* This will either be a static sidebar on lg, or fixed drawer on mobile */}
        <SurahListSidebar 
          surahs={surahs} 
          isOpen={isSurahListOpen} 
          onClose={() => setIsSurahListOpen(false)} 
        />
        
        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto lg:pt-0 pt-16 scrollbar-thin">
          {children}
        </main>
      </div>

      <SettingsPanel isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </div>
  );
}
