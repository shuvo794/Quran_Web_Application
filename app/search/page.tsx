'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search } from 'lucide-react';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    setLoading(true);
    try {
      const isArabic = /[\u0600-\u06FF]/.test(query);
      const lang = isArabic ? 'ar' : 'en';
      
      const res = await fetch(`https://api.alquran.cloud/v1/search/${encodeURIComponent(query)}/all/${lang}`);
      
      if (!res.ok) {
        throw new Error(`API returned ${res.status}: Too many results or server error.`);
      }

      const data = await res.json();
      
      if (data.code === 200) {
        setResults(data.data.matches);
      } else {
        setResults([]);
      }
    } catch (err: any) {
      console.error(err);
      alert('Search failed: ' + err.message);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8 pb-24">
      <h1 className="text-3xl font-bold mb-8">Search Quran</h1>
      
      <form onSubmit={handleSearch} className="relative mb-8">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for 'Abraham', 'Peace', or Arabic words..."
            className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-xl py-4 pl-12 pr-4 text-[var(--foreground)] placeholder-gray-500 focus:outline-none focus:border-brand-500 transition-colors"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
        </div>
        <button type="submit" className="mt-4 px-6 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition-colors">
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>
      
      <div className="space-y-4">
        {!loading && results.length > 0 && (
          <p className="text-gray-400 mb-4">Found {results.length} matches</p>
        )}
        
        {results.map((match, i) => (
          <Link href={`/surah/${match.surah.number}`} key={i} className="block p-4 bg-[var(--surface)] border border-[var(--border)] rounded-xl hover:border-brand-500 transition-colors">
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold text-brand-500">{match.surah.englishName}</span>
              <span className="text-sm text-gray-400">Ayah {match.numberInSurah}</span>
            </div>
            <p className="text-[var(--foreground)]" dir={match.edition.language === 'ar' ? 'rtl' : 'ltr'}>
              {match.text}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
