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
        <SurahListSidebar 
          surahs={surahs} 
          isOpen={isSurahListOpen} 
          onClose={() => setIsSurahListOpen(false)} 
        />
        
        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto scrollbar-thin bg-[var(--background)] flex flex-col relative">
          
          {/* Header */}
          <header className="sticky top-0 z-10 bg-white/80 dark:bg-[#1F1F1F]/80 backdrop-blur-md border-b border-[var(--border)] px-4 lg:px-8 h-16 shrink-0 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button onClick={() => setIsSurahListOpen(true)} className="p-2 lg:hidden text-gray-500 hover:text-brand-500">
                <Menu size={24} />
              </button>
              <div>
                <h1 className="font-bold text-lg text-[var(--foreground)] hidden sm:block">Quran Mazid</h1>
                <p className="text-[10px] text-gray-500 hidden sm:block">Read and understand</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 sm:gap-4">
              <button className="p-2 text-gray-500 hover:text-brand-500 transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-[#2A2A2A]" onClick={() => window.location.href='/search'} title="Search">
                <Search size={20} />
              </button>
              <button className="p-2 text-gray-500 hover:text-brand-500 transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-[#2A2A2A]" onClick={() => setIsSettingsOpen(true)} title="Settings">
                <Settings size={20} />
              </button>
              <button className="bg-brand-500 hover:bg-brand-600 text-white px-4 py-1.5 rounded-full text-sm font-semibold transition-colors shadow-sm whitespace-nowrap">
                Support Us
              </button>
            </div>
          </header>

          <div className="flex-1 p-4 lg:p-8">
            {children}
          </div>
        </main>
      </div>

      <SettingsPanel isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </div>
  );
}
