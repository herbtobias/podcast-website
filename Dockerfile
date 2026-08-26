# syntax=docker/dockerfile:1

# ---------------------------------------------------------------------------
# Build-Stage: Vite-Bundle erzeugen
# ---------------------------------------------------------------------------
FROM node:22-alpine AS build

WORKDIR /app

# Erst nur die Manifeste kopieren, damit der npm-ci-Layer im Cache bleibt,
# solange sich die Dependencies nicht aendern.
COPY package.json package-lock.json ./
RUN npm ci

# WICHTIG: Vite ersetzt import.meta.env.* zur BUILD-Zeit durch feste Strings.
# Die Werte muessen also hier anliegen - als Runtime-Env im fertigen Container
# haetten sie keinerlei Wirkung mehr.
# In Coolify dafuer bei beiden Variablen "Build Variable" aktivieren.
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_ANON_KEY
ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL \
    VITE_SUPABASE_ANON_KEY=$VITE_SUPABASE_ANON_KEY

COPY . .

# Sitemap aus den Episoden in Supabase erzeugen. Wenn das fehlschlaegt
# (Supabase nicht erreichbar, Variablen fehlen), faellt der Build auf die
# eingecheckte public/sitemap.xml zurueck, statt den Deploy abzubrechen.
RUN npm run generate-sitemap \
    || echo ">>> WARNUNG: Sitemap-Generierung fehlgeschlagen - nutze eingecheckte public/sitemap.xml"

# --ignore-scripts unterdrueckt das prebuild-Hook, das sonst die Sitemap
# ein zweites Mal (und dann ohne Fallback) erzeugen wuerde.
RUN npm run build --ignore-scripts

# ---------------------------------------------------------------------------
# Runtime-Stage: nginx als reiner Fileserver
# ---------------------------------------------------------------------------
FROM nginx:1.27-alpine AS runtime

COPY deploy/nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget -qO- http://127.0.0.1/healthz >/dev/null 2>&1 || exit 1

CMD ["nginx", "-g", "daemon off;"]
