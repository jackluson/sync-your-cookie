import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function extractDomain(url: string): Promise<string> {
  console.log('url', url);
  let domain = new URL(url).host;
  domain = domain.replace('http://', '').replace('https://', '').replace('www.', '');
  // match ip address
  if (/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(domain)) {
    return domain;
  }
  if (domain.split('.').length <= 2) {
    return domain;
  }
  return new Promise(resolve => {
    try {
      chrome.cookies.getAll(
        {
          url,
        },
        async cookies => {
          console.log('cookies', cookies);
          if (cookies) {
            const domain = cookies[0].domain;
            if (domain.startsWith('.')) {
              resolve(domain.slice(1));
            } else {
              resolve(domain);
            }
          } else {
            const match = domain.match(/([^.]+\.[^.]+)$/);
            resolve(match ? match[1] : '');
          }
        },
      );
    } catch (error) {
      console.error('error', error);
      const match = domain.match(/([^.]+\.[^.]+)$/);
      resolve(match ? match[1] : '');
    }
  });
}
