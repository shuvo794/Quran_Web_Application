'use client';

import Link from 'next/link';
import { Home, BookOpen, Bookmark, LayoutGrid } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-white dark:bg-[#1F1F1F] border-t border-[var(--border)] flex items-center justify-around z-50">
      <Link 
        href="/" 
        className={`flex flex-col items-center gap-1 ${pathname === '/' ? 'text-brand-500' : 'text-gray-500 dark:text-gray-400'}`}
      >
        <LayoutGrid size={24} />
      </Link>
      
      <Link 
        href="/juz/1" 
        className={`flex flex-col items-center gap-1 ${pathname.includes('/juz') ? 'text-brand-500' : 'text-gray-500 dark:text-gray-400'}`}
      >
        <div className="relative">
          <SendIcon className="w-6 h-6 rotate-[-45deg]" />
        </div>
      </Link>
      
      <Link 
        href="/bookmarks" 
        className={`flex flex-col items-center gap-1 ${pathname === '/bookmarks' ? 'text-brand-500' : 'text-gray-500 dark:text-gray-400'}`}
      >
        <Bookmark size={24} />
      </Link>
      
      <button 
        className="flex flex-col items-center gap-1 text-gray-500 dark:text-gray-400"
      >
        <LayoutGrid size={24} />
      </button>
    </div>
  );
}

function SendIcon({ className }: { className?: string }) {
  return (
    <svg 
      className={className} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <line x1="22" y1="2" x2="11" y2="13"></line>
      <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
    </svg>
  );
}
