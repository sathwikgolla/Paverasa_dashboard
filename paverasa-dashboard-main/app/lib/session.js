export const SESSION_COOKIE = "paverasa_session";
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000;

function getSessionSecret() {
  return (
    process.env.SESSION_SECRET || "paverasa-dev-secret-change-in-production"
  );
}

function encodeBase64Url(value) {
  const bytes = new TextEncoder().encode(value);
  let binary = "";

  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }

  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function decodeBase64Url(value) {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized + "=".repeat((4 - (normalized.length % 4)) % 4);
  const binary = atob(padded);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));

  return new TextDecoder().decode(bytes);
}

async function getSigningKey() {
  return crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(getSessionSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
}

export async function createSessionToken(user) {
  const payload = {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    exp: Date.now() + SESSION_TTL_MS,
  };
  const payloadSegment = encodeBase64Url(JSON.stringify(payload));
  const key = await getSigningKey();
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(payloadSegment),
  );
  const signatureSegment = encodeBase64Url(
    String.fromCharCode(...new Uint8Array(signature)),
  );

  return `${payloadSegment}.${signatureSegment}`;
}

export async function verifySessionToken(token) {
  if (!token) {
    return null;
  }

  const [payloadSegment, signatureSegment] = token.split(".");

  if (!payloadSegment || !signatureSegment) {
    return null;
  }

  try {
    const key = await getSigningKey();
    const signatureBytes = Uint8Array.from(
      decodeBase64Url(signatureSegment),
      (char) => char.charCodeAt(0),
    );
    const isValid = await crypto.subtle.verify(
      "HMAC",
      key,
      signatureBytes,
      new TextEncoder().encode(payloadSegment),
    );

    if (!isValid) {
      return null;
    }

    const payload = JSON.parse(decodeBase64Url(payloadSegment));

    if (!payload.exp || payload.exp < Date.now()) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}
