import { useStorageSuspense } from '@sync-your-cookie/shared';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  DataTable,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Spinner,
  Switch,
} from '@sync-your-cookie/ui';
import { Ellipsis } from 'lucide-react';

import { cookieStorage, domainConfigStorage } from '@sync-your-cookie/storage';
import type { ColumnDef } from '@sync-your-cookie/ui';
import { useState } from 'react';

export type CookieItem = {
  id: string;
  domain: string;
  autoPush: boolean;
  autoPull: boolean;
};

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

const CookieTable = () => {
  const domainConfig = useStorageSuspense(domainConfigStorage);
  const cookieMap = useStorageSuspense(cookieStorage);
  const cookieList = [];
  for (const [key, value] of Object.entries(cookieMap?.domainCookieMap || {})) {
    const config = domainConfig.domainMap[key];
    cookieList.push({
      id: key,
      domain: key,
      list: value.cookies,
      autoPush: config?.autoPush ?? false,
      autoPull: config?.autoPull ?? false,
    });
  }
  console.log('cookieList', cookieList);
  const [loading, setLoading] = useState(false);

  const handleDelete = async (cookie: CookieItem) => {
    await cookieStorage.removeItem(cookie.domain);
  };

  const columns: ColumnDef<CookieItem>[] = [
    {
      accessorKey: 'domain',
      header: 'Domain',
      cell: ({ row, getValue }) => {
        const value = getValue<string>() || '';
        const randomIndex = row.index % randomBgColor.length;
        return (
          <a target="_blank" className="block w-[110%]" href={`http://${row.original.domain}`} rel="noreferrer">
            <p className="flex items-center">
              <Avatar className=" h-5 w-5 inline-block mr-2 rounded-full">
                <AvatarImage src={`https://${row.original.domain}/favicon.ico`} />
                <AvatarFallback
                  delayMs={500}
                  style={{
                    backgroundColor: randomBgColor[randomIndex],
                  }}
                  className=" text-white text-sm ">
                  {value?.slice(0, 1).toLocaleUpperCase()}
                </AvatarFallback>
              </Avatar>
              <p
                style={{
                  overflowWrap: 'anywhere',
                }}
                className=" underline min-w-[100px] ">
                {value}
              </p>
            </p>
          </a>
        );
      },
    },
    {
      accessorKey: 'autoPush',
      header: 'AutoPush',
      cell: record => {
        return (
          <p className="w-[60px]">
            <Switch
              className="scale-75"
              id={`autoPush-${record.row.original.domain}`}
              checked={record.row.original.autoPush}
              onCheckedChange={async () => {
                await domainConfigStorage.updateItem(record.row.original.domain, {
                  autoPush: !record.row.original.autoPush,
                });
              }}
            />
          </p>
        );
      },
    },
    {
      accessorKey: 'autoPull',
      header: 'AutoPull',
      cell: record => {
        return (
          <p className="w-[60px]">
            <Switch
              className="scale-75"
              id={`autoPull-${record.row.original.domain}`}
              checked={record.row.original.autoPull}
              onCheckedChange={async () => {
                await domainConfigStorage.updateItem(record.row.original.domain, {
                  autoPull: !record.row.original.autoPull,
                });
              }}
            />
          </p>
        );
      },
    },
    {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => {
        if (row) return null;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <Ellipsis className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              {/* <DropdownMenuItem onClick={() => navigator.clipboard.writeText(.id)}>
                Copy payment ID
              </DropdownMenuItem> */}
              <DropdownMenuSeparator />
              <DropdownMenuItem>View customer</DropdownMenuItem>
              <DropdownMenuItem>View payment details</DropdownMenuItem>
              <DropdownMenuSeparator />
              {/* <DropdownMenuItem className="cursor-pointer" onClick={() => handleDelete(row.original)}>
                Delete
              </DropdownMenuItem> */}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
  return (
    <div>
      <div className="space-y-4 p-4 ">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Welcome back!</h2>
          <p className="text-muted-foreground text-sm">Here&apos;s a list of your pushed cookies </p>
        </div>
      </div>
      <Spinner show={loading}>
        <DataTable columns={columns} data={cookieList} />
      </Spinner>
    </div>
  );
};

export default CookieTable;
