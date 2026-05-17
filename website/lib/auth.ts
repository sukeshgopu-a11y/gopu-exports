const COOKIE_NAME = "admin-session";
const PAYLOAD = "gopu-exports-admin-v1";

async function getKey(): Promise<CryptoKey> {
  const secret = process.env.SESSION_SECRET ?? "change-this-secret";
  const encoder = new TextEncoder();
  return crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

export async function createSessionToken(): Promise<string> {
  const key = await getKey();
  const encoder = new TextEncoder();
  const sig = await crypto.subtle.sign("HMAC", key, encoder.encode(PAYLOAD));
  return btoa(String.fromCharCode(...new Uint8Array(sig)));
}

export async function verifySessionToken(token: string): Promise<boolean> {
  try {
    const expected = await createSessionToken();
    return token === expected;
  } catch {
    return false;
  }
}

export { COOKIE_NAME };
