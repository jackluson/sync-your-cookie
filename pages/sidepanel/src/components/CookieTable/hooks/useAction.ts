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
      await cookieAction.handleRemove(cookie.domain);
    } finally {
      setLoading(false);
    }
  };

  const handlePull = async (activeTabUrl: string, cookie: CookieItem) => {
    try {
      setLoading(true);
      await cookieAction.handlePull(activeTabUrl, cookie.domain, false);
    } finally {
      setLoading(false);
    }
  };

  const handlePush = async (cookie: CookieItem) => {
    try {
      setLoading(true);
      await cookieAction.handlePush(cookie.domain);
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

  console.log('cookies', cookie?.domainCookieMap?.[selectedDomain]);

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
    // handlePush,
    cookieList,
  };
};
