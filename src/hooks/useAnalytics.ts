import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { trackPageView } from '../lib/analytics';

export function useAnalytics() {
  const location = useLocation();

  useEffect(() => {
    const pageTitle = document.title;
    const pagePath = location.pathname + location.search;

    trackPageView(pagePath, pageTitle);
  }, [location]);
}
