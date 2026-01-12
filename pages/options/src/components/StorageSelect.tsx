import {
  Button,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectPortal,
  SelectTrigger,
  SelectValue,
} from '@sync-your-cookie/ui';
import { useRef, useState } from 'react';

import { CircleX, LoaderIcon, Plus } from 'lucide-react';
import { toast } from 'sonner';

export interface IOption {
  value: string;
  label: string;
  [key: string]: any;
}

interface StorageSelectProps extends React.ComponentProps<typeof Select> {
  options: IOption[];
  value: string;
  onAdd: (key: string) => void;
  onRemove: (key: string) => void;
}

export function StorageSelect(props: StorageSelectProps) {
  const { value, onRemove, options, onValueChange, ...rest } = props;
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  const handleAdd = async () => {
    if (loading) {
      return;
    }
    const newKey = inputValue.trim().replaceAll(/\s+/g, '');
    const exist = options.find(option => option.value === newKey);
    if (exist) {
      console.warn('Key already exists or is empty');
      toast.error('Key already exists');
      return;
    }
    try {
      setLoading(true);
      await props.onAdd(newKey);
      setInputValue('');
    } catch (error) {
      console.log('error', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveKey = async (option: IOption) => {
    // Handle removing a storage key
    console.log('Remove storage key', option);
    if (loading) {
      return;
    }
    try {
      setLoading(true);
      await onRemove(option.value);
    } catch (error) {
      console.log('error', error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div ref={containerRef}>
      <Select
        value={value}
        onValueChange={val => {
          if (val === value) {
            return;
          }
          onValueChange?.(val);
        }}
        {...rest}>
        <SelectTrigger className="w-[160px] scale-90 ">
          <SelectValue className="ml-[-8px]" placeholder="Select a Storage Key" />
        </SelectTrigger>
        <SelectPortal>
          <SelectContent onCloseAutoFocus={evt => evt.preventDefault()}>
            {options.map((item, index) => {
              return (
                <div key={item.value} className="relative group">
                  <SelectItem className=" w-full" value={item.value}>
                    <span className="cursor-pointer">{item.label}</span>
                  </SelectItem>
                  {options.length > 1 && item.value !== value ? (
                    <span
                      ref={containerRef}
                      onClick={e => handleRemoveKey(item)}
                      role="button"
                      tabIndex={index}
                      className="absolute top-2 invisible right-[6px] cursor-pointer group-hover:visible">
                      {loading ? <LoaderIcon className="animate-spin" size={18} /> : <CircleX size={18} />}
                    </span>
                  ) : null}
                </div>
              );
            })}

            <div className="flex mx-2 items-center mt-2 gap-2">
              <Input
                value={inputValue}
                onChange={event => {
                  setInputValue(event?.target.value.replaceAll(/\s+/g, ''));
                }}
                onKeyDown={e => {
                  if (e.key === 'Enter' && inputValue.replaceAll(/\s+/g, '')) {
                    e.preventDefault();
                    handleAdd();
                  }
                }}
                className="h-8 "
              />
              <Button
                disabled={!inputValue.replaceAll(/\s+/g, '') || loading}
                onClick={() => handleAdd()}
                className="ml-0 scale-90"
                size="sm"
                type="submit"
                variant="outline">
                <Plus size={18} />
                Add
              </Button>
            </div>
          </SelectContent>
        </SelectPortal>
      </Select>
    </div>
  );
}
