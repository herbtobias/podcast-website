import React, { useState } from "react";
import { revokeConsent, getConsentStatus } from "../lib/cookieConsent";

interface ImpressumProps {
  isOpen: boolean;
  onClose: () => void;
}

const Impressum: React.FC<ImpressumProps> = ({ isOpen, onClose }) => {
  const [isAccordionOpen, setIsAccordionOpen] = useState(false);
  const [cookieAccordionOpen, setCookieAccordionOpen] = useState(false);
  const [consentRevoked, setConsentRevoked] = useState(false);

  const handleRevokeConsent = () => {
    revokeConsent();
    setConsentRevoked(true);
    setTimeout(() => setConsentRevoked(false), 3000);
  };

  if (!isOpen) return null;

  const consentStatus = getConsentStatus();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-slate-800 text-white p-8 rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">Impressum</h2>
        <p className="mb-2">Angaben gemäß § 5 TMG</p>
        <p>Tobias Herb</p>
        <p>Prozessionsweg 17</p>
        <p>69226 Nußloch</p>
        <h3 className="text-xl font-bold mt-4 mb-2">Kontakt</h3>
        <p>Telefon: 0176-61370317</p>
        <p>
          E-Mail:{" "}
          <a href="mailto:zukunft-ist-relativ@gmail.com">
            zukunft-ist-relativ@gmail.com
          </a>
        </p>

        <div className="mt-6">
          <button
            onClick={() => setCookieAccordionOpen(!cookieAccordionOpen)}
            className="w-full text-left text-xl font-bold mb-2 flex justify-between items-center"
          >
            <span>Cookie-Einstellungen & Analytics</span>
            <span>{cookieAccordionOpen ? "−" : "+"}</span>
          </button>
          {cookieAccordionOpen && (
            <div className="text-sm space-y-4 pr-4">
              <div>
                <p className="mb-2">
                  <strong>Aktueller Status:</strong>{" "}
                  {consentStatus === "accepted" && (
                    <span className="text-green-400">Cookies akzeptiert</span>
                  )}
                  {consentStatus === "declined" && (
                    <span className="text-red-400">Cookies abgelehnt</span>
                  )}
                  {consentStatus === "pending" && (
                    <span className="text-yellow-400">Noch keine Entscheidung getroffen</span>
                  )}
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Was wir tracken</h4>
                <p className="mb-2">
                  Wir nutzen ein selbst-gehostetes Analytics-System, um die Nutzung unserer Website zu verstehen und zu verbessern.
                  Dabei werden folgende Daten erfasst:
                </p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Besuchte Seiten und Seitentitel</li>
                  <li>Zeitpunkt des Besuchs</li>
                  <li>Browser-Typ und Bildschirmauflösung</li>
                  <li>Herkunft (Referrer-URL)</li>
                  <li>Interaktionen (z.B. Episode-Wiedergabe, Klicks auf externe Links)</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Datenschutz</h4>
                <p className="mb-2">
                  Alle Daten werden ausschließlich auf unseren eigenen Servern (Supabase) gespeichert und
                  niemals an Dritte weitergegeben. Es werden keine personenbezogenen Daten wie IP-Adressen
                  oder Namen gespeichert. Die Datenerfassung erfolgt komplett anonymisiert über eine zufällig
                  generierte Session-ID.
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Cookies</h4>
                <p className="mb-2">
                  Wir verwenden einen Cookie mit dem Namen <code className="bg-slate-700 px-1 py-0.5 rounded">zir_session_id</code>,
                  der eine zufällig generierte Session-ID speichert. Dieser Cookie hat eine Laufzeit von 365 Tagen
                  und dient ausschließlich dazu, Besuche über mehrere Sitzungen hinweg zu erkennen.
                </p>
              </div>

              <div className="bg-slate-700/50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Einwilligung widerrufen</h4>
                <p className="mb-3">
                  Du kannst deine Einwilligung zur Nutzung von Cookies jederzeit widerrufen.
                  Alle gespeicherten Cookies werden dann gelöscht und es werden keine weiteren Daten erfasst.
                </p>
                <button
                  onClick={handleRevokeConsent}
                  className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded transition"
                >
                  Cookie-Einwilligung widerrufen
                </button>
                {consentRevoked && (
                  <p className="mt-2 text-green-400">
                    Deine Einwilligung wurde widerrufen und alle Cookies wurden gelöscht.
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        <div>
          <button
            onClick={() => setIsAccordionOpen(!isAccordionOpen)}
            className="w-full text-left text-xl font-bold mt-4 mb-2 flex justify-between items-center"
          >
            <span>Haftungsausschluss & Datenschutz</span>
            <span>{isAccordionOpen ? "−" : "+"}</span>
          </button>
          {isAccordionOpen && (
            <div className="text-sm max-h-60 overflow-y-auto pr-4">
              <p>
                Haftungsausschluss: Haftung für Inhalte Die Inhalte unserer Seiten
                wurden mit größter Sorgfalt erstellt. Für die Richtigkeit,
                Vollständigkeit und Aktualität der Inhalte können wir jedoch keine
                Gewähr übernehmen. Als Diensteanbieter sind wir gemäß § 7 Abs.1 DDG
                für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen
                verantwortlich. Nach §§ 8 bis 10 DDG sind wir als Diensteanbieter
                jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde
                Informationen zu überwachen oder nach Umständen zu forschen, die auf
                eine rechtswidrige Tätigkeit hinweisen. Verpflichtungen zur
                Entfernung oder Sperrung der Nutzung von Informationen nach den
                allgemeinen Gesetzen bleiben hiervon unberührt. Eine diesbezügliche
                Haftung ist jedoch erst ab dem Zeitpunkt der Kenntnis einer
                konkreten Rechtsverletzung möglich. Bei Bekanntwerden von
                entsprechenden Rechtsverletzungen werden wir diese Inhalte umgehend
                entfernen. Haftung für Links Unser Angebot enthält Links zu externen
                Webseiten Dritter, auf deren Inhalte wir keinen Einfluss haben.
                Deshalb können wir für diese fremden Inhalte auch keine Gewähr
                übernehmen. Für die Inhalte der verlinkten Seiten ist stets der
                jeweilige Anbieter oder Betreiber der Seiten verantwortlich. Die
                verlinkten Seiten wurden zum Zeitpunkt der Verlinkung auf mögliche
                Rechtsverstöße überprüft. Rechtswidrige Inhalte waren zum Zeitpunkt
                der Verlinkung nicht erkennbar. Eine permanente inhaltliche
                Kontrolle der verlinkten Seiten ist jedoch ohne konkrete
                Anhaltspunkte einer Rechtsverletzung nicht zumutbar. Bei
                Bekanntwerden von Rechtsverletzungen werden wir derartige Links
                umgehend entfernen. Datenschutz Die Nutzung unserer Webseite ist in
                der Regel ohne Angabe personenbezogener Daten möglich. Soweit auf
                unseren Seiten personenbezogene Daten (beispielsweise Name,
                Anschrift oder eMail-Adressen) erhoben werden, erfolgt dies, soweit
                möglich, stets auf freiwilliger Basis. Diese Daten werden ohne Ihre
                ausdrückliche Zustimmung nicht an Dritte weitergegeben. Wir weisen
                darauf hin, dass die Datenübertragung im Internet (z.B. bei der
                Kommunikation per E-Mail) Sicherheitslücken aufweisen kann. Ein
                lückenloser Schutz der Daten vor dem Zugriff durch Dritte ist nicht
                möglich. Der Nutzung von im Rahmen der Impressumspflicht
                veröffentlichten Kontaktdaten durch Dritte zur Übersendung von nicht
                ausdrücklich angeforderter Werbung und Informationsmaterialien wird
                hiermit ausdrücklich widersprochen. Die Betreiber der Seiten
                behalten sich ausdrücklich rechtliche Schritte im Falle der
                unverlangten Zusendung von Werbeinformationen, etwa durch
                Spam-Mails, vor.
              </p>
            </div>
          )}
        </div>
        <button
          onClick={onClose}
          className="mt-6 bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-2 px-4 rounded"
        >
          Schließen
        </button>
      </div>
    </div>
  );
};

export default Impressum;
