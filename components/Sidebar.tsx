import Link from 'next/link';
import { Home, BookOpen, Send, Bookmark, LayoutGrid, Settings } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function Sidebar({ onOpenSettings }: { onOpenSettings?: () => void }) {
  const pathname = usePathname();
  
  return (
    <div className="w-[70px] h-screen flex flex-col items-center py-6 bg-[var(--surface)] border-r border-[var(--border)] shrink-0 z-50">
      <div className="flex flex-col gap-6 flex-1 w-full items-center">
        {/* Logo */}
        <Link href="/" className="p-3 mb-4 rounded-xl text-brand-500 bg-brand-50 dark:bg-brand-500/10" title="Quran Mazid">
          <BookOpen size={28} />
        </Link>
        
        <Link href="/" className={`p-3 rounded-xl hover:bg-brand-50 dark:hover:bg-[#2A2A2A] transition-colors ${pathname === '/' ? 'text-brand-500 bg-brand-50 dark:bg-[#2A2A2A]' : 'text-gray-500 dark:text-gray-400 hover:text-brand-500'}`} title="Home">
          <Home size={22} />
        </Link>
        <Link href="/surah/1" className={`p-3 rounded-xl hover:bg-brand-50 dark:hover:bg-[#2A2A2A] transition-colors ${pathname.includes('/surah') ? 'text-brand-500 bg-brand-50 dark:bg-[#2A2A2A]' : 'text-gray-500 dark:text-gray-400 hover:text-brand-500'}`} title="Read Quran">
          <BookOpen size={22} />
        </Link>
        <button className="p-3 rounded-xl hover:bg-brand-50 dark:hover:bg-[#2A2A2A] transition-colors text-gray-500 dark:text-gray-400 hover:text-brand-500" title="Messages">
          <Send size={22} />
        </button>
        <button className="p-3 rounded-xl hover:bg-brand-50 dark:hover:bg-[#2A2A2A] transition-colors text-gray-500 dark:text-gray-400 hover:text-brand-500" title="Bookmarks">
          <Bookmark size={22} />
        </button>
        <button className="p-3 rounded-xl hover:bg-brand-50 dark:hover:bg-[#2A2A2A] transition-colors text-gray-500 dark:text-gray-400 hover:text-brand-500" title="Apps">
          <LayoutGrid size={22} />
        </button>
      </div>
      <div className="mt-auto">
        <button 
          onClick={onOpenSettings} 
          className="p-3 rounded-xl hover:bg-brand-50 dark:hover:bg-[#2A2A2A] transition-colors text-gray-500 dark:text-gray-400 hover:text-brand-500" 
          title="Settings"
        >
          <Settings size={22} />
        </button>
      </div>
    </div>
  );
}

