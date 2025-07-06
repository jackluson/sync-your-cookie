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
import { useEffect, useRef } from 'react';

import { CircleX, Plus } from 'lucide-react';

interface StorageSelectProps extends React.ComponentProps<typeof Select> {
  options: string[]
  value: string
  onAdd: (key:string)=> void
}

export function StorageSelect(props: StorageSelectProps) {
  const { value, options } = props;
  console.log("options", options);
  const containerRef = useRef<HTMLDivElement>(null);
  const handleRemove = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    e.nativeEvent.preventDefault();
    e.nativeEvent.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    return false;
  };
  useEffect(() => {
    if (containerRef.current) {
      console.log("containerRef", containerRef);
      containerRef.current.addEventListener('click', (evt) => {
        console.log("evt", evt);
      })
    }
  }, [])
  return (
    <div ref={containerRef}>
      <Select onValueChange={(evt) => {
        console.log('evt', evt)
      }} {...props}>
        <SelectTrigger className="w-[160px] scale-90 ">
          <SelectValue className="ml-[-8px]" placeholder="Select a Storage Key" />
        </SelectTrigger>
        <SelectPortal >
          <SelectContent onCloseAutoFocus={(evt) => evt.preventDefault()} >
            {
              options.map((item) => {
                return <div key={item} className='relative group'>
                  <SelectItem className=" w-full" value={item}>
                      <span>{item}</span>
                  </SelectItem>
                  {
                    options.length > 1 ? <span
                      ref={containerRef}
                      onClick={(e) => handleRemove(e)}
                      role="button"
                      tabIndex={0}
                      className="absolute top-2 invisible right-[6px] cursor-pointer group-hover:visible">
                      <CircleX size={18} />
                    </span> : null
                  }

                </div>
              })
            }
            <SelectItem value="banana">Banana</SelectItem>


            <div className="flex mx-2 items-center mt-2 gap-2">
              <Input className="h-8 " />
              <Button className="ml-2" size="sm" type="submit" variant="outline">
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
