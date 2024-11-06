import { Avatar, AvatarFallback, AvatarImage } from '@sync-your-cookie/ui';
import React, { FC } from 'react';
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

interface FaviconProps {
  domain: string;
  value: string;
  index: number;
}

const Favicon: FC<FaviconProps> = ({ index, domain, value }) => {
  const randomIndex = index % randomBgColor.length;
  return (
    <div>
      <Avatar className=" h-5 w-5 inline-block mr-2 rounded-full">
        <AvatarImage src={`https://${domain}/favicon.ico`} />
        <AvatarFallback
          delayMs={500}
          style={{
            backgroundColor: randomBgColor[randomIndex],
          }}
          className=" text-white text-sm ">
          {value?.slice(0, 1).toLocaleUpperCase()}
        </AvatarFallback>
      </Avatar>
    </div>
  );
};

export default React.memo(Favicon);
