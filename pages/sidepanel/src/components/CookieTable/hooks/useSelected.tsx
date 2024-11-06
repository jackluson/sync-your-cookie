import { Cookie } from '@sync-your-cookie/storage/lib/cookieStorage';
import type { ColumnDef } from '@sync-your-cookie/ui';
import { useState } from 'react';

export type CookieShowItem = {
  id: string;
  domain: string;
  name: string;
  value: string;
};

export const useSelected = (cookieMap: Cookie) => {
  const [selectedDomain, setSelectedDomain] = useState('');
  const showCookiesColumns: ColumnDef<CookieShowItem>[] = [
    {
      id: 'Name',
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => {
        return (
          <div>
            <p
              style={{
                overflowWrap: 'anywhere',
              }}
              className=" min-w-[100px] ">
              {row.original.name}
            </p>
          </div>
        );
      },
    },
    {
      id: 'Value',
      accessorKey: 'value',
      header: 'Value',
      cell: ({ row }) => {
        return (
          <div>
            <p
              style={{
                overflowWrap: 'anywhere',
              }}
              className=" min-w-[100px] ">
              {row.original.value}
            </p>
          </div>
        );
      },
    },
  ];

  const cookieList =
    cookieMap.domainCookieMap?.[selectedDomain]?.cookies?.map((item, index) => {
      return {
        id: item.name + '_' + index,
        domain: item.domain ?? '',
        name: item.name ?? '',
        value: item.value ?? '',
      };
    }) || [];
  return {
    selectedDomain,
    showCookiesColumns,
    setSelectedDomain,
    cookieList,
  };
};
