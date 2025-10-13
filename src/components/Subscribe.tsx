import { ArrowUpRight } from 'lucide-react';
import * as Icons from 'lucide-react';
import { platforms } from '../data/content';

export default function Subscribe() {
  const getIcon = (iconName: string) => {
    const Icon = Icons[iconName.charAt(0).toUpperCase() + iconName.slice(1) as keyof typeof Icons] as any;
    return Icon ? <Icon className="h-5 w-5 text-cyan-300" /> : null;
  };

  return (
    <section id="subscribe" className="relative py-14 sm:py-16 md:py-20 border-b border-white/3">
      <div className="mx-auto w-full max-w-7xl px-6 md:px-8">
        <h2 className="text-center text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-white">
          Jetzt reinhören und abonnieren
        </h2>

        <div className="mt-8 md:mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 reveal-on-scroll">
          {platforms.map((platform) => (
            <a
              key={platform.id}
              href={platform.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative flex items-center gap-3 rounded-xl border border-cyan-400/25 bg-white/[0.02] px-4 py-4 hover:bg-white/[0.04] hover:border-cyan-400/60 transition-colors"
            >
              <div className="flex h-11 w-11 flex-none items-center justify-center rounded-lg bg-cyan-400/10 ring-1 ring-inset ring-cyan-400/30 group-hover:ring-cyan-300/60 transition">
                {getIcon(platform.icon)}
              </div>
              <div className="min-w-0">
                <div className="text-white/95 font-medium">{platform.name}</div>
                <div className="text-xs text-slate-400">{platform.description}</div>
              </div>
              <ArrowUpRight className="ml-auto h-4 w-4 text-cyan-300 opacity-80 group-hover:opacity-100" />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
