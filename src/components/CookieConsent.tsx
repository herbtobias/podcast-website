import { useState, useEffect } from 'react';
import { Cookie } from 'lucide-react';
import { getConsentStatus, setConsentStatus } from '../lib/cookieConsent';

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const status = getConsentStatus();
    if (status === 'pending') {
      setTimeout(() => {
        setIsVisible(true);
        setIsAnimating(true);
      }, 1000);
    }
  }, []);

  const handleAccept = () => {
    setConsentStatus('accepted');
    setIsAnimating(false);
    setTimeout(() => setIsVisible(false), 300);
  };

  const handleDecline = () => {
    setConsentStatus('declined');
    setIsAnimating(false);
    setTimeout(() => setIsVisible(false), 300);
  };

  if (!isVisible) return null;

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-50 transition-transform duration-300 ${
        isAnimating ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="relative rounded-2xl border border-white/10 bg-slate-900/95 backdrop-blur-xl shadow-2xl">
          <div className="flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-start gap-4 flex-1">
              <div className="flex-shrink-0 mt-1">
                <Cookie className="h-6 w-6 text-cyan-400" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-white mb-2">
                  Cookie-Einstellungen
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Wir verwenden Cookies, um die Nutzung unserer Website zu analysieren und zu verbessern.
                  Alle Daten werden anonymisiert und ausschließlich auf unseren eigenen Servern gespeichert.
                  Du kannst deine Zustimmung jederzeit im Impressum widerrufen.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 md:flex-shrink-0">
              <button
                onClick={handleDecline}
                className="px-6 py-2.5 rounded-lg border border-white/20 text-white font-medium hover:bg-white/5 transition-all"
              >
                Ablehnen
              </button>
              <button
                onClick={handleAccept}
                className="px-6 py-2.5 rounded-lg bg-cyan-500 text-slate-900 font-medium hover:bg-cyan-400 transition-all shadow-lg shadow-cyan-500/25"
              >
                Akzeptieren
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
