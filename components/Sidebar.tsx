import Link from 'next/link';
import { Home, BookOpen, Search, Settings } from 'lucide-react';

export default function Sidebar({ onOpenSettings }: { onOpenSettings?: () => void }) {
  return (
    <div className="w-16 h-screen flex flex-col items-center py-6 bg-[var(--surface)] border-r border-[var(--border)] shrink-0 z-50">
      <div className="flex flex-col gap-8 flex-1 w-full items-center">
        <Link href="/" className="p-3 rounded-xl hover:bg-[var(--border)] transition-colors text-[var(--foreground)]" title="Home">
          <Home size={24} />
        </Link>
        <Link href="/surah/1" className="p-3 rounded-xl hover:bg-[var(--border)] transition-colors text-brand-500" title="Read Quran">
          <BookOpen size={24} />
        </Link>
        <button className="p-3 rounded-xl hover:bg-[var(--border)] transition-colors text-[var(--foreground)]" title="Search">
          <Search size={24} />
        </button>
      </div>
      <div className="mt-auto">
        <button 
          onClick={onOpenSettings} 
          className="p-3 rounded-xl hover:bg-[var(--border)] transition-colors text-[var(--foreground)]" 
          title="Settings"
        >
          <Settings size={24} />
        </button>
      </div>
    </div>
  );
}
