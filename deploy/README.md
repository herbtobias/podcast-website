# Deployment via Docker auf Coolify

Die Site ist ein statisches Vite/React-Bundle. Der Container baut es und liefert
es mit nginx aus — es laeuft **kein** Node-Prozess im Betrieb.

Das Backend (Datenbank, Auth, Edge Function `sync-rss-feed`, pg_cron) bleibt bei
**Supabase Cloud** und ist vom Umzug nicht betroffen.

TLS, Zertifikate und Domain-Routing macht Coolify mit Traefik vor dem Container.
Deshalb hoert nginx im Container nur auf Port 80 ohne TLS.

---

## Der eine Punkt, an dem es sonst scheitert

Vite ersetzt `import.meta.env.VITE_*` **zur Build-Zeit** durch feste Strings.
Als normale Runtime-Variablen im Container haben sie keinerlei Wirkung — die
Seite laedt dann, wirft aber sofort `Missing Supabase environment variables`.

In Coolify muessen bei beiden Variablen deshalb **„Build Variable"** aktiviert
sein. Im Dockerfile stehen sie als `ARG`.

---

## Setup in Coolify

### 1. Ressource anlegen

*New Resource* → **Public Repository** (oder GitHub App, wenn du Auto-Deploy
bei jedem Push willst)

| Feld | Wert |
|---|---|
| Repository | `https://github.com/herbtobias/podcast-website` |
| Branch | `main` |
| Build Pack | **Dockerfile** |
| Dockerfile Location | `/Dockerfile` |
| Ports Exposes | `80` |

### 2. Environment Variables

Beide mit aktivem **Build Variable**-Haken:

| Name | Wert |
|---|---|
| `VITE_SUPABASE_URL` | `https://zjgydlqerspetjmghbst.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | anon key aus Supabase → Project Settings → API |

Der anon key ist kein Geheimnis — er landet ohnehin im Client-Bundle und ist
im Browser lesbar. Abgesichert wird der Zugriff ueber Row Level Security in
Supabase, nicht ueber den Key. Deshalb ist auch die Docker-Build-Warnung
`SecretsUsedInArgOrEnv` hier unkritisch.

### 3. Domains

Ins FQDN-Feld **beide** Domains eintragen:

```
https://www.zukunft-ist-relativ.de,https://zukunft-ist-relativ.de
```

Beide muessen dort stehen, sonst routet Traefik die nackte Domain gar nicht
erst zum Container — und der Apex→www-Redirect in `deploy/nginx/default.conf`
wuerde nie greifen. Coolify holt fuer beide ein Let's-Encrypt-Zertifikat.

### 4. Healthcheck

Der Container bringt einen Endpoint mit, den Coolify fuer Zero-Downtime-Deploys
nutzen kann:

| Feld | Wert |
|---|---|
| Path | `/healthz` |
| Port | `80` |

### 5. DNS

Beim Domain-Provider TTL vorab auf 300s senken, dann:

| Record | Name | Wert |
|---|---|---|
| A | `@` | IP des Coolify-Servers |
| A | `www` | IP des Coolify-Servers |

Zusaetzlich `AAAA`, falls der Server IPv6 hat. Alte Bolt-/Netlify-Records loeschen.

### 6. Deploy

*Deploy* klicken. Mit GitHub App deployt Coolify danach bei jedem Push auf
`main` automatisch.

---

## Lokal testen

```bash
cp .env.example .env      # anon key eintragen
docker compose up --build
```

→ http://localhost:8080

Was dabei wichtig ist zu pruefen (das sind die Dinge, die ein statischer
Fileserver typischerweise falsch macht):

| Test | Erwartung |
|---|---|
| `/` | 200 |
| `/episode/12` **direkt aufrufen** | 200, nicht 404 — prueft den SPA-Fallback |
| `/admin` direkt aufrufen | 200 |
| `/healthz` | `ok` |
| `curl -I -H 'Host: zukunft-ist-relativ.de' localhost:8080/` | 301 auf www |
| `/robots.txt`, `/sitemap.xml` | 200 |

---

## Wie der Build funktioniert

`Dockerfile`, zwei Stages:

1. **build** (`node:22-alpine`) — `npm ci`, Sitemap generieren, `npm run build`
2. **runtime** (`nginx:1.27-alpine`) — nur `dist/` + `deploy/nginx/default.conf`

Ergebnis: ~52 MB Image, kein Node zur Laufzeit.

### Sitemap

`npm run generate-sitemap` zieht die Episoden aus Supabase und schreibt
`public/sitemap.xml`. Im Dockerfile ist der Schritt **bewusst nicht fatal**:
faellt Supabase beim Build aus, wird die eingecheckte `public/sitemap.xml`
verwendet statt den ganzen Deploy abzubrechen.

Deshalb laeuft der eigentliche Build danach mit `npm run build --ignore-scripts`
— sonst wuerde das `prebuild`-Hook die Sitemap ein zweites Mal erzeugen, dann
ohne diesen Fallback.

### nginx

Die drei Dinge, die in `deploy/nginx/default.conf` wirklich zaehlen:

- **`try_files $uri $uri/ /index.html`** — Ersatz fuer Bolts `_redirects`.
  Ohne das geben alle Deep-Links beim Direktaufruf 404.
- **`index.html` mit `no-cache`, `/assets/` mit `immutable`** — sonst haengen
  Besucher nach einem Deploy auf einer alten `index.html`, die auf nicht mehr
  existierende Asset-Hashes zeigt.
- **`/healthz` als eigene location** — muss vor dem www-Redirect stehen, weil
  der Healthcheck ueber `127.0.0.1` kommt und nicht ueber die echte Domain.

---

## Bolt abschalten

Erst wenn die Seite ueber Coolify laeuft und das Zertifikat steht:

1. In Bolt die GitHub-Verbindung zu `herbtobias/podcast-website` trennen —
   sonst pusht Bolt weiter auf `main` und loest damit Deploys aus.
2. Bolt-Hosting/Deployment deaktivieren.
3. Supabase → Authentication → URL Configuration: unter *Site URL* und
   *Redirect URLs* darf nur noch `https://www.zukunft-ist-relativ.de` stehen,
   alte Bolt-/Netlify-Preview-URLs entfernen. Sonst bricht der Google-Login
   im Admin-Bereich.
