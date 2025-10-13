import { ChevronDown } from 'lucide-react';
import GalaxyBackground from './GalaxyBackground';
import TextPressure from './TextPressure';

export default function Hero() {
  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center">
      <GalaxyBackground />

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -left-24 top-24 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl"></div>
        <div className="absolute right-[-10%] bottom-10 h-80 w-80 rounded-full bg-cyan-400/10 blur-3xl"></div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-b from-transparent via-page-bg/50 to-page-bg pointer-events-none"></div>

      <div className="w-full z-10 relative px-6 md:px-8">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300/80 backdrop-blur">
            <span className="inline-flex h-1.5 w-1.5 rounded-full bg-cyan-400 shadow-[0_0_16px_rgba(34,211,238,0.8)]"></span>
            Neue Folgen jeden Dienstag
          </div>
          <h1 className="mt-6 text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-semibold tracking-tight text-white break-words leading-tight">
            <TextPressure text="Zukunft ist relativ" />
          </h1>
          <p className="mt-5 text-base sm:text-lg md:text-xl text-slate-400 max-w-2xl mx-auto">
            Der Podcast über KI, Quanten und die seltsamen Wege des Fortschritts.
          </p>
        </div>
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 text-xs text-slate-500 z-10">
        <ChevronDown className="h-4 w-4 animate-bounce" />
        <span className="hidden sm:block">Scroll für mehr</span>
      </div>
    </section>
  );
}
