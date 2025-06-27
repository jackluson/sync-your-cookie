import { useStorageSuspense } from '@sync-your-cookie/shared';
import { defaultKey, settingsStorage } from '@sync-your-cookie/storage/lib/settingsStorage';
import { Input, Label, Popover, PopoverContent, PopoverTrigger, Switch } from '@sync-your-cookie/ui';
import React from 'react';

interface SettingsPopover {
  trigger: React.ReactNode;
}

export function SettingsPopover({ trigger }: SettingsPopover) {
  const settingsInfo = useStorageSuspense(settingsStorage);

  const handleCheckChange = (checked: boolean) => {
    settingsStorage.update({
      protobufEncoding: checked,
    });
  };

  const handleKeyInputChange: React.ChangeEventHandler<HTMLInputElement> = evt => {
    console.log('evt', evt);
    const value = evt.target.value.trim();
    settingsStorage.update({
      storageKey: value,
    });
  };

  const handleOpenChange = (open: boolean) => {
    if (open === false && !settingsInfo.storageKey) {
      settingsStorage.update({
        storageKey: defaultKey,
      });
    }
  };

  return (
    <Popover onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>{trigger}</PopoverTrigger>
      <PopoverContent className="w-80">
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
              <Input
                onChange={handleKeyInputChange}
                id="storage-key"
                value={settingsInfo.storageKey}
                className="h-8 flex-1"
                placeholder={defaultKey}
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
