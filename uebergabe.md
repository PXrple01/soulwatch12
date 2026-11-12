# Übergabe: Josefines und Johanns Watchlist

Stand: 20.10.2026. Eine einzelne HTML-Datei, Sprache Deutsch.

## Dateien in diesem Ordner
- `watchlist.html` – die Seite (Hauptdatei, hier wird gearbeitet)
- `watchlist-web/index.html` – Kopie zum Hochladen bei Netlify (nach jeder Änderung neu kopieren: `cp watchlist.html watchlist-web/index.html`)
- `supabase-setup.sql` – Einrichtungs-Skript für die Datenbank. **Enthält den Haushalts-Code, nicht weitergeben, nicht hochladen.**

## Aufbau der Seite
- **Kopf:** Überschrift „Josefines ♥ Johanns“ (Herz halb pink, halb lila, schlägt), rechts Cloud-Symbol (☁️/⏳/⚠️), Personen-Chip, Zahnrad.
- **Zahnrad-Menü:** Design (Hell, Dunkel, Lila, Baby mit Einhörnern), Cloud-Sync (Status, „Jetzt abgleichen“, „Gerät abmelden“), Backup speichern/laden, „Alles zurücksetzen“ (alle Bereiche, mit Rückgängig).
- **Reiter:** Animes, Filme, Serien.
- **Listen pro Bereich:** Josefine, Johann, 💞 Zusammen. Bei Animes keine Josefine-Liste (sie schaut Animes nicht allein). Fremde Liste nur ansehen. Eigene Listen starten mit den Titeln aus „Zusammen“.
- **Unterreiter:** Watchlist, Verlauf (sortierbar), Statistik. Rechts daneben eine **Suchleiste** (Katalog + Online-Suche: AniList für Animes, deutsche Wikipedia für Filme/Serien; Treffer bewerten, zur Watchlist hinzufügen oder gegen einen Titel tauschen; übernommene Titel werden als `custom` im Bereich gespeichert).
- **Watchlist:** 10 Plätze. Sterne vergeben = abgeschlossen, Platz wird frei. Empfehlung oben (5 pro Runde: 3 beste Treffer, 2 mit neuen Genres) mit Annehmen/Skip/Ablehnen/Schon gesehen.
- **Zusammen:** Sterne oder „Schon gesehen“ öffnen ein Fenster, in dem **beide** bewerten („… bewertet später“ möglich). Abschlüsse in „Zusammen“ landen auch im Verlauf beider („💞 zusammen gesehen“) und verschwinden aus deren Watchlists.
- **Bewertungen gehören der Person** und sind überall sichtbar (auch die der anderen Person). „Schon gesehen“ zählt 1,6-fach. Empfehlungen in „Zusammen“ passen zu beiden; bei Filmen zählt die IMDb-Wertung mit.
- **Info-Fenster** (Klick auf jeden Titel): Cover, Jahr, Wertung, FSK, Beschreibung, Wikipedia-Text, Notizen beider Personen, „🗑 Entfernen“ (aus Watchlist oder Verlauf, mit Rückfrage).
- **Spielautomat** („Was schauen wir heute?“ / „Würfeln“): Quelle „Aus der Watchlist“ oder „Aus allem“, Stimmungs-Filter, Band mit vorgeladenen Covern, Name des Treffers klickbar, Nochmal drehen, ＋ Zur Watchlist.
- **Statistik:** Kacheln (Abgeschlossen, Ø je Person, Einigkeit, Entfernt), Lieblingsfilm/-anime/-serie je Person und gemeinsam, Titel pro Monat, Genres, Sterne-Verteilung, Liste entfernter Titel mit „Wiederherstellen“.
- **Sonst:** Rückgängig (Meldung unten + Strg+Z), Konfetti bei 5 Sternen, Handy-Ansicht verdichtet (CSS-Block `/* Handy: … */` steht am Ende des Stylesheets).

## Daten
- **Animes:** ca. 243 Titel (`BASE`, `CAND`, `BULK`), Cover/Infos online (AniList → Kitsu → Jikan).
- **Filme:** 500 Realfilme (Horror, Thriller, Psycho, Mystery) in `FILMS`. Format pro Zeile: `IMDb-ID|Titel|Original|Jahr|IMDb|Stimmen|FSK|Cover|Tags|Genre|Beschreibung|de-Wikipedia-Artikel`. Alle mit belegter deutscher Synchro (Synchronkartei, Wikipedia oder deutscher Originalfilm). Start-Filme in `FILM_START`.
- **Serien:** 600 beliebte Serien (Top nach IMDb-Stimmen, ohne japanische Animes, indische/türkische Serien und Talkshows) in `SERIES`. Format wie `FILMS` plus 13. Feld = TVmaze-ID. Wertung/Stimmen aus den IMDb-Datensätzen (Okt. 2026), Cover von TVmaze, deutsche Titel aus TVmaze-AKAs bzw. Handarbeit, Beschreibungen selbst geschrieben. FSK und Wikipedia-Artikel leer (Wikipedia-Text wird per Suche „Titel Fernsehserie Jahr“ gefunden). Start-Serien in `SERIE_START`.
- **Speicherung:** Browser (`anime-watchlist-v3`, `film-watchlist-v1`, `serie-watchlist-v1`, Datenformat `v:2` mit `lists.jos/joh/both`, `w` = Bewertungen, `notes`, `custom`) plus Cloud.

## Cloud (Supabase)
- Projekt-URL: `https://fotnvxalffqrlsltyazc.supabase.co`, öffentlicher Schlüssel steht in `const CLOUD` in der Seite.
- Tabelle `wl_state` (ein Eintrag pro Bereich), Zugriff nur über die Funktionen `wl_get` / `wl_put` mit Haushalts-Code. Tabellen sind von außen gesperrt (geprüft).
- Pro Gerät einmal den Haushalts-Code eingeben (Pflicht, keine lokale Option mehr). Abgleich nach Änderungen, beim Öffnen, beim Zurückwechseln in den Tab und alle 30 Sekunden. Bei gleichzeitigen Änderungen gewinnt der zuerst gespeicherte Stand.
- Kostenlose Projekte pausieren nach ca. 1 Woche ohne Nutzung → im Dashboard „Restore“.

## Hosting
- Netlify (Konto anlegen, „Deploy manually“, Ordner `watchlist-web` hineinziehen). Bei Änderungen erneut hochladen.

## Bekannte Fallen
- Keine Variable `top` auf oberster Ebene (das ist `window.top`). Heißt `topTab`.
- `.box` = Häkchen-Kästchen, Info-Fenster nutzt `.mbox`.
- Neue CSS-Regeln für das Handy ans Ende des Stylesheets, sonst werden sie überschrieben.
- Testen in jsdom (`runScripts:"dangerously"`), nicht nur mit `new Function`. In jsdom ist die Seite nie „sichtbar“ – Cloud-Abgleich dort direkt aufrufen.
- Für Browser-Tests einen lokalen Server nutzen (z. B. `npx http-server -p 5178`); den Cloud-Startbildschirm im Test per CSS ausblenden.

## Offen / nächste Ideen
- Anime-Titelliste (ca. 2000 Einträge) blockweise ergänzen – die Liste muss der Nutzer schicken.
- Eventuell: Haushalts-Code ändern (SQL-Skript), Wischen auf dem Handy.

## Neu (20.10.2026): Staffeln abhaken bei Animes
- Staffeln werden automatisch von AniList geladen (Fortsetzungen verfolgt, nur TV/Web-Staffeln gezählt, Filme/OVAs übersprungen) und im Browser zwischengespeichert (`anime-seasons-v1`).
- Nur bei mehr als einer Staffel erscheint die Leiste „S1 S2 …“ auf der Karte und im Info-Fenster (dort mit Namen).
- Klick auf Sn hakt alle Staffeln bis n ab, erneuter Klick nimmt n zurück. Fortschritt pro Liste in `prog[liste][id]`, wird mit der Cloud abgeglichen, Rückgängig möglich.

## Neu (20.10.2026): Serien + Staffeln, Baby-Design
- Staffeln abhaken jetzt auch bei Serien: Staffeln von TVmaze (`/shows/{tvm}/seasons`, nur bereits gestartete), Cache gemeinsam mit Animes in `anime-seasons-v1`. Die Warteschlange lädt zuerst Titel des aktuellen Reiters.
- Baby-Design stark erweitert (CSS-Block „Baby-Design“ vor dem Handy-Block, JS-Block „Baby-Design: Himmel, Glitzer, Einhorn“ vor `confetti()`): Schrift Baloo 2, Einhorn-Cursor, ziehende Wolken, aufsteigende Blasen/Herzen, Nachtmodus (20–7 Uhr: Mond, Sterne, schlafendes Einhorn), Regenbogen-Titel, Einhorn neben dem Titel (antippen = Herzchen + Sprechblase), Glitzerspur hinter der Maus, Herzchen-Explosion bei Klicks, Herzen statt Sterne, 🎀 auf gesehenen Karten, Teddy in freien Plätzen, Regenbogen-Rahmen, galoppierendes Einhorn bei 5 Sternen. Alles mit `prefers-reduced-motion` abschaltbar.

## Neu: Als iPhone-App (Home-Bildschirm)
- Im Ordner `watchlist-web` liegen jetzt zusätzlich `manifest.webmanifest`, `sw.js` (Offline-Start, lädt immer zuerst aus dem Netz) und die App-Symbole `icon-180/192/512.png`. Alle zusammen bei Netlify hochladen.
- iPhone: Netlify-Adresse in Safari öffnen → Teilen → „Zum Home-Bildschirm“. Die App hat einen eigenen Speicher, darum dort einmal Person wählen und den Haushalts-Code eingeben.
- Bei neuer Cache-Version `CACHE` in `sw.js` hochzählen ist nicht nötig (Netz zuerst), nur bei geänderten Datei-Namen.

## Neu: Designs pro Person
- **Dunkel** ist jetzt ein neutraler Dark Mode (Grau/Schwarz, Akzent sanftes Lila, Sterne gold). Gilt auch automatisch, wenn kein Design gewählt ist und das Gerät dunkel eingestellt ist.
- **Lila = Johanns Modus** (Manga, bewusst ohne Fußball/Blue Lock): dunkles Violett mit Cyan, Rasterpunkte, drehende Speedlines, schwebende „ゴゴゴ“/„ドド“, funkelnde ✦, Schriftzug „つづく“ (`lilaSky`). Schrift Anton, Titel mit Glitch, Untertitel „第1話 // WATCHLIST“, schräge kantige Knöpfe, Karten als Manga-Panels mit Nummer #1–#10 und Aura, „完“-Stempel auf gesehenen Karten, leuchtende ✦-Sterne, „NEXT EPISODE“-Empfehlung, freie Plätze „TO BE CONTINUED …“, Einschlag-Effekt bei Klicks (`impact`), „!?“ neben dem Titel mit Manga-Sprüchen (`mangaPop`, Liste `LINES`), bei 5 Sternen „ドン!!“-Einblendung (`goal`).
- **Baby = Josefines Modus** (unverändert, Info-Fenster-Regel jetzt mit `#modal .mbox`, sonst wurde sie überschrieben).
- Serien-Listen werden einmalig aufgefüllt (`fillSerie`, Merker `filled` im Speicherstand): freie Plätze bekommen erst `SERIE_START`, dann die meistbewerteten Serien. Gesehene, abgelehnte und entfernte Titel werden übersprungen. Läuft auch für Stände aus der Cloud.

## Neu: Rewind (Jahresrückblick)
- **Zeitfenster:** jedes Jahr 31.12. 00:00 bis 15.01. 00:00 (exklusiv), Europe/Berlin, ohne feste Jahreszahlen. Konstanten `RW_OPEN`/`RW_CLOSE`, reine Funktion `rewindWindow(now)`. Geprüft wird beim Banner, beim Öffnen, beim Blättern und alle 15 s (`rwTick`). Die Prüfung läuft nur im Browser (Systemuhr).
- **Testen:** `?rewindNow=2026-12-31T00:00` (Berliner Zeit) oder in der Konsole `rewindSetNow("2027-01-14T23:59")`. Speichert nichts.
- **Daten:** `rewindData(jahr|"all", "both"|"jos"|"joh")` über alle drei Bereiche. Ein Titel zählt zum Jahr seines frühesten echten `done.t`. `pre` zählt nicht (nur als „nachgetragen“), Einträge mit `via:"both"` werden entdoppelt, „zusammen“ = `lists.both`. Keine Laufzeiten oder Folgenzahlen.
- **Slides:** `rewindSlides(D)`. Intro, Zahlen, Top-Titel, gemeinsame Favoriten/Uneinigkeit, Geschmacksmesser (Einigkeit erst ab 5 gemeinsam bewerteten Titeln), Monate (bzw. Jahre bei All-Time), Rekorde, Awards, Erinnerungen (Notizen), Abschluss mit Canvas-Karte (`rwShare`, ohne Cover wegen CORS). Unter 3 Titeln gibt es einen Leerzustand.
- **Einstiege:** Banner `#rwban` über der Empfehlung (pro Gerät und Jahr ausblendbar: `wl-rewind-hide-<Jahr>`), Kachel im Statistik-Tab (außerhalb des Fensters mit Countdown). Overlay `#rw` liegt auf Ebene z22.
- **Zeitstempel ab jetzt:** `w[id].rt = {jos, joh}` (ms) bei jedem Setzen oder Ändern von Sternen, wird beim Löschen entfernt. `progT[liste][id][staffel] = ms` beim Staffel-Abhaken. `custom[id].at` bei übernommenen Titeln. Alte Daten bleiben unverändert.
- `sw.js`: Cache-Version auf `jj-watchlist-v2` erhöht.

## Neu: Trailer-Links
- Im Info-Fenster (Filme, Serien, Animes) gibt es unter der Beschreibung „▶ Trailer (Deutsch)“ und „▶ Original“, im Würfel-Ergebnis „▶ Trailer“. Beides sind YouTube-Suchen in einem neuen Tab (`<a target="_blank">`, kein Button, also unabhängig vom Klick-Handler).
- `trailerUrl(id, lang)` baut die Suche: Filme/Serien `orig||name` + Jahr + „Trailer“, bei Serien „Serie Trailer“; Animes: Name ohne Klammerzusatz + Jahr (`META`/`YEAR`) + „Anime Trailer“; mit `lang="de"` kommt „deutsch“ dazu.
- `sw.js`: Cache-Version `jj-watchlist-v3`.

## Neu: Bewertungen mit Kommastelle (0,5–5,0)
- Statt fünf Stern-Knöpfen gibt es eine Sternleiste (`rateHtml`, `.rate`, role="slider"): tippen oder ziehen (Wert erscheint live als Blase), loslassen speichert. Feinjustierung mit − / + (0,1er-Schritte), Tastatur: Pfeile ±0,1, Umschalt+Pfeile ±0,5, Pos1/Ende, Enter speichert. Senkrechtes Wischen bricht ab.
- Gespeichert wird weiter in `w[id].r[u]`, jetzt als Zahl mit einer Nachkommastelle (alte ganze Zahlen bleiben gültig). Speichern läuft über die bisherige Aktionslogik: Der Klick-Handler ruft jetzt `act(dataset)` auf, die Sternleiste nutzt `rateCommit()` → `act()`.
- Entfernen der eigenen Bewertung: „×“ im Verlauf (`data-rclr`); im gemeinsamen Fenster „×“ je Person (`data-dclr`).
- Anzeige überall mit Teil-Füllung + Zahl (`sst`, im Rewind `rwSt`). Themes: ★ (hell/dunkel), ✦ (Lila), 💖/🤍 (Baby).
- Einigkeit (`agreeTag`): ≤ 0,3 „Einig“, ≤ 1,0 „Fast einig“, sonst „verschieden“. Rewind: kontrovers ab > 1,0 Abstand, Einigkeit ≤ 1,0 (mit Rundung gegen Kommafehler). Sterne-Verteilung in der Statistik rundet auf ganze Sterne.
- Während des Ziehens wartet `render()` (`rDrag`), damit die Vorschau nicht verschwindet.
- `sw.js`: Cache-Version `jj-watchlist-v4`.

## Neu: Zweite Anime-Liste + Stöbern-Seite
- `ANIME2` (755 Titel): AniList-ID|Name|Jahr|AniList-Wertung/10|Cover|Tags|Genre|Kurzbeschreibung|Beschreibung (aniSearch, deutsch)|Sprache de/omu|Folgen|Format|YouTube-Trailer. IDs im Katalog: `al<AniList-ID>`.
- Ranma ½ (1989) nachträglich aufgenommen; Mushoku Tensei, No Game No Life, Kill la Kill und Gantz waren schon im alten Pool. „Quelle: www.anisearch.de/…“ am Textende entfernt.
- Filter: deutsche Synchro laut aniSearch-Index (Filter „Synchronisation: Deutsch“), dazu die 20 bestbewerteten ohne Synchro (AniList-Wertung, mind. 15 000 AniList-Nutzer); ab 1980; ohne Erotik (AniList isAdult oder Ecchi mit starker Nacktheit/sexuellen Tags); ohne AniList-Treffer gestrichen. Details: `ANIME-FILTER.md`.
- `AMETA`: Jahr, Wertung, Cover, Sprache, Trailer und (falls vorhanden) aniSearch-Beschreibung für die bisherigen 243 Animes.
- Info-Fenster Anime: Cover, Jahr, AniList-Wertung, Format, Synchro/OmU, deutsche Inhaltsangabe; „▶ Original“ führt direkt zum AniList-Trailer, falls bekannt. Staffeln werden per AniList-ID geladen.
- Stöbern-Seite (`#brw`, Symbol neben der Suche): Reiter Animes/Filme/Serien, Name, Sortierung (Bewertung, Jahr, Name, meine Sterne), Jahr von–bis + Jahrzehnte, Mindestbewertung, Status in der aktuellen Liste, Sprache (Animes), Genres (UND). Karten mit Cover, Name, Wertung, Jahr; ＋ fügt zur aktuellen Watchlist hinzu (`data-sadd`), Klick öffnet das Info-Fenster. Zeigt 60, „Mehr anzeigen“ lädt weitere. Ebene z9 (unter #modal).
- `sw.js`: Cache-Version `jj-watchlist-v5`.

## Neu: Neuerscheinungen automatisch
- Block „Neuerscheinungen“ im Skript (`autoCheck`). Läuft 8 s nach dem Start und dann alle 6 Stunden, sucht aber pro Bereich höchstens einmal pro Woche (`ST[k].autoAt`, wird über die Cloud geteilt, damit nur ein Gerät sucht). Im Zahnrad-Menü: „Jetzt nach Neuerscheinungen suchen“.
- Funde landen in `ST[k].auto` (mit der Cloud geteilt) und werden wie eigene Titel in `M` geladen (`autoLoad`). Höchstens 10 pro Bereich und Lauf, nichts doppelt (IMDb-/AniList-ID, Name).
- Filme: Kandidaten aus der deutschen Wikipedia (Kategorie „Filmtitel <Jahr>“ für dieses und letztes Jahr), dann Wikidata (erste Veröffentlichung im Zeitraum, mind. 25 Wikipedia-Sprachversionen, IMDb-ID). Nur Horror/Thriller/Mystery/Psycho wie der Film-Katalog. Keine IMDb-Wertung verfügbar.
- Serien: Wikidata (Serienstart im Zeitraum, mind. 12 Sprachversionen) + TVmaze (Cover, TVmaze-Wertung, Staffeln). Keine japanischen Serien, keine Talk-/Reality-Shows.
- Animes: AniList (Start im Zeitraum, mind. 20 000 Nutzer, Wertung ≥ 7,0), ohne Fortsetzungen, gleicher Erotik-Filter, nie Titel aus `AUTO_SKIP` (bei der Listen-Filterung aussortierte AniList-IDs). Synchro unbekannt, Beschreibung englisch (AniList).
- Kurztext und Plakat aus der deutschen/englischen Wikipedia. „Neu“-Kennzeichen 30 Tage lang; beim Stöbern Status „✨ Neu im Katalog“.
- `sw.js`: Cache-Version `jj-watchlist-v6`.

### Update: Neuerscheinungen ohne Genre-Grenzen, aber nur mit deutscher Synchro
- Genre-Filter für neue Filme/Serien entfernt (`AUTO_FILM` weg), Anime-Score-Schwelle entfernt, `AUTO_SKIP` ersetzt durch Pflicht-Prüfung. `AUTO_MAX=15` pro Bereich und Lauf.
- **Pflicht: deutsche Synchronisation.** `autoDubDe(titles)` lädt den Quelltext des deutschen Wikipedia-Artikels; aufgenommen wird nur, wenn er einen Abschnitt „Synchronisation“/„Deutsche Fassung“ oder einen Synchronkartei-Verweis hat (`DUB_RE`). Ohne deutschen Artikel → kein Eintrag.
- Filme/Serien: Artikel über den dewiki-Sitelink aus Wikidata. Animes: `autoDeArticle()` sucht den Artikel per Titel-Suche (nur bei Titel-Treffer).
- Bleibt bewusst: Mindest-Bekanntheit (Wikidata-Sitelinks bzw. AniList-Popularität ≥ 20 000), Erotik-Filter bei Animes, Fortsetzungen werden übersprungen, japanische Animationsserien laufen über den Anime-Reiter.
- Grenze: Sehr neue Titel bekommen den Synchro-Abschnitt oft erst Wochen später – sie werden beim nächsten wöchentlichen Lauf nachgeholt (Fenster reicht 30 Tage vor die letzte Prüfung zurück).
- sw.js: Cache `jj-watchlist-v7`.

### Update: Filmkatalog umgebaut (900 aktive Filme)
- Filme vor 1980 (114) sind aus dem Katalog genommen: Sie bekommen beim Laden `old:1` und tauchen nicht mehr in Empfehlung, Würfel, Suche, Stöbern und Zählern auf. In FILMS bleiben sie stehen, damit Einträge, die ihr schon in Listen/Verlauf/Bewertungen habt, weiter angezeigt werden.
- 114 Ersatzfilme nach den bisherigen Film-Kriterien: ab 1980, IMDb-Genre Thriller/Horror/Mystery, IMDb ≥ 6,9, nach Stimmenzahl (≥ 179 Tsd. Stimmen).
- Dazu 400 der beliebtesten Filme ab 1980 ohne Genre-Grenze (nach IMDb-Stimmenzahl, ≥ 384 Tsd. Stimmen).
- Bedingung für alle neuen: deutscher Wikipedia-Artikel vorhanden (Wikidata-Sitelink), keine japanischen Animationsfilme (die gehören in den Anime-Reiter), nicht schon im Katalog.
- Daten: IMDb-Datensätze (Wertung, Stimmen, Laufzeit, Genres), Wikidata (deutscher Titel, FSK, dewiki-Artikel), Cover von IMDb (m.media-amazon.com), Kurzbeschreibung und Stimmungs-Tags auf Deutsch neu geschrieben. Tags „90er-Look“ = 1990–2002, „kurz“ ≤ 95 min, „lang“ ≥ 150 min.
- sw.js: Cache `jj-watchlist-v8`.

### Update: Neuerscheinungen der letzten 3 Monate + Automatik überarbeitet
- `FILMS_NEU`: 77 Filme mit deutschem Kinostart 20.07.–03.11.2026 (Wikidata, Release-Datum mit Land Deutschland), u. a. Clayface, Whalefall, Spider-Man: Brand New Day, Toy Story 5. Fest eingebaut, gelten 30 Tage als „✨ Neu“. Kurztext + fehlende Plakate lädt `newFill()` beim Start aus der deutschen Wikipedia (Cache `wl-newfill` im Browser). Feld `start` → Anzeige „🎬 ab TT.MM. im Kino“ (`startDe`).
- Automatik (`autoCheck`): jetzt täglich statt wöchentlich, bis zu 60 Titel pro Bereich, einmalige Nachhol-Suche über die letzten 92 Tage (Merker `ST[k].autoV=2`).
- Filme: Kandidaten = deutsche Wikipedia-Kategorien „Filmtitel“ dieses, letztes und vorletztes Jahr. Aufnahme, wenn (a) deutscher Kinostart im Zeitraum bis 14 Tage voraus, oder (b) Erstveröffentlichung im Zeitraum, ≥ 8 Sprachversionen und Synchro-Beleg. Keine IMDb-ID nötig (Ersatz-ID `wd<QID>`).
- Synchro-Beleg (unverändert Pflicht): deutscher Kinostart ODER Streaming-Original (Netflix/Prime Video/Amazon/Disney+/Apple TV laut Wikidata) ODER Synchro-Abschnitt/Synchronkartei im deutschen Wikipedia-Artikel.
- Serien: ≥ 8 Sprachversionen (vorher 12), sonst wie oben. Animes unverändert (AniList + Synchro-Abschnitt in der deutschen Wikipedia).
- sw.js: Cache `jj-watchlist-v9`.

### Neu: Hinweise auf neue Staffeln (Serien + Animes)
- Daten (nur lokal, nicht in der Cloud): `SEA[id]` bleibt Array von Strings. Neu sind `SEAT[id]` = letzter Abruf (`anime-seasons-t-v1`) und `NEXT[id]` = `{label,name,date,status,live}` (`anime-seasons-next-v1`). `status` ist "soon" (neue Staffel angekündigt, `date` leer, JJJJ, JJJJ-MM oder JJJJ-MM-TT) oder "run" (Staffel läuft, `date` = nächste Folge).
- TVmaze: ein Aufruf `/shows/{tvm}?embed[]=nextepisode&embed[]=seasons`. AniList: `AQ` um `status`, `startDate{year month day}` und `nextAiringEpisode` erweitert. Unausgestrahlte Anime-Staffeln landen jetzt in `NEXT` statt in `SEA`. `prog` wird nie gekürzt, `seaHtml` zeigt höchstens die Staffelzahl.
- Relevant (`seaRel`): auf einer Watchlist, `prog > 0` in irgendeiner Ansicht, oder abgeschlossen mit ≥ 3 Sternen. Abgelehnt oder entfernt zählt nicht (außer wieder auf einer Watchlist).
- `seaTick()` beim Start und stündlich: relevante Titel neu laden nach 3 Tagen, bei laufender Staffel oder Start in ≤ 14 Tagen täglich. Nutzt die bestehende Warteschlange `SQ`/`seaFetch` (30 s Pause bei 429). Fehler: alte Daten bleiben, nächster Versuch frühestens nach 1 h.
- Pro Gerät: `wl-season-seen-v1` (bekannte Staffelzahl; erster Abruf = Ausgangsstand, keine Flut), `wl-season-soon-hide-v1` (ausgeblendete Termine), `wl-season-toast-v1`.
- Anzeige: `#sban` über `#rec` (eine Zeile oder aufklappbar bei mehreren), Badge „🆕 S3“ (`seaBadge`) in Watchlist, Abgeschlossen und Verlauf, „Nächste Staffel …“ bzw. „Läuft gerade …“ im Info-Fenster (`seaNextHtml`), Toast bei neuer Staffel.
- sw.js: Cache `jj-watchlist-v10` (API-Antworten werden wie bisher nicht gecacht).

### Neu: Seitenleiste mit Account-Reiter (wie claude.ai)
- Markup: `<aside id="side">` (Titel, Bereiche `.snb[data-top]`, ⚙ `#gear`, Account-Reiter `#acc` mit `#accp` Panel + `#accb` Karte), `<header id="mtop">` (nur Handy: ☰ `#hamb`, Titel, Cloud-Status `#cst`), `<main id="main">` mit Kopfzeile `.ctop` (`#cth` Bereich/Tab, `#ctv` Liste, Suche + „Alle Titel“), Handy-Knopf `#accfab` und Bottom-Sheet `#sheet`. `#menu`, `#modal`, `#who`, `#brw`, `#rw`, `#toast` liegen jetzt auf Body-Ebene (sonst lägen sie in Manga/Baby hinter der Leiste, weil `main` dort einen eigenen Stapelkontext hat).
- Entfallen: `#lsw`, `.tabrow`/`#tabh`, `nav.tabs.top`, `#mechip`. Ihre Aufgaben: Ansichtszeilen `data-view`, Statistik/Verlauf/Watchlist `data-tab`, „Person wechseln“ `data-whoopen` – alles im Reiter (`accPanel()`), gleiche Aktionen wie vorher.
- Layout `lay()`: "d" ≥ 1024 px (Leiste 284 px, Reiter unten; Titel/Bereiche/Karte bleiben stehen, nur das Panel scrollt bei wenig Höhe), "t" 768–1023 (Icon-Leiste 84 px, Panel schwebt), "m" < 768 (Drawer `drawer`, Bottom-Sheet `sheet`, Fokusfalle, `inert`, Scroll-Sperre `html.navlock`, Escape/Klick daneben schließen, Fokus zurück).
- Zustand Reiter auf/zu: localStorage `wl-acc-open` (pro Gerät, nicht in `ST`). Auf Tablet startet er zu.
- Mini-Statistik `miniStats()`: Kandidaten nur aus echten Daten (offene Bewertungen, gesehen ohne Sterne, Staffel-Hinweise, Monat ≥ 2, Einigkeit ab 5 gemeinsamen Titeln mit Regel ≤ 1 Stern wie im Rewind, zuletzt bewertet, Lieblingsgenre, Rewind-Countdown/„ist da“, Gesamtzahl), Top 5 nach Wert. Cache-Schlüssel aus Bereich/Ansicht/Daten. Genau ein `setInterval(mstTick,6000)`; pausiert bei Hover/Fokus, verdecktem Tab, zugeklapptem Reiter; bei reduzierter Bewegung nur die beste Kennzahl ohne Wechsel. Keine Live-Region.
- Themes: eigene Regeln für purple (schräg, Anton, Cyan-Kante) und baby (Regenbogen-Kante, Pillen); hell/dunkel über Tokens.
- Toast ist im Inhaltsbereich zentriert, auf dem Handy über dem Account-Knopf.
- sw.js: Cache `jj-watchlist-v11`.
- Nachträge aus der Gegenprüfung: Titel in der Leiste einzeilig (Desktop und Drawer), Sync-Status klein oben rechts im Reiter („ANSICHT · ☁️ 14:02“, Klick → Einstellungen), Reiter scrollt in einem inneren Bereich `.accs` (Rahmen bleibt, Scrollposition bleibt beim Neuzeichnen, Ausblend-Hinweis oben/unten, bei Statistik/Verlauf wird der aktive Punkt ins Bild geholt). Bei 1440×900 passt der offene Reiter ganz, bei 1024×768 scrollt er.
- Mitbehoben: Verlauf-Zeilen auf dem Handy (Sterne neben den Namen, Knopf darunter), Rewind-Banner im dunklen Design mit dunkler Schrift (Kontrast), Statistik-Kacheln füllen die Breite (`auto-fit`), Zähler im Bottom-Sheet sichtbar.

### Update: Lila/Manga-Theme ausgebaut
- Kopfzeile `.ctop` als Manga-Titelpanel: Episoden-Kicker je Bereich/Tab (第01話 ANIME-ARC, 第02話 FILM-ARC, 第03話 SERIEN-ARC, 回想 FLASHBACK = Verlauf, 特別編 SPECIAL = Statistik), Titel mit Kontur + Versatzschatten, „ドン!“-Soundeffekt, Katakana-Wasserzeichen (アニメ/エイガ/シリーズ), Speedlines + Rasterpunkte.
- `#ctv` als Namensschild in Personenfarbe (Josefine pink, Johann cyan/violett, Zusammen Verlauf + 💞). `.sub` als weiße Sprechblase mit Schwänzchen.
- Eyecatch beim Bereichswechsel (diagonaler Wischer mit Katakana, 0,75 s; aus bei reduzierter Bewegung). Aktiver Bereich in der Leiste mit Katakana-Wasserzeichen.
- Technik: `renderSide()` setzt `data-sec/-tab/-view/-kana` an `main` und `data-kana` an `.ctop`; alles Weitere reines CSS unter `:root[data-theme="purple"]`.
- sw.js: Cache `jj-watchlist-v12`.

### Update: Statistik in die Seitenleiste
- „📊 Statistik“ mit Mini-Kachel steht jetzt fest in der Leiste unter „Einstellungen“ (`#sstat`, gebaut in `renderSide()`), nicht mehr im Account-Reiter. Der Reiter enthält Ansicht, Verlauf, Watchlist, Person wechseln.
- Handy: im Bottom-Sheet bleibt Statistik zusätzlich drin (`accPanel(true)`), im Drawer steht sie in der Leiste. Tablet: nur das 📊-Icon, ohne Kachel.
- Mini-Statistik läuft, wenn die Leiste sichtbar ist (Desktop, offener Drawer oder Sheet).
- sw.js: Cache `jj-watchlist-v13`.

### Neu: Swipe-Abstimmung „💞 Swipen“
- Einstieg: Reiter-Abschnitt „Filmabend“ (🎲 Würfeln = `data-roll`, 💞 Swipen = `data-swipe`, mit Status wie „Josefine wartet auf dich“ / „2 Matches“), Knopf `#swb2` neben dem Würfel, Badge 💞 an Account-Karte/-Knopf (`vHot()`).
- Ebene `#sw` (z-index 18: über `#modal`/`#brw`, unter `#who`/`#rw`/`#toast`). Bildschirme in `swHtml()`: Start (Quelle/Stimmung = dieselben `data-rsrc`/`data-mood` wie der Würfel, Kandidaten aus `rollPool()`, 3–25 Karten), Intro, Karte (Pointer-Wischen mit Stempel, Schwelle 30 % oder schnell, ✖/↶/❤️, Pfeiltasten, Backspace), Abschicken, Übergabe (ein Handy), Warten, Ergebnis (Info, ＋ Watchlist über `data-sadd`-Logik mit Platzlimit, „Heute schauen“, Würfeln unter den Matches = Würfelquelle `rollSrc="match"`).
- Zustand `VOTE` NICHT in `ST`: localStorage `wl-vote-v1` (+ `-ts`, `-gone`, `-seen`), Cloud-Zeile `section='vote'` über neue RPCs `wl_get_vote`/`wl_put_vote` aus **supabase-vote.sql** (einmal im SQL-Editor ausführen; bestehende RPCs/Daten unverändert). Ohne diese RPCs ist „Jeder am eigenen Handy“ ausgegraut.
- Sync: jede Person schreibt nur `v/seq/done[ich]`; bei `conflict` neu laden, `vMerge()` (eigener Teil lokal, fremder aus der Cloud, neuere Abstimmung gewinnt), erneut schreiben (max. 4×). Stimmen gebündelt nach 1 s (`vQueue`), ein 4-s-Intervall nur bei laufender Zwei-Handy-Abstimmung und sichtbarer Seite; sonst wird die Zeile beim normalen `cloudPull` (wl_get liefert sie mit) gelesen. Offline: weiterwischen, Upload bei `online`.
- Ablauf nach 24 h, Abbrechen synchronisiert (`cancel`). Rewind-Protokoll: `ST[sec].votes=[{id,t,matches,pick}]`, einmalig von der erstellenden Person bzw. dem einen Handy.
- sw.js: Cache `jj-watchlist-v14`.

### Update: Swipe-Abstimmungen im Rewind
- Protokoll `ST[sec].votes` (synchronisiert mit dem Bereich, `mig()` ergänzt fehlendes Feld als `[]`): pro abgeschlossener Abstimmung genau ein Eintrag
  `{id,t,mode:"2"|"1",n,c:[Kandidaten],yes:{jos,joh},m:[Matches],pick,by}` – nur IDs. `t` = spätestes „Abschicken“ (`VOTE.doneT`, auf beiden Geräten gleich). `c` zusätzlich zum Auftrag, nötig für den „ewigen Kandidaten“.
- `vLog()`: beide Geräte dürfen schreiben, vorher Prüfung per `id`; läuft nach `vFinish`, jedem `vApply`, jedem `cloudPull` und vor „Beenden“ – so kommt ein Eintrag zurück, falls „Cloud gewinnt“ ihn überschrieben hat. Nie bei Abbruch/Ablauf. `pick` („Heute schauen“ oder Würfel-Gewinner unter den Matches) wird nachgetragen. Über 500 Einträge: die ältesten fallen weg.
- `rewindData().vote`: Abstimmungen nach Jahr von `t` (Berlin), Duplikate per `id` nur einmal; Anzahl, Matches, Match-Quote (Matches ÷ Karten), Ja-Quote pro Person (`q`), `picky`, Picks/geschaut (Abschluss innerhalb 7 Tagen nach `t`), Match des Jahres (geschauter Pick mit bester gemeinsamer Bewertung), ewiger Kandidat (≥ 3× zur Wahl, nie Match), Lieblings-Stimmung (häufigstes Genre der Matches), persönlich: `noMatch`.
- Slide `abstimm` nach „Rekorde“, nur ab 2 Abstimmungen; Awards „💞 Match des Jahres“, „🙅 Der/Die Wählerischste“ (nur gemeinsam), „⏳ Der ewige Kandidat“; Abschlusskarte und Teilen-Bild mit „X Abstimmungen · Y Matches“.
- sw.js: Cache `jj-watchlist-v15`.

### Neu: Abzeichen, XP, Level und Haustier
- 380 Abzeichen in 13 Kategorien (Meilensteine, Bereiche, Zusammen, Bewerten, Genres, Jahrzehnte, Rhythmus, Feiertage, Entdecken, Staffeln, Filmabend, Jahrgänge – jedes Jahr kommen neue dazu –, 10 geheime). Stufen Bronze 25 / Silber 50 / Gold 100 / Platin 200 / Legendär 400 XP. Katalog in `achDefs()`, Kennzahlen in `achStats(u)`.
- Berechnet aus ST (nichts gespeichert), pro Person; „zusammen“ zählt für beide; „erreicht am“ aus Zeitstempeln. `achFor(u)` cached (max. alle 1,5 s, nur bei geänderten Daten), ~3 ms.
- XP = Abzeichen + Aktivität (10/Titel, 2/Bewertung, 3/Notiz, 5/Abstimmung, 1/Staffel). Level: L→L+1 kostet 100 + 50·(L−1) XP; Ränge in `RANKS`.
- Haustier: Ei bis Level 2, dann Art wählen (12 Arten, `PETS`), Stufen Lv 10/25/50/75 (Accessoires, Größe, Glanz). Art/Name in `ST.film.pets[u]` (synchronisiert). Klick = Sprechblase mit passenden Sprüchen (`petSay`).
- Feiern: `achCheck()` nach jedem render (1,5 s verzögert): neue Abzeichen/Level-Up als Toast (+ Konfetti beim Level). Pro Gerät in `wl-ach-seen-<u>` / `wl-ach-lvl-<u>`; beim allerersten Mal nur eine Zusammenfassung.
- UI: Leiste „🏅 Abzeichen Lv N“ + Haustier unter der Statistik-Kachel; Tab `tab="ach"` (`#v-ach`, `achHtml()`), auch im Handy-Sheet. Themes: Manga/Baby-Varianten.
- sw.js: Cache `jj-watchlist-v16`.

### Neu: Folgen sehen und abhaken (Serien und Animes, auch automatisch ergänzte)
- Daten (nur lokal, wie `SEA`): `EPS[id]` in localStorage `anime-episodes-v1` = je ausgestrahlter Staffel `{n, t}`; `t` = `[[Titel, Datum], …]` bei Serien, `null` bei Animes.
  - Serien: TVmaze `/shows/<tvm>?embed[]=nextepisode&embed[]=seasons&embed[]=episodes`, nur nummerierte, schon ausgestrahlte Folgen (keine Specials). Titel ohne TVmaze-ID werden wie bisher per Name gesucht.
  - Animes: AniList-Feld `episodes` je Staffel der Fortsetzungskette; laufende Staffel = `nextAiringEpisode.episode − 1`. Keine Folgentitel, daher Zahlenraster.
  - Abruf über die bestehende Staffel-Warteschlange (`seaNeed` beim Öffnen, `seaTick` für alle Listen-/Fortschrittstitel). Titel ohne `EPS` werden sofort nachgeladen, sonst alle 3 Tage bzw. täglich bei laufender Staffel.
- Fortschritt (synchronisiert, pro Ansicht wie `prog`): `S.ep[ansicht][id][staffel]` = Anzahl gesehener Folgen nur für nicht ganz gesehene Staffeln. Eine abgehakte Staffel (`prog ≥ s`) zählt als „alle Folgen“.
  - Letzte Folge einer Staffel → `prog` rückt vor (auch über danach schon volle Staffeln), mit `progT`-Zeitstempel und Toast.
  - Folge in einer abgehakten Staffel zurücknehmen → `prog = s−1`; die Staffel wird zum Teilstand, spätere bleiben als „voll gesehen“ in `S.ep`.
  - Staffel-Leiste (`data-sea`) räumt Teilstände bis zur neuen Staffel weg und nimmt danach volle Staffeln mit.
  - Alles über `snap()` rückgängig machbar.
- UI:
  - Karte: Knopf `.epnx` „✓ S2 · E6/10“ (bei nur einer Staffel „✓ E6/10“) hakt die nächste Folge ab.
  - Detailfenster: Block `.eps` mit Staffel-Chips, Seiten zu je 100 Folgen, Liste (Serien, Titel + Datum) bzw. Raster (Animes). Antippen hakt bis dahin ab, nochmal antippen nimmt die letzte zurück.
  - In fremden Listen nur Ansicht, keine Knöpfe.
  - Schlägt der Abruf fehl: „Folgen gerade nicht abrufbar“.
- Abzeichen/XP zählen Folgen bewusst (noch) nicht, weil `EPS` nur lokal ist und beide Geräte sonst kurz unterschiedliche Werte hätten.

### Update: Lila-Theme ruhiger
- Ein Override-Block am Ende von `<style>` („Lila, etwas ruhiger“). Die ursprünglichen Regeln sind unverändert; den Block löschen = altes Lila.
- Weicheres Cyan (`--cy:#7fd3e6`), Hintergrund-Effekte auf 40 % (ohne fliegende Bälle und Speed-Lines), kein Titel-Glitch und keine wackelnde „ドン!“.
- Schlagschatten 2–5 px statt 6–10 px, Rahmen halbtransparent statt weiß.
- Kleinere Rang-Nummern und 完-Stempel, kein Neon-Glow an Sternen und Staffeln, kein pulsierender Karten-Hover.
- Dunkle statt weiße Sprechblase, ruhigere Seitenleiste mit Akzentstrich statt Vollfarbe.
- Die Kana-Wasserzeichen-Schräge setzt oben an (`transform-origin:top`), damit am Handy nichts 1 px seitlich überläuft.
- sw.js: Cache `jj-watchlist-v17`.

### Update: Account-Reiter schwebt (Desktop und Handy-Drawer)
- Problem: Seit Statistik, Abzeichen und Haustier in der Leiste stehen, blieb dem Reiter auf normalen Bildschirmhöhen nur ein schmaler Streifen mit Scrollbalken.
- Jetzt ist der Reiter ein Pop-up über der Account-Karte (`position:absolute; bottom:calc(100% + 8px)` in `.acc`), bis `100dvh − 120px` hoch. Er verdeckt beim Öffnen Statistik und Haustier, wie bei claude.ai. Tablet bleibt wie bisher.
- Schließen: Klick außerhalb (Erkennung per `pointerdown`, geschlossen wird erst nach dem eigentlichen Klick), Escape (Fokus zurück auf den Account-Knopf), Account-Knopf, im Handy-Drawer zusätzlich beim Schließen des Drawers. Startet immer zugeklappt.
- Filmabend-Knöpfe: Spalten `minmax(0,1fr)`, etwas kompakter. Vorher war „Swipen“ breiter als der Reiter, daher der waagrechte Scrollbalken. `.accs` scrollt nie seitlich.
- sw.js: Cache `jj-watchlist-v18`.

### Neu: Haustier-Sammlung, Josefines Animes, umkehrbare XP, Abzeichen-Check, XP pro geschautem Titel
- **Josefines Animes wieder da:** `SEC.anime.lists = ["jos","joh","both"]`. `seed()` behandelt eine eigene Liste als unbenutzt, solange im Verlauf nur Kopien aus „Zusammen“ (`via:"both"`) stehen. Josefines Anime-Liste startet so mit den aktiven Zusammen-Titeln. `seed()` läuft jetzt auch in `applyRemote`.
- **Haustiere:** 36 Arten (`PETS`), Freischaltung ab Level 2 bis 48, jede mit 2–7 eigenen Formen (z. B. Mitternachtskatze, Neunschwanz-Kitsune, Eisdrache). Insgesamt 205 Formen (`PFORMS`), jedes Level von 2 bis 50 schaltet mindestens eine frei.
  - Formen-Level: gleichmäßig bis höchstens `PET_MAX = 50`. Mit dem kompletten heutigen Katalog geschaut landet man bei etwa Level 52.
  - Aussehen: Emoji + Stil aus `PSTY` (Farbfilter, Aura, Begleit-Symbol).
  - Pro Person in `ST.film.pets[u] = {sp, v, name, born}` (synchronisiert). Nur die eigene Person wählt, die andere Sammlung ist nur ansehbar.
  - Alles wird aus dem Level abgeleitet. Sinkt das Level, fällt eine gesperrte Form auf die Grundform zurück, eine gesperrte Art auf das Ei. Kommt das Level wieder, ist die Wahl wieder da.
  - UI: Sammlung im Abzeichen-Tab (`petColl()`), anfangs freigeschaltete Arten plus die nächsten zwei, „Alle 36 Arten zeigen“. `pBreak()` setzt eine weiche Trennstelle vor den Tier-Teil langer Namen.
- **XP umkehrbar:**
  - Bewertungen und Notizen zählen nur für Titel im Verlauf, „Zurück in die Watchlist“ nimmt also alle XP des Titels weg.
  - `achCheck()` gleicht auch nach unten ab. Verlorene Abzeichen fallen aus `wl-ach-seen-<u>`, das Level in `wl-ach-lvl-<u>` sinkt mit (Toast „⬇️ Zurück auf Level …“). Beim Wiedererreichen wird erneut gefeiert.
  - Wurde die Leiste mit älterem Cache-Stand gezeichnet (`petKey`), zeichnet `achCheck()` sie neu.
- **Zusammen:** Was in „Zusammen“ abgeschlossen, gesehen, bewertet oder abgestimmt wird, zählt für beide (Listen `u` + `both`). Kein eigenes Haustier für „Zusammen“.
- **XP pro geschautem Titel:**
  - Schon der Gesehen-Haken (noch ohne Sterne) zählt 10 XP. Mit den Sternen wird daraus der Abschluss, der Titel zählt nur einmal.
  - „Schon vorher gesehen“ zählt 5 XP.
  - Toasts zeigen die XP-Differenz (`xpTag`), in „Zusammen“ mit „für euch beide“.
- **Abzeichen (399, ab 2027 jedes Jahr +5):**
  - Entfernt, weil mit dem Katalog unerreichbar: Jahrzehnte 60er/70er, Western 25/50/100, Musik/Sport/Animation 100, „3 000 Titel“, Jahrgänge 2024–2026 (Jahrgänge erst ab 2027).
  - Neu, 47 Stück: Kritiker pro Bereich, Kommastellen-Bewertungen, beide begeistert, beide notiert, Wochenende, Feierabend, Ostern, Nikolaus, 3. Oktober, Freitag der 13., Grusel-Oktober, großer Swipe-Stapel, Dreifach-Match, Premiere in der ersten Woche, alte Liebe (vor 2000), 90er/00er/10er/20er 100/250.
  - „Einmal erreicht bleibt erreicht“ statt Momentaufnahme: Glückssieben (777. Titel), Ausgeglichen (irgendwann gleich viele Filme wie Serien), Unbestechlich und Weiches Herz (die ersten 50 bzw. 30 Bewertungen), Volles Haus (10 Titel in 7 Tagen), Katalog-Prozente gegen den festen Grundkatalog, 5+/10+ Staffeln nach abgehakter Zahl.
  - Erreichbarkeit automatisch geprüft (synthetischer Stand: ganzer Katalog über 12 Jahre). Übrig blieben nur verhaltensabhängige Abzeichen, die einzeln getestet sind.
- **Rewind:** `achXpAt(u,t)` liefert die XP zu einem Zeitpunkt (ohne Zeitstempel zählt „jetzt“).
  - `rewindData().lvl`: Level am Jahresanfang und -ende, XP, Abzeichen im Jahr, neue Haustier-Formen, Begleiter.
  - Slide „Level & Haustiere 🐾“, Awards „Abzeichen-Jäger(in)“, „Level-Sprung“, „Begleiter“, Level auf der Abschlusskarte.
- sw.js: Cache `jj-watchlist-v19`.

### Neu: Kisten mit Alltagsgegenständen (XP-Multiplikator)
- **Wann:** nach jedem 5. abgeschlossenen Film und nach jeder 5. Staffel (Serien und Animes). Schlüssel `f5`, `f10` … bzw. `s5`, `s10` … (`chList()`).
  - Staffeln (`X.seasC`): abgehakte Staffeln zählen einzeln (Zeit = Haken). Ein abgeschlossener Titel zählt alle ausgestrahlten Staffeln (`SEA`), ein Titel mit nur einer Staffel also genau eine.
  - Ohne geladene Staffeldaten zählt ein abgeschlossener Titel vorerst als eine.
- **Gegenstände:** 100 Stück in `ITEMS` `[id, Name, Emoji, Seltenheit 0–5, Multiplikator, Text]`.
  - Gewöhnlich 30 (grau, ×1,03–1,05), Ungewöhnlich 25 (grün, ×1,08–1,13), Selten 20 (blau, ×1,2–1,35), Episch 13 (lila, ×1,4–1,7), Legendär 8 (gold, ×1,8–2,5), Mythisch 4 (rot, ×3–5).
  - Chancen 45/27/15/8/4/1 %, jede 4. Kiste mindestens selten, innerhalb der Seltenheit erst Gegenstände, die noch fehlen.
  - Der Gegenstand ist fest aus Person + Kisten-Schlüssel (`chRng`, `chItem`): beide Geräte sehen dasselbe, kein Neu-Würfeln.
- **Wirkung:** Boni addieren sich (×1,1 und ×1,2 ergeben ×1,3), zusammen höchstens ×5 (`MULT_MAX`).
  - `achSim()` spielt alle XP-Ereignisse zeitlich ab. Ein Gegenstand wirkt ab dem Öffnen der Kiste, frühestens ab dem 5. Film bzw. der 5. Staffel. Nicht rückwirkend.
  - Öffnungszeit in `ST.film.pets[u].ch[key]` (synchronisiert). „Rückgängig“ setzt Haustier und Kisten nicht zurück.
  - Holt ihr einen Film zurück oder nehmt Staffel-Haken weg, verschwindet die Kiste samt Gegenstand (Toast). Beim Wiedererreichen ist derselbe Gegenstand wieder da, schon geöffnet.
- **UI:**
  - Popup `#chest` (z-index 23) mit gezeichneter Kiste: wackeln, Deckel auf, Gegenstand mit Seltenheitsfarbe und Strahlen; Mythisch mit Regenbogen und Feuerwerk.
  - Kommt von selbst, aber nicht während Rewind, Swipen oder Personenwahl. „Alle N Kisten öffnen“ mit Liste. „Später“/Escape schiebt alle offenen Kisten für die Sitzung auf (pro Person).
  - Fokusfalle im Popup, Toasts wandern nach oben, solange es offen ist.
  - Leiste: „Lv N · ×1,3“ und Knopf „🎁 Kiste öffnen“; Handy-Sheet ebenso; im Abzeichen-Tab „Kisten & Gegenstände“ mit Multiplikator, nächster Kiste, gefundenen Gegenständen, Chancen und Sammelalbum.
  - Haustier erinnert an offene Kisten; XP-Toasts zeigen den Multiplikator.
- **Rewind:** Level-Slide mit Kisten des Jahres (die 6 besten, Rest als Zahl) und Multiplikator am Jahresende. Award „🎁 Fund des Jahres“, Abschlusskarte und Teilen-Bild mit Level, Multiplikator und bestem Fund.
- **Tempo:** Im Schnitt bringt eine Kiste etwa +0,27. ×5 ist nach rund 15 Kisten erreicht (ca. 75 Filme/Staffeln); langsamer geht es über kleinere Werte in `ITEMS`.
- sw.js: Cache `jj-watchlist-v20`.

### Update: Kisten nur für seit der Watchlist Geschautes
- Kisten zählen nur Abschlüsse ohne „schon vorher gesehen“ (`X.chF`). Erkannt wird das am `pre`-Flag des Abschlusses und bei alten Einträgen an `w[id].pre[person]`.
- Serien/Animes, die vorher gesehen wurden, zählen auch mit abgehakten Staffeln nicht für die Staffel-Kisten.
- XP für „schon vorher gesehen“ (5) und alle Abzeichen bleiben unverändert.
- sw.js: Cache `jj-watchlist-v21`.

### Neu: Inventar mit drei Plätzen und Sets
- **Gegenstände neu:** 35 Sets aus je drei (`SETS`), zusammen 105 Gegenstände. Jedes Teil gehört zu genau einem Set, z. B. Strandtag = Badelatschen, Sonnenbrille, Sonnenschirm.
  - Set-Bonus (+0,10 bis +2,0) wird zum Multiplikator addiert. Flache Liste `ITEMS` mit Set-id an Stelle 6.
- **Wirkung:** nur noch die bis zu drei ausgerüsteten Gegenstände (`eqVal`). Sind alle drei aus einem Set, zählt der Set-Bonus. Deckel ×5.
  - Ausrüstungs-Verlauf `ST.film.pets[u].eqH = [[Zeit, [ids]], …]` (synchronisiert, Änderungen innerhalb von 2 Min. zusammengefasst, max. 300).
  - `achSim` nimmt zu jedem XP-Ereignis die damalige Ausrüstung: Umrüsten wirkt nur auf neue XP.
  - Ohne Eintrag gilt automatisch die beste Auswahl (`eqBest`: die drei stärksten oder ein komplettes Set, je nachdem, was mehr bringt). Nach dem Update fehlt also niemandem etwas.
- **Chancen (`chItem`):** Seltenheit wie bisher (45/27/15/8/4/1 %).
  - Fehlende Teile eines begonnenen Sets kommen 4× so oft (`SET_AFF`), das letzte fehlende Teil 10×. Doppelte nur noch mit 0,15-fachem Gewicht.
  - Jede 4. Kiste ist mindestens selten.
- **Kiste:** zeigt Set und Fortschritt (z. B. „? 💻 ⌚ 2/3 – nur noch eins fehlt“). Wer selbst ausrüstet und einen freien Platz hat, bekommt den neuen Gegenstand direkt ausgerüstet (`chFill`). „Im Inventar ausrüsten“ führt zum Tab.
- **Seitenleiste:**
  - „Einstellungen“ ist in den Account-Reiter gewandert (`.agear`, `data-gear="2"`). Klicks im Menü schließen den Reiter nicht.
  - Neu: „🎒 Inventar ×…“ und unter dem Haustier drei Plätze (`eqBar`). Antippen öffnet das Inventar mit diesem Platz.
  - Handy-Sheet: Inventar und Einstellungen ebenso.
- **Inventar-Tab** (`tab="inv"`, `#v-inv`, `invHtml`): drei große Plätze, Multiplikator mit Set-Bonus, Tipp „mit X wird Set Y komplett“, „Beste Auswahl“, „Alle ablegen“, offene Kisten.
  - Sets als Karten: komplett = gold hervorgehoben mit „Set ausrüsten“, 1 fehlt = orange gestrichelt mit Name des fehlenden Teils, begonnen, noch nichts.
  - Filter: Alle, Komplett, 1 fehlt, Begonnen, Ausgerüstet, Noch nichts (mit Anzahl). Antippen eines Gegenstands = ausrüsten/ablegen, erst einen Platz wählen = gezielt tauschen. Partner-Inventar nur ansehen.
- **Abzeichen-Tab:** statt der Gegenstandsliste ein Knopf zum Inventar.
- **Rewind:** Ausrüstung am Jahresende, im Jahr komplettierte Sets, Award „🧩 Set des Jahres“.
- **Haustier:** erinnert an fast komplette Sets, ungenutzte komplette Sets und freie Plätze.
- sw.js: Cache `jj-watchlist-v22`.

### Update: XP für doppelt gezogene Gegenstände
- Zieht eine Kiste einen Gegenstand, den die Person schon hat (`chList`: `c.dup`), gibt es XP nach Seltenheit: `DUP_XP = [25, 50, 100, 200, 400, 800]` (gewöhnlich … mythisch).
- Gutgeschrieben in `achSim` zum Öffnungszeitpunkt (mal dem Multiplikator dieses Moments), also nicht rückwirkend. Fällt die Kiste weg (Film/Staffel zurückgeholt), sind die XP wieder weg.
- Anzeige: Popup „🔁 Hast du schon – dafür +N XP“, „Alle öffnen“-Liste mit „doppelt · +N XP“ und Summe, Inventar mit Bisher-Summe, XP-Erklärung im Abzeichen-Tab. Doppelte werden nicht automatisch ausgerüstet.
- sw.js: Cache `jj-watchlist-v23`.

### Einmaliger Kisten-Neustart
- `CH_RESET = 1`: Beim ersten Laden der neuen Version (oder beim Übernehmen eines alten Cloud-Stands) werden pro Person `ch` (geöffnete Kisten) und `eqH` (Ausrüstung) geleert und `rs = 1` gesetzt (`chReset()`, synchronisiert). Haustier und Name bleiben.
- Die Ziehung bekommt das Salz `|r1`: Alle bisher verdienten Kisten sind wieder zu und liefern neue Gegenstände. Läuft nur einmal (Merker `rs`).
- Erneut alles zurücksetzen: `CH_RESET` um 1 erhöhen.
- Folge: Bonus-XP aus Multiplikator und Doppelten sind weg, bis neu geöffnet wird; das Level kann dadurch sinken.
- sw.js: Cache `jj-watchlist-v24`.

### Update: Bereiche wieder oben
- Animes / Filme / Serien stehen wieder als Tabs oben im Inhalt (`.ctabs .ttab[data-top]` im Kopf `.cth`), nicht mehr in der Seitenleiste. Gilt auch für Tablet und Handy.
- Die große Überschrift („Serien“ usw.) ist weg; `#cth` bleibt nur für Screenreader (`.sr`, gegen Theme-Regeln abgesichert). Der Untertitel nennt die Liste und ggf. den Tab („Johanns Liste · Inventar“).
- Seitenleiste: Titel, dann Statistik, Abzeichen, Inventar, Haustier, Plätze (Trennlinie über der Statistik).
- sw.js: Cache `jj-watchlist-v25`.

### Update: Folgen korrigieren
- Auf der Karte neben „✓ E…“: **−** nimmt die zuletzt gesehene Folge zurück (`data-epback`), **✎** öffnet das Info-Fenster direkt bei den Folgen (`data-epjump`) und setzt den Fokus ins Zahlenfeld.
- Im Info-Fenster: Feld „Gesehen bis Folge [n] / max“ je Staffel (`data-epto`, übernommen bei Enter/Verlassen). 0 setzt die Staffel zurück.
- Antippen einer früheren Folge im Raster setzt den Stand dorthin (wie bisher). Alle drei Wege laufen über denselben Code im `act()`-Zweig `d.ep||d.epback||d.epto`, mit Rückgängig.
- Sicherheit: Fremde Titel (eigene, Neuerscheinungen, Cloud) werden beim Laden bereinigt (`cleanTitle`/`loadExt`), das Info-Fenster für Filme/Serien maskiert alle Werte.
- sw.js: Cache `jj-watchlist-v27`.

### Update: Katalog erweitert (+999 Filme, +555 Serien)
- **Filme** (jetzt 1978 aktive): die nächsten 999 Filme ab 1980 nach IMDb-Stimmenzahl (≥ 150 Tsd. Stimmen), ohne Genre-Grenze, ohne Dokus und japanische Animationsfilme, nur mit deutschem Wikipedia-Artikel. Angehängt am Ende von `FILMS`.
- **Serien** (jetzt 1160): 555 weitere Serien/Miniserien nach IMDb-Stimmen (≥ 22 Tsd.), ohne Talk-/Reality-/Game-Shows, Dokus, japanische Animation, indische/türkische Serien, nur mit deutschem Wikipedia-Artikel. Angehängt am Ende von `SERIES` (für `fillSerie` also nach den bisherigen).
- Daten: IMDb-Datensätze (Wertung, Stimmen, Laufzeit, Genres), Wikidata (dewiki-Artikel, FSK, Herkunftsland), deutscher Titel = dewiki-Artikelname ohne Klammerzusatz, Kurztext = Anfang des Abschnitts „Handlung“ (sonst Einleitung) der deutschen Wikipedia, Filmplakate aus der englischen Wikipedia, Serien-Cover + TVmaze-ID von TVmaze. Genre (`gl`) und Tags automatisch aus den IMDb-Genres (90er-Look 1990–2002, kurz ≤ 95 min, lang ≥ 150 min, „düster“ bei Horror bzw. Krimi-Thriller).
- sw.js: Cache `jj-watchlist-v28`.
