import { Input } from '@sync-your-cookie/ui';
import { Search } from 'lucide-react';
import { useEffect, useState } from 'react';

export const SearchInput = ({ onEnter }: { onEnter: (searchStr: string) => void }) => {
  const [searchStr, setSearchStr] = useState('');

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        onEnter(searchStr);
      }
    };
    document.addEventListener('keydown', handler);
    return () => {
      document.removeEventListener('keydown', handler);
    };
  }, [onEnter, searchStr]);

  return (
    <div className="relative">
      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder="Search localStorage by domain..."
        value={searchStr}
        onChange={e => setSearchStr(e.target.value)}
        className="pl-8"
      />
    </div>
  );
};