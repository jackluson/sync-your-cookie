import { GithubApi, pullCookies, useStorageSuspense } from '@sync-your-cookie/shared';
import { accountStorage } from '@sync-your-cookie/storage/lib/accountStorage';
import { cookieStorage } from '@sync-your-cookie/storage/lib/cookieStorage';
import { domainStatusStorage } from '@sync-your-cookie/storage/lib/domainStatusStorage';
import { settingsStorage } from '@sync-your-cookie/storage/lib/settingsStorage';
import { Input, Label, Popover, PopoverContent, PopoverTrigger, Switch, SyncTooltip } from '@sync-your-cookie/ui';
import { Eye, EyeOff, Info, Lock, SquareArrowOutUpRight } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { StorageSelect } from './StorageSelect';
interface SettingsPopover {
  trigger: React.ReactNode;
}

export function SettingsPopover({ trigger }: SettingsPopover) {
  const settingsInfo = useStorageSuspense(settingsStorage);
  const [selectOpen, setSelectOpen] = useState(false);
  const [openEye, setOpenEye] = useState(false);

  const handleCheckChange = (
    checked: boolean,
    checkedKey: 'protobufEncoding' | 'includeLocalStorage' | 'contextMenu' | 'encryptionEnabled',
  ) => {
    settingsStorage.update({
      [checkedKey]: checked,
    });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    settingsStorage.update({
      encryptionPassword: e.target.value,
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
  const handleToggleEye = () => {
    setOpenEye(!openEye);
  };
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
    const accountStorageInfo = await accountStorage.getSnapshot();
    if (accountStorageInfo?.selectedProvider === 'github') {
      const gistId = settingsInfo.storageKeyGistId;
      await GithubApi.instance.addGistFile(gistId!, key);
      await GithubApi.instance.initStorageKeyList();
    } else {
      await settingsStorage.addStorageKey(key);
    }
  };

  const handleRemoveStorageKey = async (key: string) => {
    const accountStorageInfo = await accountStorage.getSnapshot();
    if (accountStorageInfo?.selectedProvider === 'github') {
      const gistId = settingsInfo.storageKeyGistId;
      await GithubApi.instance.deleteGistFile(gistId!, key);
      await GithubApi.instance.initStorageKeyList();
    } else {
      await settingsStorage.removeStorageKey(key);
    }
  };

  return (
    <Popover onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>{trigger}</PopoverTrigger>
      <PopoverContent align="start" className="w-[328px]">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h3 className="leading-none font-medium text-base">Save Settings</h3>
            <p className="text-muted-foreground text-sm">Set the save format. </p>
          </div>
          <div className="gap-2">
            <div className="flex items-center gap-4 mb-4">
              <Label className="w-[136px] block text-right" htmlFor="storage-key">
                <div className="flex gap-2 justify-end">
                  Storage Key
                  {settingsInfo.gistHtmlUrl ? (
                    <a href={settingsInfo.gistHtmlUrl} target="_blank" rel="noreferrer">
                      <SquareArrowOutUpRight size={16} />
                    </a>
                  ) : null}
                </div>
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
              <Label className="whitespace-nowrap block w-[136px] justify-end text-right" htmlFor="encoding">
                Protobuf Encoding
              </Label>
              <Switch
                onCheckedChange={checked => handleCheckChange(checked, 'protobufEncoding')}
                checked={settingsInfo.protobufEncoding}
                id="encoding"
              />
            </div>

            <div className="flex items-center gap-4 mb-4">
              <Label
                className="items-center  whitespace-nowrap flex w-[136px] justify-end text-right"
                htmlFor="include">
                Include LocalStorage
              </Label>
              <div className="flex items-center gap-1">
                <Switch
                  onCheckedChange={checked => handleCheckChange(checked, 'includeLocalStorage')}
                  checked={settingsInfo.includeLocalStorage}
                  id="include"
                />
                <SyncTooltip title="Note: LocalStorage cannot supports Auto Push & If the retrieval fails, the page will be reloaded once to try again.">
                  <Info className="mx-2" size={18} />
                </SyncTooltip>
              </div>
            </div>

            <div className="flex items-center gap-4 mb-4">
              <Label
                className="items-center whitespace-nowrap flex w-[136px] justify-end text-right"
                htmlFor="contextMenu">
                Show ContextMenu
              </Label>
              <div className="flex items-center gap-1">
                <Switch
                  onCheckedChange={checked => handleCheckChange(checked, 'contextMenu')}
                  checked={settingsInfo.contextMenu}
                  id="contextMenu"
                />
              </div>
            </div>

            <div className="border-t pt-4 mt-2">
              <div className="flex items-center gap-4 mb-4">
                <Label
                  className="items-center whitespace-nowrap flex w-[136px] justify-end text-right"
                  htmlFor="encryption">
                  <Lock size={14} className="mr-1" />
                  E2E Encryption
                </Label>
                <div className="flex items-center gap-1">
                  <Switch
                    onCheckedChange={checked => handleCheckChange(checked, 'encryptionEnabled')}
                    checked={settingsInfo.encryptionEnabled}
                    disabled={!settingsInfo.protobufEncoding}
                    id="encryption"
                  />
                  <SyncTooltip title="End-to-end encryption requires Protobuf Encoding to be enabled. Your data will be encrypted with AES-256-GCM before being sent to the cloud.">
                    <Info className="mx-2" size={18} />
                  </SyncTooltip>
                </div>
              </div>

              {settingsInfo.encryptionEnabled && settingsInfo.protobufEncoding && (
                <div className="flex items-center gap-2">
                  <Label
                    className="items-center mr-2 whitespace-nowrap flex w-[136px] justify-end text-right"
                    htmlFor="encryptionPassword">
                    Password
                  </Label>
                  <Input
                    type={openEye ? 'text' : 'password'}
                    id="encryptionPassword"
                    value={settingsInfo.encryptionPassword || ''}
                    onChange={handlePasswordChange}
                    className="h-8 flex-1"
                    placeholder="Enter encryption password"
                  />
                  <span
                    role="button"
                    tabIndex={0}
                    onClick={() => handleToggleEye()}
                    onKeyDown={e => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        handleToggleEye();
                      }
                    }}
                    className="cursor-pointer mr-4">
                    {openEye ? <EyeOff size={18} /> : <Eye size={18} />}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
