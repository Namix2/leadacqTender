import { SignJWT, jwtVerify } from "jose";

export const SESSION_COOKIE = "tendr_session";

function secret() {
  return new TextEncoder().encode(process.env.SESSION_SECRET || "development-only-secret-change-me");
}

export async function createSession() {
  return new SignJWT({ operator: true })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret());
}

export async function isValidSession(token?: string) {
  if (!token) return false;
  try {
    const { payload } = await jwtVerify(token, secret());
    return payload.operator === true;
  } catch {
    return false;
  }
}
