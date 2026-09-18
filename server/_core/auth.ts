import bcrypt from "bcryptjs";
import crypto from "node:crypto";
import type { Request, Response } from "express";

const SESSION_SECRET = process.env.SESSION_SECRET;
if (!SESSION_SECRET) {
  throw new Error("SESSION_SECRET environment variable is required");
}

const COOKIE_NAME = "mihl_session";
const SESSION_MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, 12);
}

export async function verifyPassword(
  plain: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}

// Simple signed-token session: base64(payload).hmac
// Avoids needing a session store table; the token itself is the source of truth.
type SessionPayload = { userId: number; issuedAt: number };

function sign(payload: string): string {
  return crypto
    .createHmac("sha256", SESSION_SECRET!)
    .update(payload)
    .digest("hex");
}

export function createSessionToken(userId: number): string {
  const payload: SessionPayload = { userId, issuedAt: Date.now() };
  const encoded = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = sign(encoded);
  return `${encoded}.${signature}`;
}

export function verifySessionToken(token: string | undefined): number | null {
  if (!token) return null;
  const [encoded, signature] = token.split(".");
  if (!encoded || !signature) return null;
  const expected = sign(encoded);
  const validSig =
    signature.length === expected.length &&
    crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
  if (!validSig) return null;

  try {
    const payload: SessionPayload = JSON.parse(
      Buffer.from(encoded, "base64url").toString("utf-8")
    );
    if (Date.now() - payload.issuedAt > SESSION_MAX_AGE_MS) return null;
    return payload.userId;
  } catch {
    return null;
  }
}

export function setSessionCookie(res: Response, userId: number) {
  const token = createSessionToken(userId);
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_MAX_AGE_MS,
    path: "/",
  });
}

export function clearSessionCookie(res: Response) {
  res.clearCookie(COOKIE_NAME, { path: "/" });
}

export function getUserIdFromRequest(req: Request): number | null {
  const token = req.cookies?.[COOKIE_NAME];
  return verifySessionToken(token);
}

export function generateRandomToken(): string {
  return crypto.randomBytes(32).toString("hex");
}
