import { useEffect } from 'react';
import { Mail, ArrowRight } from 'lucide-react';

export default function Newsletter() {
  useEffect(() => {
    // Load Brevo form script
    const script = document.createElement('script');
    script.src = 'https://sibforms.com/forms/end-form/build/main.js';
    script.defer = true;
    document.body.appendChild(script);

    // Set up Brevo configuration
    (window as any).REQUIRED_CODE_ERROR_MESSAGE = 'Wähle bitte einen Ländervorwahl aus.';
    (window as any).LOCALE = 'de';
    (window as any).EMAIL_INVALID_MESSAGE = "Die eingegebenen Informationen sind nicht gültig. Bitte überprüfe das Feldformat und versuche es erneut.";
    (window as any).REQUIRED_ERROR_MESSAGE = "Dieses Feld darf nicht leer sein. ";
    (window as any).GENERIC_INVALID_MESSAGE = "Die eingegebenen Informationen sind nicht gültig. Bitte überprüfe das Feldformat und versuche es erneut.";
    (window as any).translation = {
      common: {
        selectedList: '{quantity} Liste ausgewählt',
        selectedLists: '{quantity} Listen ausgewählt',
        selectedOption: '{quantity} ausgewählt',
        selectedOptions: '{quantity} ausgewählt',
      }
    };
    (window as any).AUTOHIDE = Boolean(0);

    return () => {
      if (script.parentNode) {
        document.body.removeChild(script);
      }
    };
  }, []);

  return (
    <section id="newsletter" className="relative py-14 sm:py-16 md:py-20 border-b border-white/5">
      <div className="mx-auto w-full max-w-7xl px-6 md:px-8">
        <div className="relative overflow-hidden rounded-2xl border border-cyan-400/30 bg-card-bg/60 p-6 sm:p-10 backdrop-blur reveal-on-scroll">
          <div className="absolute -right-24 -top-24 h-48 w-48 rounded-full bg-cyan-500/10 blur-2xl"></div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-white">
            Newsletter
          </h2>
          <p className="mt-3 max-w-2xl text-slate-300">
            Melde dich zu unserem Newsletter an, um auf dem Laufenden zu bleiben.
          </p>

          {/* Brevo Form Integration */}
          <div className="mt-6 brevo-form-wrapper">
            <div id="sib-form-container" className="sib-form-container">
              <div
                id="error-message"
                className="hidden mb-4 rounded-xl border border-red-400/50 bg-red-900/20 p-4 text-sm text-red-300"
              >
                <div className="sib-form-message-panel__text">
                  <span className="sib-form-message-panel__inner-text">
                    Deine Anmeldung konnte nicht gespeichert werden. Bitte versuche es erneut.
                  </span>
                </div>
              </div>

              <div
                id="success-message"
                className="hidden mb-4 rounded-xl border border-cyan-400/50 bg-cyan-900/20 p-4 text-sm text-cyan-300"
              >
                <div className="sib-form-message-panel__text">
                  <span className="sib-form-message-panel__inner-text">
                    Deine Anmeldung war erfolgreich.
                  </span>
                </div>
              </div>

              <form
                id="sib-form"
                method="POST"
                action="https://4674c2ba.sibforms.com/serve/MUIFADZ1xqn8NG69X3Fxe7WLc-NTAyq7dqGEgiZauy9Y594spNEwWdP8AQHE2noh64aJlm14OouUCsp9qEKbmy39z-lt3KadFYMrAkPh-JFPX92V1VWsmiTiU3zDlVTCPveGy2laFCgu59xIq9BhAarVO4FxJnOdC4PQVp61kSWapyiNLSINNt8BPY_CioAdHlHJmyGcjWNORfghrA=="
                data-type="subscription"
                target="_blank"
              >
                <div className="mx-auto max-w-xl">
                  {/* Email Input */}
                  <div className="sib-input sib-form-block mb-4">
                    <div className="form__entry entry_block">
                      <div className="form__label-row">
                        <label
                          className="block text-sm font-medium text-slate-300 mb-2"
                          htmlFor="EMAIL"
                        >
                          E-Mail-Adresse
                        </label>
                        <div className="entry__field relative">
                          <input
                            className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-slate-100 placeholder:text-slate-500 outline-none focus:border-cyan-400/70 focus:ring-2 focus:ring-cyan-400/40 transition"
                            type="email"
                            id="EMAIL"
                            name="EMAIL"
                            autoComplete="off"
                            placeholder="deine@email.de"
                            data-required="true"
                            required
                          />
                          <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                            <Mail className="h-4 w-4 text-slate-500" />
                          </div>
                        </div>
                        <label className="entry__error entry__error--primary hidden mt-2 text-xs text-red-400"></label>
                      </div>
                    </div>
                  </div>

                  {/* Opt-in Checkbox */}
                  <div className="sib-optin sib-form-block mb-6" data-required="true">
                    <div className="form__entry entry_mcq">
                      <div className="form__label-row">
                        <div className="entry__choice flex items-start gap-3">
                          <input
                            type="checkbox"
                            className="mt-1 h-4 w-4 rounded border-white/10 bg-white/[0.03] text-cyan-500 focus:ring-2 focus:ring-cyan-400/40 focus:ring-offset-0 transition cursor-pointer"
                            value="1"
                            id="OPT_IN"
                            name="OPT_IN"
                            required
                          />
                          <label htmlFor="OPT_IN" className="text-sm text-slate-300 cursor-pointer">
                            Ich möchte deinen Newsletter erhalten und akzeptiere die Datenschutzerklärung.
                          </label>
                        </div>
                        <label className="entry__error entry__error--primary hidden mt-2 text-xs text-red-400"></label>
                        <div className="entry__specification mt-2 text-xs text-slate-500">
                          Du kannst den Newsletter jederzeit über den Link in unserem Newsletter abbestellen.
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="sib-form-block">
                    <button
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-500 px-6 py-3 text-slate-900 font-medium hover:bg-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/60 transition shadow-[0_0_0_1px_rgba(34,211,238,0.4),0_10px_30px_rgba(34,211,238,0.25)]"
                      form="sib-form"
                      type="submit"
                    >
                      <span>Jetzt anmelden</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <input type="text" name="email_address_check" value="" className="hidden" />
                <input type="hidden" name="locale" value="de" />
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
