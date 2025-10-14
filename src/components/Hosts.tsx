import { hosts } from '../data/content';

export default function Hosts() {
  return (
    <section id="hosts" className="relative py-14 sm:py-16 md:py-20 border-b border-white/5">
      <div className="mx-auto w-full max-w-7xl px-6 md:px-8">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-white">
          Die Köpfe hinter dem Mikrofon
        </h2>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8 reveal-on-scroll">
          {hosts.map((host) => (
            <div
              key={host.id}
              className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 hover:border-cyan-400/40 transition"
            >
              <div className="flex items-center gap-5">
                <img
                  src={host.image}
                  alt={host.name}
                  className="h-20 w-20 rounded-full object-cover ring-2 ring-cyan-400/30"
                />
                <div>
                  <div className="text-white/95 font-medium">{host.name}</div>
                  <div className="text-xs text-slate-400">{host.role}</div>
                </div>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-slate-300">
                {host.bio}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
