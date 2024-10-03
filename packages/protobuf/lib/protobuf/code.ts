import pako from 'pako';
import { compress, decompress } from './../../utils/compress';
import type { ICookie, IDomainCookies } from './proto/cookie';
import { DomainCookies } from './proto/cookie';

export const encodeDomainCookies = async (cookies: ICookie[], isCompress: boolean = true): Promise<Uint8Array> => {
  const domainCookies: IDomainCookies = {
    timestamp: Date.now(),
    cookies: cookies,
  };
  // verify 只会校验数据的类型是否合法，并不会校验是否缺少或增加了数据项。
  const invalid = DomainCookies.verify(domainCookies);
  if (invalid) {
    throw Error(invalid);
  }

  const message = DomainCookies.create(domainCookies);
  const buffer = DomainCookies.encode(message).finish();
  if (isCompress) {
    const compressedBuf = pako.deflate(buffer);
    return await compress(compressedBuf);
  }
  return buffer;
};

export const decodeDomainCookies = async (buffer: Uint8Array, isDeCompress: boolean = true) => {
  let buf = buffer;
  if (isDeCompress) {
    buf = await decompress(buf);
    buf = pako.inflate(buf);
  }
  const message = DomainCookies.decode(buf);
  return message;
};

export type { ICookie, IDomainCookies } from './proto/cookie';
