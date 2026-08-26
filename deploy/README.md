# Deployment auf den eigenen VPS

Die Site ist ein statisches Vite/React-Bundle. Es laeuft **kein** Node-Prozess auf
dem Server — nginx liefert nur die Dateien aus `dist/` aus.

Das Backend (Datenbank, Auth, Edge Function `sync-rss-feed`, pg_cron) bleibt bei
**Supabase Cloud** und ist vom Umzug nicht betroffen.

---

## Einmalige Einrichtung

### 1. Lokal: `.env` anlegen

```bash
cp .env.example .env
```

`VITE_SUPABASE_ANON_KEY` aus dem Supabase-Dashboard eintragen
(Project Settings → API → `anon public`).

### 2. VPS vorbereiten

```sh
sudo apt update && sudo apt install -y nginx rsync certbot python3-certbot-nginx
sudo adduser --disabled-password --gecos "" deploy
sudo mkdir -p /var/www/zir
sudo chown -R deploy:deploy /var/www/zir
```

SSH-Key des Deploy-Users hinterlegen (vom eigenen Rechner):

```sh
ssh-copy-id deploy@VPS-IP
```

### 3. nginx konfigurieren

`deploy/nginx/zukunft-ist-relativ.conf` auf den Server kopieren:

```sh
scp deploy/nginx/zukunft-ist-relativ.conf deploy@VPS-IP:/tmp/
```

Auf dem VPS:

```sh
sudo mv /tmp/zukunft-ist-relativ.conf /etc/nginx/sites-available/
sudo ln -s /etc/nginx/sites-available/zukunft-ist-relativ.conf /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl reload nginx
```

### 4. Ersten Build hochladen

```bash
DEPLOY_HOST=VPS-IP ./deploy/deploy.sh
```

### 5. Vor dem DNS-Wechsel testen

Ohne die Domain umzustellen: auf dem eigenen Rechner temporaer in
`/etc/hosts` eintragen —

```
VPS-IP  www.zukunft-ist-relativ.de zukunft-ist-relativ.de
```

Dann im Browser durchklicken. Wichtig sind die Deep-Links, weil die
den SPA-Fallback pruefen:

- `/` und `/episoden`
- `/episode/1` (direkt aufrufen, nicht durchklicken → testet `try_files`)
- `/admin` → Google-Login
- `/robots.txt`, `/sitemap.xml`

Danach den `/etc/hosts`-Eintrag wieder entfernen.

### 6. DNS umstellen

Beim Domain-Provider TTL vorab auf 300s senken, dann:

| Record | Name  | Wert   |
|--------|-------|--------|
| A      | `@`   | VPS-IP |
| A      | `www` | VPS-IP |

(zusaetzlich `AAAA`, falls der VPS IPv6 hat). Alte Bolt-/Netlify-Records loeschen.

### 7. TLS-Zertifikat

Erst **nach** DNS-Propagation (`dig www.zukunft-ist-relativ.de +short`):

```sh
sudo certbot --nginx -d zukunft-ist-relativ.de -d www.zukunft-ist-relativ.de
```

Certbot ergaenzt HTTPS-Redirect und richtet Auto-Renewal ein.

---

## Laufender Betrieb

### Manuell deployen

```bash
DEPLOY_HOST=VPS-IP ./deploy/deploy.sh
```

Bequemer: `deploy/deploy.env` anlegen (ist gitignored):

```bash
DEPLOY_HOST=1.2.3.4
DEPLOY_USER=deploy
```

### Automatisch per GitHub Actions

`.github/workflows/deploy.yml` baut und deployt bei jedem Push auf `main`.
Dafuer unter *Settings → Secrets and variables → Actions* anlegen:

| Secret | Wert |
|--------|------|
| `VITE_SUPABASE_URL` | `https://zjgydlqerspetjmghbst.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | anon key aus Supabase |
| `DEPLOY_HOST` | VPS-IP |
| `DEPLOY_USER` | `deploy` |
| `DEPLOY_PATH` | `/var/www/zir` |
| `DEPLOY_SSH_KEY` | privater SSH-Key (ohne Passphrase) |
| `DEPLOY_KNOWN_HOSTS` | Ausgabe von `ssh-keyscan VPS-IP` |

Deploy-Key erzeugen:

```bash
ssh-keygen -t ed25519 -C "github-actions-deploy" -f ~/.ssh/zir_deploy -N ""
```

Public Key (`~/.ssh/zir_deploy.pub`) in `/home/deploy/.ssh/authorized_keys`
auf dem VPS eintragen, privaten Key als `DEPLOY_SSH_KEY` hinterlegen.

---

## Bolt abschalten

Erst wenn die Seite ueber den VPS laeuft und das Zertifikat steht:

1. In Bolt die GitHub-Verbindung zu `herbtobias/podcast-website` trennen —
   sonst pusht Bolt weiter auf `main` und loest damit Deploys aus.
2. Bolt-Hosting/Deployment deaktivieren.
3. In Supabase → Authentication → URL Configuration pruefen, dass unter
   *Site URL* und *Redirect URLs* nur noch `https://www.zukunft-ist-relativ.de`
   steht und alte Bolt-/Netlify-Preview-URLs entfernt sind.

Ab dann ist der Ablauf: lokal editieren → Push auf `main` → Action deployt.
