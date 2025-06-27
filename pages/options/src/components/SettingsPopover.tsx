import { Input, Label, Popover, PopoverContent, PopoverTrigger, Switch } from '@sync-your-cookie/ui';

import React from 'react';

interface SettingsPopover {
  trigger: React.ReactNode;
}

export function SettingsPopover({ trigger }: SettingsPopover) {
  return (
    <Popover>
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
              <Input id="storage-key" defaultValue="sync-your-cookie" className="h-8 flex-1" />
            </div>
            <div className="flex items-center gap-4">
              <Label className="whitespace-nowrap block w-[116px] text-right" htmlFor="encoding">
                Protobuf Encoding
              </Label>
              <Switch id="encoding" />
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
