import { PlayCircle, Rss, Star } from "lucide-react";
import { listenerAvatars } from "../data/content";

export default function HeroContent() {
  const handleScrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="relative py-20 border-b border-white/5 bg-page-bg">
      <div className="mx-auto w-full max-w-7xl px-6 md:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => handleScrollTo("episode")}
              className="group inline-flex items-center gap-2 rounded-full bg-cyan-500 px-4 py-2 text-slate-900 font-medium hover:bg-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/60 transition shadow-[0_0_0_1px_rgba(34,211,238,0.4),0_10px_30px_rgba(34,211,238,0.25)]"
            >
              <PlayCircle className="h-5 w-5" />
              Jetzt abspielen
            </button>
            <button
              onClick={() => handleScrollTo("subscribe")}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.02] px-4 py-2 text-slate-200 hover:border-cyan-400/50 hover:text-cyan-200 focus:outline-none focus:ring-2 focus:ring-cyan-400/40 transition"
            >
              <Rss className="h-5 w-5" />
              Abonnieren
            </button>
            {/* <div className="ml-1 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.02] px-3 py-1.5 text-xs text-slate-300">
              <Star className="h-4 w-4 text-amber-300" />
              4.8 · 1.2k Bewertungen
            </div> */}
          </div>

          {/* <div className="mt-5 flex items-center justify-center gap-3">
            <div className="flex -space-x-3">
              {listenerAvatars.map((avatar, index) => (
                <img
                  key={index}
                  src={avatar}
                  alt={`Hörer ${index + 1}`}
                  className="h-7 w-7 rounded-full object-cover ring-2 ring-cyan-400/20"
                />
              ))}
            </div> */}
            {/* <div className="text-xs text-slate-400">
              Über 50k Hörer:innen monatlich
            </div> */}
          {/* </div> */}
        </div>
      </div>
    </section>
  );
}
