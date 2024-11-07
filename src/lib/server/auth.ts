import { encodeBase32LowerCaseNoPadding, encodeHexLowerCase } from '@oslojs/encoding';
import { db } from './db';
import { sha256 } from '@oslojs/crypto/sha2';
import type { Session, User, UserInfo } from './db/types';
import { addSession, deleteSession, resetSession } from './db/auth/post';
import { getSession } from './db/auth/get';
import type { Cookies, RequestEvent } from '@sveltejs/kit';
import { dev } from '$app/environment';

export const generateSessionToken = (): string => {
	const bytes = new Uint8Array(20);
	crypto.getRandomValues(bytes);
	const token = encodeBase32LowerCaseNoPadding(bytes);
	return token;
};

const EXPIRE_DAYS = 30;
const RESET_DAYS = 15;
export const SESSION_COOKIE_NAME = 'session';

export const createSession = (token: string, userId: string): Session => {
	const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
	const session: Session = {
		SessionID: sessionId,
		UserID: userId,
		ExpiresAt: Math.floor(new Date(Date.now() + 1000 * 60 * 60 * 24 * EXPIRE_DAYS).getTime() / 1000)
	};
	addSession(session);
	return session;
};

export const validateSessionToken = (token: string): SessionValidationResult => {
	const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
	const result = getSession(sessionId);
	if (result === null) {
		return { session: null, user: null };
	}

	const { Sessions: oldSession, Users: user } = result;

	const { HashedPassword: _, ..._userInfo } = user;
	let userInfo: UserInfo = _userInfo;
	let expiresAt = new Date(oldSession.ExpiresAt * 1000);
	const expireTime = expiresAt.getTime();
	if (Date.now() >= expireTime) {
		deleteSession(oldSession.SessionID);
		return { session: null, user: null };
	}
	if (Date.now() >= expireTime - 1000 * 60 * 60 * 24 * RESET_DAYS) {
		expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * EXPIRE_DAYS);
		resetSession(Math.floor(expiresAt.getTime() / 1000), oldSession.SessionID);
	}
	return {
		session: { ...oldSession, ExpiresAt: Math.floor(expireTime / 1000) },
		user: userInfo
	};
};

export const invalidateSession = (sessionId: string): void => {
	deleteSession(sessionId);
};

export const setSessionTokenCookie = (cookies: Cookies, token: string, expiresAt: number): void => {
	cookies.set(SESSION_COOKIE_NAME, token, {
		secure: !dev,
		httpOnly: true,
		sameSite: 'lax',
		expires: new Date(expiresAt * 1000),
		path: '/'
	});
};

export const deleteSessionTokenCookie = (cookies: Cookies): void => {
	cookies.set(SESSION_COOKIE_NAME, '', {
		secure: !dev,
		httpOnly: true,
		sameSite: 'lax',
		maxAge: 0,
		path: '/'
	});
};

export const generateIdFromEntropySize = (size: number): string => {
	const buffer = crypto.getRandomValues(new Uint8Array(size));
	return encodeBase32LowerCaseNoPadding(buffer);
};

export type SessionValidationResult =
	| { session: Session; user: UserInfo }
	| { session: null; user: null };
