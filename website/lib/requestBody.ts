export class BodyTooLargeError extends Error {}

/** Bound actual bytes even when Content-Length is absent or dishonest. */
export async function readBoundedJson(request: Request, maxBytes = 32768): Promise<unknown> {
  if (Number(request.headers.get("content-length")) > maxBytes) throw new BodyTooLargeError();
  const reader = request.body?.getReader();
  if (!reader) throw new Error("Missing body");
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > maxBytes) { await reader.cancel(); throw new BodyTooLargeError(); }
      chunks.push(value);
    }
  } finally { reader.releaseLock(); }
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.length; }
  return JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(bytes));
}
