import { FC } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui';
const randomBgColor = [
  '#ec6a5e',
  '#f5bd4f',
  '#61c455',
  '#3a82f7',
  '#7246e4',
  '#bef653',
  '#e97a35',
  '#4c9f54',
  '#3266e3',
];

interface ImageProps {
  src: string;
  value?: string;
  index?: number;
}

export const Image: FC<ImageProps> = ({ index, src, value }) => {
  const randomIndex = typeof index === 'number' ? index % randomBgColor.length : 0;
  return (
    <div className="justify-center flex items-center " draggable={false}>
      <Avatar draggable={false} className=" h-5 w-5 inline-block mr-2 rounded-full">
        <AvatarImage draggable={false} src={src} />
        {value && typeof randomIndex === 'number' && (
          <AvatarFallback
            delayMs={500}
            draggable={false}
            style={{
              backgroundColor: randomBgColor[randomIndex],
            }}
            className=" text-white text-sm ">
            {value?.slice(0, 1).toLocaleUpperCase()}
          </AvatarFallback>
        )}
      </Avatar>
    </div>
  );
};
