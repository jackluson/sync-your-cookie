import {
  catchHandler,
  editCookieItemUsingMessage,
  ICookie,
  removeCookieItemUsingMessage,
} from '@sync-your-cookie/shared';
import { useState } from 'react';
import { toast } from 'sonner';

export const useCookieItem = (selectedDomain: string) => {
  const [loading, setLoading] = useState(false);

  const handleDeleteItem = async (id: string) => {
    try {
      setLoading(true);
      await removeCookieItemUsingMessage({
        domain: selectedDomain,
        id,
      })
        .then(async res => {
          if (res.isOk) {
            toast.success(res.msg || 'success');
          } else {
            toast.error(res.msg || 'Deleted fail');
          }
        })
        .catch(err => {
          catchHandler(err, 'delete', toast);
        });
    } finally {
      setLoading(false);
    }
  };

  const handleEditItem = async (oldItem: ICookie, newItem: ICookie) => {
    try {
      setLoading(true);
      await editCookieItemUsingMessage({
        domain: selectedDomain,
        oldItem,
        newItem,
      })
        .then(async res => {
          if (res.isOk) {
            toast.success(res.msg || 'success');
          } else {
            toast.error(res.msg || 'Edited fail');
            return Promise.reject(res);
          }
        })
        .catch(err => {
          catchHandler(err, 'edit', toast);
          return Promise.reject(err);
        });
    } finally {
      setLoading(false);
    }
  };
  return {
    loading,
    handleDeleteItem,
    handleEditItem,
  };
};
