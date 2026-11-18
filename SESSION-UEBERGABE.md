# Übergabe für eine neue Session – Josefines ♥ Johanns Watchlist

Stand: 18.11.2026 (nach Phase 2 des UX-Umbaus). Ausführliche Feature-Doku: `uebergabe.md` (immer zuerst lesen, dort steht jedes Update mit Details).

## 1. Was das Projekt ist
- Private PWA-Watchlist für zwei Personen (Josefine = `jos`, Johann = `joh`, gemeinsam = `both`), Sprache Deutsch.
- **Eine einzige HTML-Datei** `index.html` (~6,2 MB, Vanilla JS/CSS, Daten inline). `watchlist.html` ist eine identische Kopie (`cp index.html watchlist.html` nach jeder Änderung).
- Bereiche: Animes, Filme, Serien. Katalog: 4.697 aktive Filme, 2.835 Serien, 2.550 Animes (Arrays `FILMS`, `SERIES`, `ANIME2` + ältere Anime-Blöcke `BASE`/`CAND`/`BULK`).

## 2. Repo, Branches, Hosting
- Repo: `PXrple01/soulwatch12` (öffentlich – muss für kostenloses GitHub Pages öffentlich bleiben).
- Arbeits-Branch dieser Session: `claude/relaxed-thompson-jsh0v5` (vorher `claude/gallant-pasteur-7en1qv`). Auf `main` kommt eine Änderung erst, wenn der Nutzer sie freigegeben hat (bei größeren Umbauten zuerst eine Vorschau-Seite als Artifact zeigen); dann `git push origin <branch>:main`.
- **Live: GitHub Pages** https://pxrple01.github.io/soulwatch12/ – jeder Push auf `main` ist nach 1–2 Min. online (Prüfen: `curl` auf die Seite, z. B. nach einem neuen String oder `jj-watchlist-vNN` in `sw.js`).
- Netlify (soulwatch.netlify.app) ist **tot** (kostenloses Kontingent aufgebraucht, „Usage exceeded“). Der Nutzer sollte dort Builds stoppen/Seite löschen – das kann Claude nicht.
- Dateien im Repo: `index.html`, `watchlist.html`, `sw.js` (Cache aktuell **`jj-watchlist-v39`**, bei Releases hochzählen), `manifest.webmanifest`, `icon-180/192/512.png`, `.nojekyll`, `uebergabe.md`, `supabase-setup.sql`, `SESSION-UEBERGABE.md`.
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
- CSS `/* BEWEGUNG-START */…` (ganz am Ende) + JS `// BEWEGUNG-START…// BEWEGUNG-END` (direkt vor `render()`): Bewegungs-System, Startseite mit Tipps im freien Platz, Karten mit Haken + Bewertungs-Blatt, Gesten, Animationen 1–31, Symbole Emoji/Linien, Ruhige Szene (Phase 1); Filmabend-Programmheft (`xo.k="fa"`), Heute Abend, „Auf drei!“ (`blind`), rollende Zahlen über `data-odo` (Phase 2). Details in `uebergabe.md` (Abschnitte „Phase 1“ und „Phase 2“).
- **Wichtig:** Die Quelldateien (kino.css, extras.css/js, themes.css/js, kiste.css/js, gift.js, Build-Skripte `build_all.sh`, `apply*.py`, Katalog-Pipeline `cat2/*`) lagen nur im Scratchpad der alten Session und sind **nicht** im Repo. In einer neuen Session direkt in `index.html` zwischen den Markern arbeiten (Marker beibehalten!).
- Designs: light, dark, purple (Johann/Manga), baby (Josefine/Einhorn), deco, sea, paper, auto.
- Bewertungen 1–10 (`RMIN=1`, `RMAX=10`), Kisten/Gegenstände/Sets/XP/Haustier, Rewind, Swipen, Glocke, Empfehlungen, Weiterschauen – Details in `uebergabe.md`.
- Bewerten auf der Watchlist: Haken auf dem Cover (`.ck`) → Bewertungs-Blatt (`rateId`, Kontext `"rs"`), in „Zusammen“ „Auf drei!“ (verdeckt bewerten, gemeinsam aufdecken). Keine Regler mehr auf den Karten. Das Info-Fenster hat die Hauptaktion („Gesehen – jetzt bewerten“ bzw. „Zurück in die Watchlist“).
- Neue geteilte Daten (Phase 2): `ST[k].blind` (verdeckte Bewertungen), `ST.film.x.tonight` (Heute Abend).

## 5. Bekannte Fallen
- Neue Klassen/`@keyframes` vorher suchen (viele kurze Namen; reservierte Präfixe `dc- se- pp- th- kx- mv`; vergeben sind z. B. `.ttl`, `.ok`, `.cl`, `.done`, `.turn`).
- Pseudo-Elemente nie in `:is()`.
- Keine Variable `top` (heißt `topTab`). Kein Hintergrund am `<html>` (sonst ist `#tfx` unsichtbar).
- Bei `prefers-reduced-motion` muss alles ruhig bleiben (`calm()`).
- `achCheck` (Abzeichen/Kisten) läuft spätestens 4 s nach dem Zeichnen (`achT0`).
- `render()` baut auch Modal und Extras-Seite (`xoRender`) jedes Mal neu: Zustände in `blind`/`xo` halten, einmalige Animationen per JS (WAAPI) statt CSS-Animation. Für rollende Zahlen `data-odo="eindeutiger-schlüssel"` verwenden.
- Gegenstände in Kisten werden **berechnet**, nicht gespeichert – nie Kisten in die bestehende Ziehungs-Reihe einfügen (siehe Geschenk-Kisten).
- Wikipedia-API (`api.php`) war stark gedrosselt (429) → `Spezial:Exportieren` (POST, viele Seiten pro Anfrage) nutzen. AniList braucht eigenen User-Agent („watchlist-builder/1.0“), Wikimedia-UA ohne persönliche Kontaktdaten.

## 6. Testen
- Lokaler Server: `python3 -m http.server 5178` im Repo-Ordner; Chromium + Playwright sind vorinstalliert (`require('playwright')`).
- Die Geschenk-Kiste geht nach dem Laden von selbst auf → in Tests nach `goto`: `chShow=()=>{};if(chOn){chOn=false;chRender()}`. Für Tests `cState="ok"` setzen; Testdaten über localStorage (`wl-user`, `wl-code`="x", `wl-howto-hide`, `wl-th-intro`).
- In der Tiefsee schweben Karten → in Playwright `#grid .card{animation:none}` injizieren.
- Parallel laufende Browser-Tests führen zu Zeitüberschreitungen – nacheinander ausführen.
- Prüfen: keine `pageerror`, kein seitliches Scrollen (390/340 px), alle 8 Designs, Handy + Desktop.

## 7. UX-Umbau: nächste Schritte (vom Nutzer so bestellt)
- Phase 1 (fertig): Bewegungs-System, Startseite, Karten ohne Regler, Animationen.
- Phase 2 (fertig): Filmabend als Programmheft (Zeit & Stimmung → Kandidaten → würfeln/swipen → „Heute läuft …“ mit Licht-aus je Design → Banner „Heute Abend“/„Wie war's?“), „Auf drei!“ (ein oder zwei Handys), „Zurück in die Watchlist“ im Info-Fenster (mit Tausch bei voller Liste), rollende Zahlen und Beschriftungen an vielen Stellen.
- Nicht gewünscht: Live-Anzeige „X ist gerade da“ (hat der Nutzer ausdrücklich abgelehnt).
- **Phase 3:** Reaktionen/Einladungen zwischen den beiden (über `ST.film.x` wie Empfehlungen), Kalender-Termin (.ics) statt Push + Ansicht „Demnächst“, Verlauf mit ⋯-Menü statt kleiner −/+/×, Glocke als Blatt, eine Navigation am Handy (Hamburger weg), Spiel-Ecke in der Leiste bündeln, ein einheitliches Fenster-System, Haptik-Experiment (iOS-Schalter-Trick).
- Die Vorschau-Seite (Artifact „Watchlist-Vorschau“) zeigt alle Animationen und Abläufe als Referenz.

## 8. Offene Punkte / Ideen
- Nutzer: neue Adresse auf allen Geräten öffnen, Person + Haushalts-Code eingeben, Home-Bildschirm-Symbol neu anlegen; Netlify abschalten.
- Seite ist 6,2 MB (2,1 MB komprimiert), Laden ~2× langsamer als vorher. Mögliche Optimierung: Katalog auslagern/nachladen, Cover-URL-Präfixe kürzen, bei Animes `plot` aus `desc` ableiten.
- 751 neue Animes haben nur englische Beschreibung (AniList).
- Push-Mitteilungen aufs gesperrte Handy gibt es nicht (bräuchte Server-Versand).
