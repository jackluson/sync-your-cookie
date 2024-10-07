import pako from 'pako';
import { compress, decompress } from './../../utils/compress';
import type { ICookiesMap } from './proto/cookie';
import { CookiesMap } from './proto/cookie';

export const encodeCookiesMap = async (
  cookiesMap: ICookiesMap = {},
  isCompress: boolean = true,
): Promise<Uint8Array> => {
  // verify 只会校验数据的类型是否合法，并不会校验是否缺少或增加了数据项。
  const invalid = CookiesMap.verify(cookiesMap);
  if (invalid) {
    throw Error(invalid);
  }

  const message = CookiesMap.create(cookiesMap);
  const buffer = CookiesMap.encode(message).finish();
  if (isCompress) {
    const compressedBuf = pako.deflate(buffer);
    return await compress(compressedBuf);
  }
  return buffer;
};

export const decodeCookiesMap = async (buffer: Uint8Array, isDeCompress: boolean = true) => {
  let buf = buffer;
  if (isDeCompress) {
    buf = await decompress(buf);
    buf = pako.inflate(buf);
  }
  const message = CookiesMap.decode(buf);
  return message;
};

export type { ICookie, ICookiesMap } from './proto/cookie';
