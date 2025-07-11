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

import { CircleX, Plus } from 'lucide-react';
import { toast } from 'sonner';

interface StorageSelectProps extends React.ComponentProps<typeof Select> {
  options: string[]
  value: string
  onAdd: (key:string)=> void
  onRemove: (key: string) => void;
}

export function StorageSelect(props: StorageSelectProps) {
  const { value, onRemove, options, onValueChange, ...rest } = props;
  const [inputValue, setInputValue] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  const handleAdd = () => {
    const newKey = inputValue.trim().replaceAll(/\s+/g, '');
    if(options.includes(newKey)) {
      console.warn('Key already exists or is empty');
      toast.error('Key already exists');
      return;
    }
    props.onAdd(newKey);
    setInputValue('');
  }

  const handleRemoveKey = (key: string) => {
    // Handle removing a storage key
    console.log('Remove storage key', key);
    onRemove(key);
  };
  return (
    <div ref={containerRef}>
      <Select value={value} onValueChange={(val) => {
        if(val === value) {
          return;
        }
        onValueChange?.(val);

      }} {...rest}>
        <SelectTrigger className="w-[160px] scale-90 ">
          <SelectValue className="ml-[-8px]" placeholder="Select a Storage Key" />
        </SelectTrigger>
        <SelectPortal >
          <SelectContent onCloseAutoFocus={(evt) => evt.preventDefault()} >
            {
              options.map((item, index) => {
                return <div key={item} className='relative group'>
                  <SelectItem className=" w-full" value={item}>
                      <span className='cursor-pointer'>{item}</span>
                  </SelectItem>
                  {
                    options.length > 1 && item !== value ? <span
                      ref={containerRef}
                      onClick={(e) => handleRemoveKey(item)}
                      role="button"
                      tabIndex={index}
                      className="absolute top-2 invisible right-[6px] cursor-pointer group-hover:visible">
                      <CircleX size={18} />
                    </span> : null
                  }

                </div>
              })
            }

            <div className="flex mx-2 items-center mt-2 gap-2">
              <Input value={inputValue} onChange={(event)=> {setInputValue(event?.target.value.replaceAll(/\s+/g, ''))}} className="h-8 " />
              <Button disabled={!inputValue.replaceAll(/\s+/g, '')} onClick={()=> handleAdd()} className="ml-0 scale-90" size="sm" type="submit" variant="outline">
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
