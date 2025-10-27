import { pullCookies, useStorageSuspense } from '@sync-your-cookie/shared';
import { cookieStorage } from '@sync-your-cookie/storage/lib/cookieStorage';
import { domainStatusStorage } from '@sync-your-cookie/storage/lib/domainStatusStorage';
import { settingsStorage } from '@sync-your-cookie/storage/lib/settingsStorage';
import { Label, Popover, PopoverContent, PopoverTrigger, Switch, SyncTooltip } from '@sync-your-cookie/ui';
import { Info } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { StorageSelect } from './StorageSelect';
interface SettingsPopover {
  trigger: React.ReactNode;
}

export function SettingsPopover({ trigger }: SettingsPopover) {
  const settingsInfo = useStorageSuspense(settingsStorage);
  const [selectOpen, setSelectOpen] = useState(false);

  const handleCheckChange = (checked: boolean, checkedKey: 'protobufEncoding' | 'includeLocalStorage') => {
    settingsStorage.update({
      [checkedKey]: checked,
    });
  };

  const handleValueChange = (value: string) => {
    settingsStorage.update({
      storageKey: value,
    });
  };

  const reset = async () => {
    await domainStatusStorage.resetState();
    await cookieStorage.reset();
    await pullCookies();
    console.log('reset finished');
  };

  useEffect(() => {
    reset();
  }, [settingsInfo.storageKey]);

  const handleOpenChange = (open: boolean) => {
    if (selectOpen) return;
    // if (open === false && (settingsInfo.storageKey !== storageKey || !storageKey)) {
    //   console.log('open', open);
    //   settingsStorage.update({
    //     storageKey: storageKey || defaultKey,
    //   });
    //   domainConfigStorage.resetState();
    // }
  };

  const handleSelectOpenChange = (open: boolean) => {
    console.log('select open', open);
    setSelectOpen(open);
  };

  const handleAddStorageKey = async (key: string) => {
    await settingsStorage.addStorageKey(key);
  };

  const handleRemoveStorageKey = async (key: string) => {
    await settingsStorage.removeStorageKey(key);
  };

  return (
    <Popover onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>{trigger}</PopoverTrigger>
      <PopoverContent className="w-[328px]">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h3 className="leading-none font-medium text-base">Storage Settings</h3>
            <p className="text-muted-foreground text-sm">Set to how to store in cloudflare KV.</p>
          </div>
          <div className="gap-2">
            <div className="flex items-center gap-4 mb-4">
              <Label className="w-[136px] block text-right" htmlFor="storage-key">
                Storage Key
              </Label>
              {/* <Input
                onChange={handleKeyInputChange}
                id="storage-key"
                value={storageKey}
                className="h-8 flex-1"
                placeholder={defaultKey}
              /> */}
              <StorageSelect
                options={settingsInfo.storageKeyList}
                open={selectOpen}
                onOpenChange={handleSelectOpenChange}
                value={settingsInfo.storageKey || ''}
                onAdd={handleAddStorageKey}
                onRemove={handleRemoveStorageKey}
                onValueChange={handleValueChange}
              />
            </div>
            <div className="flex items-center gap-4 mb-4">
              <Label className="whitespace-nowrap block w-[136px] text-right" htmlFor="encoding">
                Protobuf Encoding
              </Label>
              <Switch
                onCheckedChange={checked => handleCheckChange(checked, 'protobufEncoding')}
                checked={settingsInfo.protobufEncoding}
                id="encoding"
              />
            </div>

            <div className="flex items-center gap-4">
              <Label className="items-center whitespace-nowrap flex w-[136px] text-right" htmlFor="include">
                Include LocalStorage
              </Label>
              <div className="flex items-center gap-1">
                <Switch
                  onCheckedChange={checked => handleCheckChange(checked, 'includeLocalStorage')}
                  checked={settingsInfo.includeLocalStorage}
                  id="include"
                />
                <SyncTooltip title="LocalStorage cannot supports Auto Push">
                  <Info className="mx-2" size={18} />
                </SyncTooltip>
              </div>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
