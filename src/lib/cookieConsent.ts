const CONSENT_KEY = 'zir_analytics_consent';
const SESSION_COOKIE_NAME = 'zir_session_id';
const COOKIE_EXPIRY_DAYS = 365;

export type ConsentStatus = 'pending' | 'accepted' | 'declined';

export function getConsentStatus(): ConsentStatus {
  const status = localStorage.getItem(CONSENT_KEY);
  if (status === 'accepted' || status === 'declined') {
    return status;
  }
  return 'pending';
}

export function setConsentStatus(status: 'accepted' | 'declined'): void {
  localStorage.setItem(CONSENT_KEY, status);

  if (status === 'declined') {
    deleteAnalyticsCookie();
    deleteAllAnalyticsData();
  }
}

export function hasConsent(): boolean {
  return getConsentStatus() === 'accepted';
}

export function generateSessionId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
}

export function getOrCreateSessionId(): string | null {
  if (!hasConsent()) {
    return null;
  }

  const existingSessionId = getCookie(SESSION_COOKIE_NAME);
  if (existingSessionId) {
    return existingSessionId;
  }

  const newSessionId = generateSessionId();
  setCookie(SESSION_COOKIE_NAME, newSessionId, COOKIE_EXPIRY_DAYS);
  return newSessionId;
}

export function getSessionId(): string | null {
  if (!hasConsent()) {
    return null;
  }
  return getCookie(SESSION_COOKIE_NAME);
}

export function deleteAnalyticsCookie(): void {
  document.cookie = `${SESSION_COOKIE_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Lax`;
}

export function deleteAllAnalyticsData(): void {
  localStorage.removeItem(CONSENT_KEY);
  deleteAnalyticsCookie();
}

export function revokeConsent(): void {
  setConsentStatus('declined');
}

function setCookie(name: string, value: string, days: number): void {
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  const expires = `expires=${date.toUTCString()}`;
  document.cookie = `${name}=${value}; ${expires}; path=/; SameSite=Lax`;
}

function getCookie(name: string): string | null {
  const nameEQ = `${name}=`;
  const cookies = document.cookie.split(';');

  for (let i = 0; i < cookies.length; i++) {
    let cookie = cookies[i];
    while (cookie.charAt(0) === ' ') {
      cookie = cookie.substring(1);
    }
    if (cookie.indexOf(nameEQ) === 0) {
      return cookie.substring(nameEQ.length);
    }
  }

  return null;
}
