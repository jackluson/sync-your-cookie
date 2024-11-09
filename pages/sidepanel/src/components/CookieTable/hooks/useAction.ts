import { useCookieAction } from '@sync-your-cookie/shared';
import type { Cookie } from '@sync-your-cookie/storage/lib/cookieStorage';
import { useState } from 'react';
import { toast } from 'sonner';
import { CookieItem } from './../index';
import { useSelected } from './useSelected';

export const useAction = (cookie: Cookie) => {
  const [loading, setLoading] = useState(false);

  const { selectedDomain, showCookiesColumns, setSelectedDomain, cookieList } = useSelected(cookie);
  const cookieAction = useCookieAction(selectedDomain, toast);
  const handleDelete = async (cookie: CookieItem) => {
    try {
      setLoading(true);
      await cookieAction.handleRemove(cookie.host);
    } finally {
      setLoading(false);
    }
  };

  const handlePull = async (activeTabUrl: string, cookie: CookieItem) => {
    try {
      setLoading(true);
      await cookieAction.handlePull(activeTabUrl, cookie.host, false);
    } finally {
      setLoading(false);
    }
  };

  const handlePush = async (cookie: CookieItem) => {
    try {
      setLoading(true);
      await cookieAction.handlePush(cookie.host);
    } finally {
      setLoading(false);
    }
  };

  const handleViewCookies = async (domain: string) => {
    console.log('domain', domain);
    setSelectedDomain(domain);
    console.log('cookie', cookie);
  };

  const handleBack = () => {
    setSelectedDomain('');
  };

  const handleCopy = (domain: string) => {
    const cookies = cookie.domainCookieMap?.[domain]?.cookies || [];
    if (cookies.length === 0) {
      toast.warning('no cookie to copy, check again.');
      return;
    }
    const pairs = [];
    for (const ck of cookies) {
      if (ck.value) {
        const pair = `${ck.name}=${ck.value}`;
        pairs.push(pair);
      }
    }
    const joinPairStr = pairs.join('; ');
    if (!navigator.clipboard) {
      toast.warning('please check clipboard permission settings before copy ');
      return;
    }
    navigator?.clipboard?.writeText(joinPairStr).then(
      () => {
        toast.success('Copy success');
      },
      err => {
        console.log('err', err);
        toast.error('Copy failed');
      },
    );
  };

  return {
    handleDelete,
    handlePull,
    handlePush,
    handleViewCookies,
    loading,
    selectedDomain,
    setSelectedDomain,
    handleBack,
    showCookiesColumns,
    cookieAction,
    handleCopy,
    // handlePush,
    cookieList,
  };
};
