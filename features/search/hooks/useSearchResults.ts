import { useState, useEffect } from 'react';

export interface SearchResult {
  id: string;
  title: string;
  type: 'song' | 'artist' | 'playlist';
  image?: string;
  description?: string;
}

const mockData: SearchResult[] = [
  { id: '1', title: 'Blinding Lights', type: 'song', description: 'The Weeknd' },
  { id: '2', title: 'As It Was', type: 'song', description: 'Harry Styles' },
  { id: '3', title: 'Heat Waves', type: 'song', description: 'Glass Animals' },
  { id: '4', title: 'The Weeknd', type: 'artist', description: 'Artist' },
  { id: '5', title: 'Harry Styles', type: 'artist', description: 'Artist' },
  { id: '6', title: 'Chill Vibes', type: 'playlist', description: 'Curated Playlist' },
  { id: '7', title: 'Summer Hits', type: 'playlist', description: 'Top Summer Songs' },
];

const useSearchResults = (query: string) => {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    
    // Simulate API call delay
    const timer = setTimeout(() => {
      const filtered = mockData.filter(item =>
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.description?.toLowerCase().includes(query.toLowerCase())
      );
      setResults(filtered);
      setLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  return { results, loading };
};

export default useSearchResults;
