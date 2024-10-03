async function concatUint8Arrays(uint8arrays: ArrayBuffer[]) {
  const blob = new Blob(uint8arrays);
  const buffer = await blob.arrayBuffer();
  return new Uint8Array(buffer);
}

/**
 * Compress a string into a Uint8Array.
 * @param byteArray
 * @param method
 * @returns Promise<ArrayBuffer>
 */
export const compress = async (byteArray: Uint8Array, method: CompressionFormat = 'gzip'): Promise<Uint8Array> => {
  const stream = new Blob([byteArray]).stream();
  // const byteArray: Uint8Array = new TextEncoder().encode(string);
  const compressedStream = stream.pipeThrough(new CompressionStream(method)) as unknown as ArrayBuffer[];
  const chunks: ArrayBuffer[] = [];
  for await (const chunk of compressedStream) {
    chunks.push(chunk);
  }
  return await concatUint8Arrays(chunks);
};

/**
 * Decompress bytes into a Uint8Array.
 *
 * @param {Uint8Array} compressedBytes
 * @returns {Promise<Uint8Array>}
 */
export async function decompress(compressedBytes: Uint8Array) {
  // Convert the bytes to a stream.
  const stream = new Blob([compressedBytes]).stream();

  // Create a decompressed stream.
  const decompressedStream = stream.pipeThrough(new DecompressionStream('gzip')) as unknown as ArrayBuffer[];

  // Read all the bytes from this stream.
  const chunks = [];
  for await (const chunk of decompressedStream) {
    chunks.push(chunk);
  }
  const stringBytes = await concatUint8Arrays(chunks);
  return stringBytes;
}
