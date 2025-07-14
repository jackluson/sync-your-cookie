import React from 'react';
import { ILocalStorageItem, useLocalStorageAction as useLocalStorageActionHook } from '@sync-your-cookie/shared';
import { LocalStorage } from '@sync-your-cookie/storage/lib/localStorageStorage';
import { ColumnDef } from '@sync-your-cookie/ui';
import { useState } from 'react';
import { toast } from 'sonner';
import { LocalStorageTableItem } from '..';

export interface LocalStorageItemDisplay {
  id: string;
  key: string;
  value: string;
  host: string;
}

export const useLocalStorageAction = (localStorageMap: LocalStorage) => {
  const [selectedDomain, setSelectedDomain] = useState('');
  const [currentSearchStr, setCurrentSearchStr] = useState('');
  const [loading, setLoading] = useState(false);

  const localStorageAction = useLocalStorageActionHook(selectedDomain, toast);

  const handleBack = () => {
    setSelectedDomain('');
    setCurrentSearchStr('');
  };

  const handleSearch = (searchStr: string) => {
    setCurrentSearchStr(searchStr);
  };

  const handlePush = async (item: LocalStorageTableItem) => {
    setLoading(true);
    try {
      await localStorageAction.handlePush(item.host, item.sourceUrl, item.favIconUrl);
    } finally {
      setLoading(false);
    }
  };

  const handlePull = async (href: string, item: LocalStorageTableItem) => {
    setLoading(true);
    try {
      await localStorageAction.handlePull(href, item.host, true);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (item: LocalStorageTableItem) => {
    setLoading(true);
    try {
      await localStorageAction.handleRemove(item.host);
    } finally {
      setLoading(false);
    }
  };

  const handleViewItems = (host: string) => {
    setSelectedDomain(host);
  };

  const handleCopy = (host: string, useJson = false) => {
    const domainData = localStorageMap.domainLocalStorageMap?.[host];
    if (!domainData?.items) {
      toast.error('No localStorage data found for this domain');
      return;
    }

    let content = '';
    if (useJson) {
      const localStorageObj: Record<string, string> = {};
      domainData.items.forEach(item => {
        if (item.key && item.value) {
          localStorageObj[item.key] = item.value;
        }
      });
      content = JSON.stringify(localStorageObj, null, 2);
    } else {
      content = domainData.items
        .map(item => `${item.key}=${item.value}`)
        .join('\n');
    }

    navigator.clipboard.writeText(content).then(() => {
      toast.success('Copied to clipboard');
    });
  };

  let itemList: LocalStorageItemDisplay[] = [];
  if (selectedDomain) {
    const domainData = localStorageMap.domainLocalStorageMap?.[selectedDomain];
    if (domainData?.items) {
      itemList = domainData.items
        .filter(item => {
          if (!currentSearchStr.trim()) return true;
          return item.key?.toLowerCase().includes(currentSearchStr.toLowerCase()) ||
                 item.value?.toLowerCase().includes(currentSearchStr.toLowerCase());
        })
        .map(item => ({
          id: `${selectedDomain}_${item.key}`,
          key: item.key || '',
          value: item.value || '',
          host: selectedDomain,
        }));
    }
  }

  const showItemsColumns: ColumnDef<LocalStorageItemDisplay>[] = [
    {
      accessorKey: 'key',
      header: 'Key',
      cell: ({ getValue }) => {
        const value = getValue<string>();
        return React.createElement('div', { className: 'max-w-[200px]' },
          React.createElement('p', { className: 'truncate font-medium' }, value)
        );
      },
    },
    {
      accessorKey: 'value',
      header: 'Value',
      cell: ({ getValue }) => {
        const value = getValue<string>();
        return React.createElement('div', { className: 'max-w-[300px]' },
          React.createElement('p', { className: 'truncate text-sm text-muted-foreground' }, value)
        );
      },
    },
  ];

  return {
    selectedDomain,
    setSelectedDomain,
    currentSearchStr,
    loading,
    localStorageAction,
    itemList,
    showItemsColumns,
    handleBack,
    handleSearch,
    handlePush,
    handlePull,
    handleDelete,
    handleViewItems,
    handleCopy,
  };
};