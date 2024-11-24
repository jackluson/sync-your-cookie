import { Input } from '@sync-your-cookie/ui';
import { Search, X } from 'lucide-react';
import { FC, useState } from 'react';

export interface SearchInputProps {
  onEnter?: (val: string) => void;
}

export const SearchInput: FC<SearchInputProps> = props => {
  const { onEnter } = props;
  const [searchVal, setSearchVal] = useState('');
  return (
    <div className="flex relative ">
      <Search size={18} className="absolute top-[11px] left-[10px]" />
      <Input
        value={searchVal}
        onChange={evt => {
          setSearchVal(evt.target.value);
        }}
        onBlur={() => {
          onEnter?.(searchVal.trim());
        }}
        onKeyDown={evt => {
          if (evt.key === 'Enter' || evt.code === 'Enter') {
            onEnter?.(searchVal.trim());
          }
        }}
        className="bg-gray-100 pl-[36px]"
        placeholder="Filter"
      />
      {searchVal && (
        <X
          onClick={() => {
            setSearchVal('');
            onEnter?.('');
          }}
          size={16}
          className="absolute top-[13px] right-[10px] cursor-pointer"
        />
      )}
    </div>
  );
};
