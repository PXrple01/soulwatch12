# Übergabe für eine neue Session – Josefines ♥ Johanns Watchlist

Stand: 18.11.2026. Ausführliche Feature-Doku: `uebergabe.md` (immer zuerst lesen, dort steht jedes Update mit Details).

## 1. Was das Projekt ist
- Private PWA-Watchlist für zwei Personen (Josefine = `jos`, Johann = `joh`, gemeinsam = `both`), Sprache Deutsch.
- **Eine einzige HTML-Datei** `index.html` (~6,2 MB, Vanilla JS/CSS, Daten inline). `watchlist.html` ist eine identische Kopie (`cp index.html watchlist.html` nach jeder Änderung).
- Bereiche: Animes, Filme, Serien. Katalog: 4.697 aktive Filme, 2.835 Serien, 2.550 Animes (Arrays `FILMS`, `SERIES`, `ANIME2` + ältere Anime-Blöcke `BASE`/`CAND`/`BULK`).

## 2. Repo, Branches, Hosting
- Repo: `PXrple01/soulwatch12` (öffentlich – muss für kostenloses GitHub Pages öffentlich bleiben).
- Arbeits-Branch: `claude/gallant-pasteur-7en1qv`. Der Nutzer hat erlaubt, **direkt auf `main` zu pushen** (`git push origin claude/gallant-pasteur-7en1qv:main`), damit Änderungen sofort live sind.
- **Live: GitHub Pages** https://pxrple01.github.io/soulwatch12/ – jeder Push auf `main` ist nach 1–2 Min. online (Prüfen: `curl` auf die Seite, z. B. nach einem neuen String oder `jj-watchlist-vNN` in `sw.js`).
- Netlify (soulwatch.netlify.app) ist **tot** (kostenloses Kontingent aufgebraucht, „Usage exceeded“). Der Nutzer sollte dort Builds stoppen/Seite löschen – das kann Claude nicht.
- Dateien im Repo: `index.html`, `watchlist.html`, `sw.js` (Cache aktuell **`jj-watchlist-v37`**, bei Releases hochzählen), `manifest.webmanifest`, `icon-180/192/512.png`, `.nojekyll`, `uebergabe.md`, `supabase-setup.sql`, `SESSION-UEBERGABE.md`.
- Commit-Nachrichten auf Deutsch, enden mit den Attribution-Zeilen aus dem System-Hinweis. Keine Modellnamen in Commits/Code.

## 3. Cloud (Supabase) – Sicherheit!
- Projekt `https://inqhfkoxmftyellmrxop.supabase.co`, öffentlicher Key in `const CLOUD` in der Seite (ist öffentlich gedacht).
- Zugriff nur über RPCs `wl_get`/`wl_put`/`wl_get_vote`/`wl_put_vote` mit **Haushalts-Code**. Der echte Code darf **nie** ins Repo oder in Chats/externe Anfragen. `supabase-setup.sql` enthält nur den Platzhalter `EUER-HAUSHALTS-CODE`.
- Daten pro Gerät in localStorage (`anime-watchlist-v3`, `film-watchlist-v1`, `serie-watchlist-v1`, `wl-user`, `wl-code`, `anime-theme-v1` …) + Cloud-Abgleich. Keine persönlichen Daten des Nutzers (E-Mail, Namen) an externe Dienste schicken.

## 4. Aufbau des Codes (Blöcke mit Markern)
In `index.html` gibt es eingespielte Blöcke, die aus Quelldateien gebaut werden:
- CSS `/* KINO-START */…/* KINO-END */` (Redesign Hell/Dunkel)
- CSS `/* EXTRA-START */…` + JS `// EXTRAS-START…// EXTRAS-END` (Finder, Marathon, Quiz, Landkarte, Poster, Ticket, Regal, Tönung, Auto-Design, interaktiver Rewind; enthält `RT`-Laufzeiten über `__RT_RAW__`)
- CSS `/* THEMES-START */…` + JS `// THEMES-START…` (Designs Kinopalast `deco`, Tiefsee `sea`, Origami `paper`; Szenen-Ebenen `#tfx` hinter, `#tfo` über dem Inhalt; `thSwitch`, `thIntro`, `thConfetti` …)
- CSS `/* KISTE-START */…` + JS `// KISTE-START…` (inszeniertes Kisten-Öffnen, Präfix `kx-`)
- JS `// GESCHENK-START…` vor `chList` (Geschenk-Kisten `CH_GIFTS`, aktuell `g1` für beide)
- **Wichtig:** Die Quelldateien (kino.css, extras.css/js, themes.css/js, kiste.css/js, gift.js, Build-Skripte `build_all.sh`, `apply*.py`, Katalog-Pipeline `cat2/*`) lagen nur im Scratchpad der alten Session und sind **nicht** im Repo. In einer neuen Session direkt in `index.html` zwischen den Markern arbeiten (Marker beibehalten!).
- Designs: light, dark, purple (Johann/Manga), baby (Josefine/Einhorn), deco, sea, paper, auto.
- Bewertungen 1–10 (`RMIN=1`, `RMAX=10`), Kisten/Gegenstände/Sets/XP/Haustier, Rewind, Swipen, Glocke, Empfehlungen, Weiterschauen – Details in `uebergabe.md`.

## 5. Bekannte Fallen
- Neue Klassen/`@keyframes` vorher suchen (viele kurze Namen; reservierte Präfixe `dc- se- pp- th- kx-`).
- Pseudo-Elemente nie in `:is()`.
- Keine Variable `top` (heißt `topTab`). Kein Hintergrund am `<html>` (sonst ist `#tfx` unsichtbar).
- Bei `prefers-reduced-motion` muss alles ruhig bleiben (`calm()`).
- `achCheck` (Abzeichen/Kisten) läuft spätestens 4 s nach dem Zeichnen (`achT0`).
- Gegenstände in Kisten werden **berechnet**, nicht gespeichert – nie Kisten in die bestehende Ziehungs-Reihe einfügen (siehe Geschenk-Kisten).
- Wikipedia-API (`api.php`) war stark gedrosselt (429) → `Spezial:Exportieren` (POST, viele Seiten pro Anfrage) nutzen. AniList braucht eigenen User-Agent („watchlist-builder/1.0“), Wikimedia-UA ohne persönliche Kontaktdaten.

## 6. Testen
- Lokaler Server: `python3 -m http.server 5178` im Repo-Ordner; Chromium + Playwright sind vorinstalliert (`require('playwright')`).
- Die Geschenk-Kiste geht nach dem Laden von selbst auf → in Tests nach `goto`: `chShow=()=>{};if(chOn){chOn=false;chRender()}`. Für Tests `cState="ok"` setzen; Testdaten über localStorage (`wl-user`, `wl-code`="x", `wl-howto-hide`, `wl-th-intro`).
- In der Tiefsee schweben Karten → in Playwright `#grid .card{animation:none}` injizieren.
- Parallel laufende Browser-Tests führen zu Zeitüberschreitungen – nacheinander ausführen.
- Prüfen: keine `pageerror`, kein seitliches Scrollen (390/340 px), alle 8 Designs, Handy + Desktop.

## 7. Offene Punkte / Ideen
- Nutzer: neue Adresse auf allen Geräten öffnen, Person + Haushalts-Code eingeben, Home-Bildschirm-Symbol neu anlegen; Netlify abschalten.
- Seite ist 6,2 MB (2,1 MB komprimiert), Laden ~2× langsamer als vorher. Mögliche Optimierung: Katalog auslagern/nachladen, Cover-URL-Präfixe kürzen, bei Animes `plot` aus `desc` ableiten.
- 751 neue Animes haben nur englische Beschreibung (AniList).
- Push-Mitteilungen aufs gesperrte Handy gibt es nicht (bräuchte Server-Versand).
