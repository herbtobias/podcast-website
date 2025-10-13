import { useState } from 'react';
import { Mail, ArrowRight } from 'lucide-react';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(true);
    setEmail('');
  };

  return (
    <section id="newsletter" className="relative py-14 sm:py-16 md:py-20 border-b border-white/5">
      <div className="mx-auto w-full max-w-7xl px-6 md:px-8">
        <div className="relative overflow-hidden rounded-2xl border border-cyan-400/30 bg-card-bg/60 p-6 sm:p-10 backdrop-blur reveal-on-scroll">
          <div className="absolute -right-24 -top-24 h-48 w-48 rounded-full bg-cyan-500/10 blur-2xl"></div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-white">
            Bleib relativ auf dem Laufenden
          </h2>
          <p className="mt-3 max-w-2xl text-slate-300">
            Abonniere den wöchentlichen Newsletter für exklusive Einblicke, Leseempfehlungen und Behind-the-Scenes-Material.
          </p>

          <form className="mt-6" onSubmit={handleSubmit}>
            <div className="mx-auto max-w-xl flex flex-col sm:flex-row items-center gap-3">
              <div className="relative w-full">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="E-Mail-Adresse"
                  aria-label="E-Mail-Adresse"
                  className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-slate-100 placeholder:text-slate-500 outline-none focus:border-cyan-400/70 focus:ring-2 focus:ring-cyan-400/40 transition"
                />
                <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                  <Mail className="h-4 w-4 text-slate-500" />
                </div>
              </div>
              <button
                type="submit"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-500 px-5 py-3 text-slate-900 font-medium hover:bg-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/60 transition shadow-[0_0_0_1px_rgba(34,211,238,0.4),0_10px_30px_rgba(34,211,238,0.25)]"
              >
                Jetzt abonnieren
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
            {success && (
              <p className="mt-4 text-sm text-cyan-300">
                Danke! Bitte prüfe dein Postfach und bestätige deine Anmeldung.
              </p>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}
