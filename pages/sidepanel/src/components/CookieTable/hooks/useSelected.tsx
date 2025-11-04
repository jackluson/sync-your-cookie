import { useStorageSuspense } from '@sync-your-cookie/shared';
import { Cookie } from '@sync-your-cookie/storage/lib/cookieStorage';
import { domainConfigStorage } from '@sync-your-cookie/storage/lib/domainConfigStorage';
import { domainStatusStorage } from '@sync-your-cookie/storage/lib/domainStatusStorage';

import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Input,
  Label,
  Popover,
  PopoverContent,
  PopoverTrigger,
  cn,
  type ColumnDef,
} from '@sync-your-cookie/ui';

import { Ellipsis, PencilLine, Trash2, Wrench } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { useCookieItem } from './useCookieItem';
export type CookieShowItem = {
  id: string;
  domain: string;
  name: string;
  value: string;
  expirationDate?: number | null;
  hostOnly?: boolean | null;
  httpOnly?: boolean | null;
  path?: string | null;
  sameSite?: string | null;
  secure?: boolean | null;
  session?: boolean | null;
  storeId?: string | null;
};

export type LocalStorageShowItem = {
  // id: string;
  key: string;
  value: string;
};

export const useSelected = (cookieMap: Cookie, currentSearchStr: string) => {
  const [selectedDomain, setSelectedDomain] = useState('');
  const domainStatus = useStorageSuspense(domainStatusStorage);

  const [selectedRow, setSelectedRow] = useState<Record<string, string> | null>(null);
  const inputRowRef = useRef<Partial<CookieShowItem>>({});
  const [selectedKey, setSelectedKey] = useState<string>('');
  const [hasLocalStorage, setHasLocalStorage] = useState(false);
  const [localStorageMode, setLocalStorageMode] = useState(false);
  const handleEdit = (key: string, row: Record<string, string>) => {
    setSelectedKey(key);
    setSelectedRow(row);
    inputRowRef.current = {
      ...row,
    };
  };
  const { loading, handleEditItem, handleDeleteItem } = useCookieItem(selectedDomain);

  const handleCancel = () => {
    setSelectedRow(null);
  };

  const handleSave = async (isSet: boolean = false) => {
    const prevSelectedRow = selectedRow;
    setSelectedRow(null);
    if (JSON.stringify(inputRowRef.current) !== JSON.stringify(prevSelectedRow)) {
      await handleEditItem(prevSelectedRow!, inputRowRef.current!);
    }
    if (isSet && inputRowRef.current) {
      await new Promise(resolve => setTimeout(resolve, 500));
      handleSet(inputRowRef.current as CookieShowItem);
    }
  };

  const renderKeyValue = (value: string, key?: string) => {
    let nameSearchFlag = false;
    let startIndex = 0;
    let endIndex = 0;
    if (currentSearchStr.trim() && value.includes(currentSearchStr.trim())) {
      startIndex = value.indexOf(currentSearchStr);
      endIndex = startIndex + currentSearchStr.length;
      nameSearchFlag = true;
    }
    return (
      <div
        style={{
          overflowWrap: 'anywhere',
        }}
        className=" flex min-w-[80px] mr-2 mt-1 ">
        {key && (
          <span className="inline-block w-12 flex-shrink-0 bg-slate-200 h-[28px] leading-7 mr-1 text-center rounded-sm ">
            {key}:
          </span>
        )}
        {nameSearchFlag ? (
          <span className=" inline-block  max-h-[320px] overflow-auto p-1 rounded-sm bg-[#f4f4f5] text-[#ea580c] ">
            <span>
              {value.slice(0, startIndex)}
              <span className="text-primary font-bold">{currentSearchStr}</span>
              {value.slice(endIndex)}
            </span>
          </span>
        ) : (
          <p className=" min-w-[80px] inline-block max-h-[320px] overflow-auto  p-1 rounded-sm bg-[#f4f4f5] text-[#ea580c] ">
            {value}
          </p>
        )}
      </div>
    );
  };

  const renderPopver = (key: keyof CookieShowItem, row: Record<string, any>, nameKey = 'name') => {
    const keyName = nameKey;
    const sameId = selectedRow?.id === row.id;
    if (localStorageMode) {
      return null;
    }
    return (
      <Popover
        open={key === selectedKey && sameId && !!selectedRow}
        onOpenChange={val => {
          console.log('val', val);
          if (val === false) {
            handleCancel();
          }
          // if (val) {
          //   handleEdit(key, row);
          // } else {
          //   handleCancel();
          // }
        }}>
        <PopoverTrigger>
          <button
            onClick={() => {
              if (selectedRow && selectedRow.id === row.id) {
                handleCancel();
              } else {
                handleEdit(key, row);
              }
            }}
            style={{
              visibility: selectedRow && selectedRow?.id === row.id ? 'visible' : undefined,
            }}
            className=" invisible ml-2 cursor-pointer group-hover/item:visible">
            <PencilLine className="h-4 w-4" />
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-80 ">
          <div className="grid gap-2">
            <p className="text-lg font-semibold ">Edit</p>
            <div className="grid grid-cols-5 items-center gap-2">
              <Label htmlFor={keyName}>{keyName}</Label>
              <Input
                id={keyName}
                defaultValue={selectedRow?.[keyName]}
                onChange={evt => {
                  (inputRowRef.current as Record<string, any>)![keyName] = evt.target.value || '';
                }}
                className="col-span-4 h-8"
              />
            </div>
            <div className="grid grid-cols-5 items-center gap-2">
              <Label htmlFor={key}>{key}</Label>
              <Input
                id={key}
                defaultValue={String(selectedRow?.[key])}
                onChange={evt => {
                  if (inputRowRef.current && key) {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    (inputRowRef.current as any)[key] = evt.target.value || '';
                  }
                }}
                className="col-span-4 h-8"
              />
            </div>
            <div className="flex justify-end mt-2">
              <Button size="sm" variant="outline" onClick={() => handleCancel()}>
                Cancel
              </Button>
              <Button disabled={loading} onClick={() => handleSave()} size="sm" className="ml-2">
                Save
              </Button>
              <Button onClick={() => handleSave(true)} disabled={loading} size="sm" className="ml-2">
                Save And Set
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    );
  };

  const renderEditCell = (key: keyof CookieShowItem, row: Record<string, any>, nameKey = 'name') => {
    const isEdit = false && key === selectedKey && selectedRow?.id === row.id;
    const keyName = nameKey;
    const nameValue = row[keyName];
    const value = row.value;
    const sameId = localStorageMode && 0 ? true : selectedRow?.id === row.id;
    return (
      <div key={key + row[key]} className=" min-w-[25vw] flex items-center group/item">
        {isEdit ? (
          <div className="relative w-full">
            <Input
              type="text"
              value={String(selectedRow?.[key] || '')}
              className={cn('min-w-[200px] h-8 ', 'pr-[128px]')}
              onChange={e => {
                console.log('e.target.value', e.target.value);
                setSelectedRow({
                  ...selectedRow,
                  [key]: e.target.value,
                });
              }}
            />
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleCancel()}
              className="absolute my-1 w-[64px] h-[24px] right-[62px] top-0 bottom-0 mx-auto ">
              Cancel
            </Button>
            <Button size="sm" className="absolute my-1  w-[48px] h-[24px]  right-2 top-0 bottom-0 mx-auto ">
              Save
            </Button>
          </div>
        ) : (
          <div className="flex items-center justify-center">
            <div>
              {renderKeyValue(nameValue, keyName)}
              {renderKeyValue(value, 'value')}
            </div>

            {renderPopver(key, row, 'name')}
          </div>
        )}
      </div>
    );
  };

  const handleSet = async (item: Record<string, any>) => {
    const domainCnf = await domainConfigStorage.get();
    const itemDomainCnf = domainCnf.domainMap[selectedDomain];
    const sourceUrl = itemDomainCnf?.sourceUrl;
    const protocol = sourceUrl ? new URL(sourceUrl).protocol : 'http:';
    const itemHost = item.domain.startsWith('.') ? item.domain.slice(1) : item.domain;
    const href = `${protocol}//${itemHost || selectedDomain}`;
    const setVal = {
      domain: item.domain,
      name: item.name ?? undefined,
      url: href,
      storeId: item.storeId ?? undefined,
      value: item.value ?? undefined,
      expirationDate: item.expirationDate ?? undefined,
      path: item.path ?? undefined,
      httpOnly: item.httpOnly ?? undefined,
      secure: item.secure ?? undefined,
      sameSite: (item.sameSite ?? undefined) as chrome.cookies.SameSiteStatus,
    };
    try {
      await chrome.cookies.set(setVal);
      toast.success('set success');
    } catch (error) {
      console.log('set cookie error', setVal, error);
      toast.error('set failed');
    }
  };

  const handleDelete = async (item: Record<string, any>) => {
    handleDeleteItem(`${item.domain}_${item.name}`);
  };

  const showCookiesColumns: ColumnDef<CookieShowItem>[] = [
    {
      id: 'Domain',
      accessorKey: 'domain',
      header: 'Domain',
      cell: ({ row }) => {
        const domainValue = row.original.domain;
        if (currentSearchStr.trim() && domainValue.includes(currentSearchStr)) {
          const startIndex = domainValue.indexOf(currentSearchStr);
          const endIndex = startIndex + currentSearchStr.length;
          return (
            <p
              style={{
                overflowWrap: 'anywhere',
              }}
              className="min-w-[80px]">
              {domainValue.slice(0, startIndex)}
              <span className="text-primary font-bold">{currentSearchStr}</span>
              {domainValue.slice(endIndex)}
            </p>
          );
        } else {
          return (
            <p
              style={{
                overflowWrap: 'anywhere',
              }}
              className="min-w-[80px]">
              {domainValue}
            </p>
          );
        }
      },
    },
    // {
    //   id: 'Name',
    //   accessorKey: 'name',
    //   header: 'Name',
    //   // cell: ({ row }) => {
    //   //   return renderEditCell('name', row.original);
    //   // },
    // },
    {
      id: 'Value',
      accessorKey: 'value',
      header: 'Key / Value',
      cell: ({ row }) => {
        return renderEditCell('value', row.original);
      },
    },

    {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => {
        const itemStatus = domainStatus.domainMap[selectedDomain] || {};
        const disabled = domainStatus.pushing || itemStatus.pulling || itemStatus.pushing;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <Ellipsis className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                // disabled={domainConfig.pushing}
                className="cursor-pointer"
                onClick={() => handleSet(row.original)}>
                <Wrench size={16} className="mr-2 h-4 w-4" />
                Set
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                disabled={disabled}
                className="cursor-pointer"
                onClick={() => handleDelete(row.original)}>
                <Trash2 size={16} className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
              {/* <DropdownMenuItem
                disabled={disabled}
                className="cursor-pointer"
                onClick={() => handleDelete(row.original)}>
                <Trash2 size={16} className="mr-2 h-4 w-4" />
                Delete And Set
              </DropdownMenuItem> */}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const showLocalStorageColumns: ColumnDef<LocalStorageShowItem>[] = [
    {
      id: 'Value',
      accessorKey: 'value',
      header: 'Key / Value',
      cell: ({ row, cell }) => {
        const id = cell.id;
        return renderEditCell('value', { id, ...row.original }, 'key');
      },
    },
  ];

  const cookieList =
    cookieMap.domainCookieMap?.[selectedDomain]?.cookies?.map((item, index) => {
      return {
        ...item,
        id: item.name + '_' + index,
        domain: item.domain ?? '',
        name: item.name ?? '',
        value: item.value ?? '',
        // name: cookie.name ?? undefined,
        // url: activeTabUrl,
        // storeId: cookie.storeId ?? undefined,
        // value: cookie.value ?? undefined,
        // expirationDate: cookie.expirationDate ?? undefined,
        // path: cookie.path ?? undefined,
        // httpOnly: cookie.httpOnly ?? undefined,
        // secure: cookie.secure ?? undefined,
        // sameSite: (cookie.sameSite ?? undefined) as chrome.cookies.SameSiteStatus,
      };
    }) || [];

  const localStorageItems = cookieMap.domainCookieMap?.[selectedDomain]?.localStorageItems || [];
  useEffect(() => {
    if (localStorageItems && localStorageItems.length > 0) {
      setHasLocalStorage(true);
    } else {
      setHasLocalStorage(false);
      setLocalStorageMode(false);
    }
  }, [localStorageItems]);
  return {
    loading,
    selectedDomain,
    showCookiesColumns,
    localStorageItems,
    showLocalStorageColumns,
    setSelectedDomain,
    cookieList,
    renderKeyValue,
    localStorageMode,
    hasLocalStorage,
    setLocalStorageMode,
  };
};
