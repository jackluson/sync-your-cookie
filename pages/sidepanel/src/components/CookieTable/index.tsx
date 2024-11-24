/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useStorageSuspense } from '@sync-your-cookie/shared';
import {
  Button,
  DataTable,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Image,
  Spinner,
  Switch,
} from '@sync-your-cookie/ui';
import {
  ArrowUpRight,
  ChevronLeft,
  ClipboardList,
  CloudDownload,
  CloudUpload,
  Copy,
  Ellipsis,
  RotateCw,
  Table as TableIcon,
  Trash,
} from 'lucide-react';

import { cookieStorage } from '@sync-your-cookie/storage/lib/cookieStorage';
import { domainConfigStorage } from '@sync-your-cookie/storage/lib/domainConfigStorage';
import type { ColumnDef } from '@sync-your-cookie/ui';
import { useAction } from './hooks/useAction';
import { SearchInput } from './SearchInput';
export type CookieItem = {
  id: string;
  host: string;
  sourceUrl?: string;
  favIconUrl?: string;
  autoPush: boolean;
  autoPull: boolean;
};

const CookieTable = () => {
  const domainConfig = useStorageSuspense(domainConfigStorage);
  const cookieMap = useStorageSuspense(cookieStorage);

  const {
    showCookiesColumns,
    cookieList,
    handleBack,
    setSelectedDomain,
    selectedDomain,
    loading,
    cookieAction,
    handleDelete,
    handlePush,
    handlePull,
    handleCopy,
    handleViewCookies,
    handleSearch,
    currentSearchStr,
  } = useAction(cookieMap);
  let domainList = [];
  let totalCookieItem = 0;
  for (const [key, value] of Object.entries(cookieMap?.domainCookieMap || {})) {
    const config = domainConfig.domainMap[key];
    if (!selectedDomain && currentSearchStr.trim() && !key.includes(currentSearchStr.trim())) continue;
    if (value.cookies?.length) {
      totalCookieItem += value.cookies.length;
    }
    domainList.push({
      id: key,
      host: key,
      sourceUrl: config.sourceUrl,
      favIconUrl: config.favIconUrl,
      list: value.cookies,
      autoPush: config?.autoPush ?? false,
      autoPull: config?.autoPull ?? false,
      createTime: value.createTime,
    });
  }
  domainList = domainList.sort((a, b) => {
    return b.createTime - a.createTime;
  });

  const columns: ColumnDef<CookieItem>[] = [
    {
      accessorKey: 'host',
      header: 'Host',
      cell: ({ row, getValue }) => {
        const value = getValue<string>() || '';
        const sourceUrl = row.original.sourceUrl;
        const protocol = sourceUrl ? new URL(sourceUrl).protocol : 'https:';
        const href = `${protocol}//${row.original.host}`;
        const src = row.original.favIconUrl ?? `https://${row.original.host}/favicon.ico`;
        return (
          <div className="relative group/item ">
            <div className="block w-[100%] h-[120%] ">
              <div className="flex items-center">
                <div
                  role="button"
                  className="flex items-center justify-center cursor-pointer "
                  tabIndex={0}
                  onClick={() => {
                    setSelectedDomain(value);
                  }}>
                  <Image key={row.original.host} index={row.index} src={src} value={value} />
                  <p
                    style={{
                      overflowWrap: 'anywhere',
                    }}
                    className=" cursor-pointer hover:underline min-w-[100px] ">
                    {value}
                  </p>
                </div>
                <a
                  key={row.original.host}
                  target="_blank"
                  title={href}
                  className="block ml-4 "
                  href={href}
                  onClick={evt => {
                    // evt.preventDefault();
                    evt.stopPropagation();
                  }}
                  rel="noreferrer">
                  <Button variant="ghost" className="text-sm ">
                    <ArrowUpRight className="invisible group-hover/item:visible h-4 w-4 hover:inline cursor-pointer " />
                  </Button>
                </a>
              </div>
            </div>
          </div>
        );
      },
      id: 'host',
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
              id={`autoPush-${record.row.original.host}`}
              checked={record.row.original.autoPush}
              onCheckedChange={async () => {
                await domainConfigStorage.updateItem(record.row.original.host, {
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
              id={`autoPull-${record.row.original.host}`}
              checked={record.row.original.autoPull}
              onCheckedChange={async () => {
                await domainConfigStorage.updateItem(record.row.original.host, {
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
        const itemConfig = cookieAction.getDomainItemConfig(row.original.host);
        const sourceUrl = row.original.sourceUrl;
        const protocol = sourceUrl ? new URL(sourceUrl).protocol : 'http:';
        const href = `${protocol}//${row.original.host}`;
        const disabled = itemConfig.pushing || cookieAction.pushing;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <Ellipsis className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Cookie Actions</DropdownMenuLabel>
              {/* <DropdownMenuItem onClick={() => navigator.clipboard.writeText(.id)}>
                Copy payment ID
              </DropdownMenuItem> */}
              <DropdownMenuSeparator />

              <DropdownMenuItem
                className="cursor-pointer"
                disabled={disabled}
                onClick={() => {
                  handlePush(row.original);
                }}>
                {itemConfig.pushing ? (
                  <RotateCw size={16} className=" h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <CloudUpload size={16} className="mr-2 h-4 w-4" />
                )}
                Push
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer"
                disabled={itemConfig.pulling}
                onClick={() => {
                  handlePull(href, row.original);
                }}>
                {itemConfig.pulling ? (
                  <RotateCw size={16} className=" h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <CloudDownload size={16} className="mr-2 h-4 w-4" />
                )}
                Pull
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => {
                  handleViewCookies(row.original.host);
                }}>
                <TableIcon size={16} className="mr-2 h-4 w-4" />
                View
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => {
                  handleCopy(row.original.host);
                }}>
                <Copy size={16} className="mr-2 h-4 w-4" />
                Copy
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => {
                  handleCopy(row.original.host, true);
                }}>
                <ClipboardList size={16} className="mr-2 h-4 w-4" />
                Copy With JSON
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                disabled={domainConfig.pushing}
                className="cursor-pointer"
                onClick={() => handleDelete(row.original)}>
                {itemConfig.pulling ? (
                  <RotateCw size={16} className=" h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Trash size={16} className="mr-2 h-4 w-4" />
                )}
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
  const selectedRow = domainConfig.domainMap[selectedDomain];
  const sourceUrl = selectedRow?.sourceUrl;
  const protocol = sourceUrl ? new URL(sourceUrl).protocol : 'https:';
  const href = `${protocol}//${selectedDomain}`;
  return (
    <div className="h-screen flex flex-col">
      <div className="space-y-4 p-4 ">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Welcome back!</h2>
          <p className="text-muted-foreground text-sm">Here&apos;s a list of your pushed cookies </p>
        </div>
      </div>
      <div className="h-0 flex-1 overflow-auto">
        <Spinner show={loading}>
          {selectedDomain ? (
            <>
              <div className="flex flex-col h-full ">
                <div className="flex items-center px-4 mb-4 ">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-7 w-7 mr-2"
                    onClick={() => {
                      handleBack();
                    }}>
                    <ChevronLeft className="h-4 w-4" />
                    <span className="sr-only">Back</span>
                  </Button>
                  <a
                    href={href}
                    target="_blank"
                    className=" flex text-xl items-center font-semibold hover:underline "
                    rel="noreferrer">
                    {selectedRow?.favIconUrl ? <Image src={selectedRow?.favIconUrl} /> : null}
                    {selectedDomain}
                  </a>
                </div>
                <div className="mb-1 px-4">
                  <SearchInput onEnter={handleSearch} />
                </div>
                <div className="flex-1 pl-4 pr-2 mt-4 overflow-auto">
                  <DataTable columns={showCookiesColumns} data={cookieList} />
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col h-full">
              <div>
                <div className=" mx-4 w-1/3 bg-primary/10 mb-4 rounded-xl border text-card-foreground shadow">
                  <div className="p-3">
                    <div className="flex flex-row items-center justify-between">
                      <p className="tracking-tight text-sm font-normal">Total Cookie</p>
                    </div>
                    <div className="">
                      <p className="text-2xl font-bold">
                        {domainList.length} <span className="text-xl">sites</span>
                      </p>
                      <p className="text-xs text-muted-foreground">{totalCookieItem} cookie items</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="px-4">
                <SearchInput onEnter={handleSearch} />
              </div>
              <div className="flex-1 overflow-auto my-4 pl-4 pr-1">
                <DataTable columns={columns} data={domainList} />
              </div>
            </div>
          )}
        </Spinner>
      </div>
    </div>
  );
};

export default CookieTable;
