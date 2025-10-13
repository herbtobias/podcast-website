import { Twitter, Github, Mail } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative py-10">
      <div className="mx-auto w-full max-w-7xl px-6 md:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/10 pt-6">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-white/[0.03] ring-1 ring-white/10 text-cyan-300 font-semibold tracking-tight">
              ZR
            </div>
            <div className="text-xs text-slate-500">
              © {currentYear} Zukunft ist relativ
            </div>
          </div>
          <div className="flex items-center gap-5">
            <a href="#" className="text-sm text-slate-400 hover:text-cyan-300 hover:underline underline-offset-4">
              Kontakt
            </a>
            <a href="#" className="text-sm text-slate-400 hover:text-cyan-300 hover:underline underline-offset-4">
              Impressum
            </a>
            <div className="h-4 w-px bg-white/10 mx-1"></div>
            <div className="flex items-center gap-3">
              <a href="#" aria-label="Twitter" className="text-cyan-300/80 hover:text-cyan-300 transition">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" aria-label="GitHub" className="text-cyan-300/80 hover:text-cyan-300 transition">
                <Github className="h-5 w-5" />
              </a>
              <a href="#" aria-label="E-Mail" className="text-cyan-300/80 hover:text-cyan-300 transition">
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
