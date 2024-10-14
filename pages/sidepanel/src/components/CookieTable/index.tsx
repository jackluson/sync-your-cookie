import { removeCookies, useStorageSuspense } from '@sync-your-cookie/shared';
import {
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

import Favicon from '@src/components/Favicon';
import { cookieStorage, domainConfigStorage } from '@sync-your-cookie/storage';
import type { ColumnDef } from '@sync-your-cookie/ui';
import { useState } from 'react';

export type CookieItem = {
  id: string;
  domain: string;
  autoPush: boolean;
  autoPull: boolean;
};

const CookieTable = () => {
  const domainConfig = useStorageSuspense(domainConfigStorage);
  const cookieMap = useStorageSuspense(cookieStorage);
  let cookieList = [];
  for (const [key, value] of Object.entries(cookieMap?.domainCookieMap || {})) {
    const config = domainConfig.domainMap[key];
    cookieList.push({
      id: key,
      domain: key,
      list: value.cookies,
      autoPush: config?.autoPush ?? false,
      autoPull: config?.autoPull ?? false,
      createTime: value.createTime,
    });
  }
  console.log('cookieList', cookieList);
  cookieList = cookieList.sort((a, b) => {
    return b.createTime - a.createTime;
  });

  const [loading, setLoading] = useState(false);

  const handleDelete = async (cookie: CookieItem) => {
    try {
      setLoading(true);
      await removeCookies(cookie.domain);
      await domainConfigStorage.removeItem(cookie.domain);
    } finally {
      setLoading(false);
    }
  };

  const columns: ColumnDef<CookieItem>[] = [
    {
      accessorKey: 'domain',
      header: 'Domain',
      cell: ({ row, getValue }) => {
        const value = getValue<string>() || '';
        return (
          <a
            key={row.original.domain}
            target="_blank"
            className="block w-[110%]"
            href={`http://${row.original.domain}`}
            rel="noreferrer">
            <div className="flex items-center">
              <Favicon key={row.original.domain} index={row.index} domain={row.original.domain} value={value} />
              <p
                style={{
                  overflowWrap: 'anywhere',
                }}
                className=" underline min-w-[100px] ">
                {value}
              </p>
            </div>
          </a>
        );
      },
      id: 'domain',
    },
    {
      accessorKey: 'autoPush',
      header: 'AutoPush',
      id: 'autoPush',
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
      id: 'autoPull',
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
              <DropdownMenuItem
                disabled={domainConfig.pushing}
                className="cursor-pointer"
                onClick={() => handleDelete(row.original)}>
                Delete
              </DropdownMenuItem>
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
