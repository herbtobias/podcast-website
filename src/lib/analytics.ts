import { supabase } from './supabase';
import { getOrCreateSessionId, hasConsent, getSessionId } from './cookieConsent';

interface SessionInfo {
  userAgent: string;
  screenWidth: number;
  screenHeight: number;
  referrer: string;
}

interface EventData {
  [key: string]: unknown;
}

let sessionInitialized = false;

function getSessionInfo(): SessionInfo {
  return {
    userAgent: navigator.userAgent,
    screenWidth: window.screen.width,
    screenHeight: window.screen.height,
    referrer: document.referrer || 'direct',
  };
}

async function initializeSession(sessionId: string): Promise<void> {
  if (sessionInitialized) return;

  const sessionInfo = getSessionInfo();

  try {
    const { error } = await supabase.from('analytics_sessions').insert({
      session_id: sessionId,
      user_agent: sessionInfo.userAgent,
      screen_width: sessionInfo.screenWidth,
      screen_height: sessionInfo.screenHeight,
      referrer: sessionInfo.referrer,
      consent_given: true,
    });

    if (error && !error.message.includes('duplicate key')) {
      console.error('Failed to initialize session:', error);
    } else {
      sessionInitialized = true;
    }
  } catch (error) {
    console.error('Failed to initialize session:', error);
  }
}

async function updateSessionActivity(sessionId: string): Promise<void> {
  try {
    await supabase
      .from('analytics_sessions')
      .update({ last_activity: new Date().toISOString() })
      .eq('session_id', sessionId);
  } catch (error) {
    console.error('Failed to update session activity:', error);
  }
}

export async function trackPageView(
  pagePath: string,
  pageTitle: string
): Promise<void> {
  if (!hasConsent()) return;

  const sessionId = getOrCreateSessionId();
  if (!sessionId) return;

  await initializeSession(sessionId);
  await updateSessionActivity(sessionId);

  try {
    const { error } = await supabase.from('analytics_page_views').insert({
      session_id: sessionId,
      page_path: pagePath,
      page_title: pageTitle,
    });

    if (error) {
      console.error('Failed to track page view:', error);
    }
  } catch (error) {
    console.error('Failed to track page view:', error);
  }
}

export async function trackEvent(
  eventType: string,
  eventData?: EventData
): Promise<void> {
  if (!hasConsent()) return;

  const sessionId = getSessionId();
  if (!sessionId) return;

  await updateSessionActivity(sessionId);

  try {
    const { error } = await supabase.from('analytics_events').insert({
      session_id: sessionId,
      event_type: eventType,
      event_data: eventData || null,
    });

    if (error) {
      console.error('Failed to track event:', error);
    }
  } catch (error) {
    console.error('Failed to track event:', error);
  }
}

export async function trackEpisodePlay(
  episodeNumber: number,
  episodeTitle: string
): Promise<void> {
  await trackEvent('episode_play', {
    episode_number: episodeNumber,
    episode_title: episodeTitle,
  });
}

export async function trackNewsletterSignup(email: string): Promise<void> {
  await trackEvent('newsletter_signup', {
    email_domain: email.split('@')[1],
  });
}

export async function trackPlatformClick(platform: string, url: string): Promise<void> {
  await trackEvent('platform_click', {
    platform,
    url,
  });
}

export async function trackLinkClick(
  linkTitle: string,
  linkUrl: string
): Promise<void> {
  await trackEvent('link_click', {
    link_title: linkTitle,
    link_url: linkUrl,
  });
}
