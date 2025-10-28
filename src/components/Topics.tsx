import { Hash } from 'lucide-react';
import * as Icons from 'lucide-react';
import { topics } from '../data/content';

export default function Topics() {
  const getIcon = (iconName: string) => {
    const Icon = Icons[iconName.charAt(0).toUpperCase() + iconName.slice(1) as keyof typeof Icons] as any;
    return Icon ? <Icon className="h-5 w-5 text-cyan-300" /> : null;
  };

  return (
    <section id="topics" className="relative py-14 sm:py-16 md:py-20 border-b border-white/5">
      <div className="mx-auto w-full max-w-7xl px-6 md:px-8">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-white">
          Worüber wir relativ gerne sprechen
        </h2>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 reveal-on-scroll">
          {topics.map((topic) => (
            <article
              key={topic.id}
              className="group relative overflow-hidden rounded-2xl border border-cyan-400/30 bg-white/[0.02] p-6 hover:border-cyan-300/60 transition"
            >
              <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-cyan-500/10 blur-2xl"></div>
              <header className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-cyan-400/10 ring-1 ring-inset ring-cyan-400/30" aria-hidden="true">
                  {getIcon(topic.icon)}
                </div>
                <h3 className="text-lg font-medium text-white/95">{topic.title}</h3>
              </header>
              <p className="mt-3 text-sm leading-relaxed text-slate-300">
                {topic.description}
              </p>
              <div className="mt-4 flex items-center gap-2 text-xs text-slate-400">
                <Hash className="h-4 w-4" />
                {topic.tags.join(', ')}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
