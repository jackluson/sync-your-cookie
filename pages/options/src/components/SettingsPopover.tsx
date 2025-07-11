import { useStorageSuspense } from '@sync-your-cookie/shared';
import { domainConfigStorage } from '@sync-your-cookie/storage/lib/domainConfigStorage';
import { settingsStorage } from '@sync-your-cookie/storage/lib/settingsStorage';

import { pullCookies } from '@sync-your-cookie/shared';
import { cookieStorage } from '@sync-your-cookie/storage/lib/cookieStorage';
import { Label, Popover, PopoverContent, PopoverTrigger, Switch } from '@sync-your-cookie/ui';
import React, { useEffect, useState } from 'react';
import { StorageSelect } from './StorageSelect';
interface SettingsPopover {
  trigger: React.ReactNode;
}

export function SettingsPopover({ trigger }: SettingsPopover) {
  const settingsInfo = useStorageSuspense(settingsStorage);
  const [selectOpen, setSelectOpen] = useState(false);

  const handleCheckChange = (checked: boolean) => {
    settingsStorage.update({
      protobufEncoding: checked,
    });
  };

  const handleValueChange = (value: string) => {
    settingsStorage.update({
      storageKey: value,
    });
  };

  const reset = async () => {
    await domainConfigStorage.resetState();
    await cookieStorage.reset();
    await pullCookies();
    console.log("reset finished");
  }

  useEffect(()=> {
     reset();
  }, [settingsInfo.storageKey])

  const handleOpenChange = (open: boolean) => {
    if (selectOpen) return;
    console.log('popover open', open);
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
    // if (settingsInfo.storageKey === key) {
    //   settingsStorage.update({
    //     storageKey: defaultKey,
    //   });
    //   setStorageKey(defaultKey);
    // }
    await settingsStorage.removeStorageKey(key);
  };

  return (
    <Popover onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>{trigger}</PopoverTrigger>
      <PopoverContent className="w-[320px]">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h3 className="leading-none font-medium text-base">Storage Settings</h3>
            <p className="text-muted-foreground text-sm">Set to how to store in cloudflare KV.</p>
          </div>
          <div className="gap-2">
            <div className="flex items-center gap-4 mb-4">
              <Label className="w-[116px] block text-right" htmlFor="storage-key">
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
            <div className="flex items-center gap-4">
              <Label className="whitespace-nowrap block w-[116px] text-right" htmlFor="encoding">
                Protobuf Encoding
              </Label>
              <Switch onCheckedChange={handleCheckChange} checked={settingsInfo.protobufEncoding} id="encoding" />
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
