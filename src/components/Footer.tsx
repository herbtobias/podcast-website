import { X, Mail } from "lucide-react";
import { useState } from "react";
import Impressum from "./Impressum";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [isImpressumOpen, setIsImpressumOpen] = useState(false);

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
            <a
              href="#"
              className="text-sm text-slate-400 hover:text-cyan-300 hover:underline underline-offset-4"
            >
              Kontakt
            </a>
            <button
              onClick={() => setIsImpressumOpen(true)}
              className="text-sm text-slate-400 hover:text-cyan-300 hover:underline underline-offset-4"
            >
              Impressum
            </button>
            <div className="h-4 w-px bg-white/10 mx-1"></div>
            <div className="flex items-center gap-3">
              <a
                href="#"
                aria-label="Twitter"
                className="text-cyan-300/80 hover:text-cyan-300 transition"
              >
                <X className="h-5 w-5" />
              </a>
              <a
                href="#"
                aria-label="E-Mail"
                className="text-cyan-300/80 hover:text-cyan-300 transition"
              >
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
      <Impressum
        isOpen={isImpressumOpen}
        onClose={() => setIsImpressumOpen(false)}
      />
    </footer>
  );
}
