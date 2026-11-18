# Übergabe: Josefines und Johanns Watchlist

Stand: 15.11.2026. Eine einzelne HTML-Datei, Sprache Deutsch.

## Dateien in diesem Ordner
- `index.html` – die Seite (wird von GitHub Pages ausgeliefert); `watchlist.html` ist eine identische Kopie (nach Änderungen `cp index.html watchlist.html`)
- `sw.js`, `manifest.webmanifest`, `icon-180.png`, `icon-192.png`, `icon-512.png` – Home-Bildschirm-App und Offline-Start
- `.nojekyll` – GitHub Pages liefert alle Dateien unverändert aus (ohne Jekyll)
- `supabase-setup.sql` – Einrichtungs-Skript für die Datenbank, im Repo nur mit Platzhalter. **Den echten Haushalts-Code nie eintragen und hochladen.**

## Aufbau der Seite
- **Kopf:** Überschrift „Josefines ♥ Johanns“ (Herz halb pink, halb lila, schlägt), rechts Cloud-Symbol (☁️/⏳/⚠️), Personen-Chip, Zahnrad.
- **Zahnrad-Menü:** Design (Hell, Dunkel, Lila, Baby mit Einhörnern, Kinopalast, Tiefsee, Origami, Auto), Cloud-Sync (Status, „Jetzt abgleichen“, „Gerät abmelden“), Backup speichern/laden, „Alles zurücksetzen“ (alle Bereiche, mit Rückgängig).
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
- **Stand 15.11.2026:** 4.697 aktive Filme, 2.835 Serien, 2.550 Animes. Die Zahlen darunter sind der ursprüngliche Stand; die Erweiterungen stehen in den „Update“-Abschnitten.
- **Animes:** ca. 243 Titel (`BASE`, `CAND`, `BULK`), Cover/Infos online (AniList → Kitsu → Jikan).
- **Filme:** 500 Realfilme (Horror, Thriller, Psycho, Mystery) in `FILMS`. Format pro Zeile: `IMDb-ID|Titel|Original|Jahr|IMDb|Stimmen|FSK|Cover|Tags|Genre|Beschreibung|de-Wikipedia-Artikel`. Alle mit belegter deutscher Synchro (Synchronkartei, Wikipedia oder deutscher Originalfilm). Start-Filme in `FILM_START`.
- **Serien:** 600 beliebte Serien (Top nach IMDb-Stimmen, ohne japanische Animes, indische/türkische Serien und Talkshows) in `SERIES`. Format wie `FILMS` plus 13. Feld = TVmaze-ID. Wertung/Stimmen aus den IMDb-Datensätzen (Okt. 2026), Cover von TVmaze, deutsche Titel aus TVmaze-AKAs bzw. Handarbeit, Beschreibungen selbst geschrieben. FSK und Wikipedia-Artikel leer (Wikipedia-Text wird per Suche „Titel Fernsehserie Jahr“ gefunden). Start-Serien in `SERIE_START`.
- **Speicherung:** Browser (`anime-watchlist-v3`, `film-watchlist-v1`, `serie-watchlist-v1`, Datenformat `v:2` mit `lists.jos/joh/both`, `w` = Bewertungen, `notes`, `custom`) plus Cloud.

## Cloud (Supabase)
- Projekt-URL: `https://inqhfkoxmftyellmrxop.supabase.co` (seit 13.11.2026; vorher fotnvxalffqrlsltyazc), öffentlicher Schlüssel steht in `const CLOUD` in der Seite.
- Tabelle `wl_state` (ein Eintrag pro Bereich), Zugriff nur über die Funktionen `wl_get` / `wl_put` mit Haushalts-Code. Tabellen sind von außen gesperrt (geprüft).
- Pro Gerät einmal den Haushalts-Code eingeben (Pflicht, keine lokale Option mehr). Abgleich nach Änderungen, beim Öffnen, beim Zurückwechseln in den Tab und alle 30 Sekunden. Bei gleichzeitigen Änderungen gewinnt der zuerst gespeicherte Stand.
- Kostenlose Projekte pausieren nach ca. 1 Woche ohne Nutzung → im Dashboard „Restore“.

## Hosting
- **GitHub Pages** (seit 14.11.2026): https://pxrple01.github.io/soulwatch12/ – wird bei jedem Push auf `main` automatisch neu veröffentlicht (1–2 Minuten). Kostenlos und ohne Kontingent pro Veröffentlichung, solange das Repo öffentlich ist. Einstellung: Repo → Settings → Pages → „Deploy from a branch“, `main`, `/ (root)`.
- Netlify (soulwatch.netlify.app) wird nicht mehr benutzt: Das kostenlose Kontingent war aufgebraucht („Usage exceeded“, Fehler 503). Dort die Builds stoppen oder die Seite löschen, sonst verbraucht jeder Push weiter Kontingent.
- Neue Adresse = neuer Speicher im Browser: auf jedem Gerät einmal Person wählen und den Haushalts-Code eingeben (die Daten kommen aus der Cloud) und das Home-Bildschirm-Symbol neu anlegen.

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
- Im Repo liegen `manifest.webmanifest`, `sw.js` (Offline-Start, lädt immer zuerst aus dem Netz; ohne Netz oder bei Server-Fehlern ab 500 startet die zuletzt gespeicherte Version) und die App-Symbole `icon-180/192/512.png` (Herz halb pink, halb lila mit Play-Zeichen).
- iPhone: https://pxrple01.github.io/soulwatch12/ in Safari öffnen → Teilen → „Zum Home-Bildschirm“. Die App hat einen eigenen Speicher, darum dort einmal Person wählen und den Haushalts-Code eingeben.
- `CACHE` in `sw.js` hochzählen ist nicht nötig (Netz zuerst), nur bei geänderten Datei-Namen. Die Installation speichert jede Datei einzeln, eine fehlende Datei bricht sie also nicht mehr ab.

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

### Update: Bewertungen jetzt 1–10 Sterne
- Skala 1,0–10,0 in 0,1er-Schritten (`RMIN=1`, `RMAX=10`). Sternleiste mit 10 Sternen (★/✦/💖, CSS `.rate .rbg/.rfg` mit `font-size:.66em`, damit sie etwa so breit bleibt wie vorher). Umschalt+Pfeil = ±1.
- **Umrechnung:** `mig()` verdoppelt einmalig alle Werte in `w[id].r` (0,5→1, 3,7→7,4, 5→10) und setzt `r10:1` im Bereich; `fresh()` setzt `r10` gleich. Gilt für Browser-Speicher, Cloud-Stände und Backups (alte Backups werden beim Laden umgerechnet).
- Alles angepasst: Konfetti/Einhorn/„ドン!!“ bei 10 Sternen („MEISTERWERK · 10/10“), Einigkeit (Einig ≤ 0,6, Fast einig ≤ 2,0; Statistik, Mini-Statistik und Rewind „einig“ ≤ 2,0, kontrovers > 2,0), Sterne-Verteilung 1–10, Geschmacksprofil (`(r-6)/4`), Staffel-Hinweise ab 6 Sternen, Rewind-Überraschung direkt gegen IMDb/AniList, Abzeichen (10 Sterne, ≤ 2 Sterne, ≥ 6 auseinander, ≥ 8 Sterne usw. – gleiche Abzeichen wie vorher, nur umgerechnet).
- Achtung: Beide Geräte einmal neu laden, damit keines mehr die alte Version benutzt (die würde neue Bewertungen noch auf 5 Sterne speichern).

### Update: +500 Animes, +59 Serien
- **Animes** (jetzt 1499): 500 der beliebtesten AniList-Titel (ab 1980, TV/Film/ONA/TV-Kurz), die noch fehlten, ohne Fortsetzungen, ohne Erotik (gleicher Filter wie bisher), Namens-Dubletten aussortiert. Angehängt an `ANIME2`, zwei neue Felder am Zeilenende: `dsrc` (Quelle der Beschreibung) und `dew` (dewiki-Artikel).
- Beschreibung: 201 auf Deutsch aus der deutschen Wikipedia (Abschnitt Handlung), 299 auf Englisch von AniList („Inhaltsangabe: AniList (englisch)“).
- Synchro: aniSearch war nicht erreichbar. `lang:"de"` nur mit Beleg im deutschen Wikipedia-Artikel (185), sonst leer = „Synchro unbekannt“ (neuer Filter beim Stöbern).
- **Serien** (jetzt 1214): die restlichen 59 Serien aus derselben Auswahl wie oben.
- sw.js: Cache `jj-watchlist-v29`.

### Redesign „Kino“ (Design + Bedienung überarbeitet)
- **Wo:** CSS-Block zwischen `/* KINO-START */` und `/* KINO-END */` am Ende des Stylesheets (neue Regeln also dort ergänzen), JS-Block „Redesign: Bewegung“ vor `render()`.
- **Zwei Ebenen:** Aufbau + Bewegung gelten für alle Designs. Das Aussehen (Farben, Glas, Polarlicht-Hintergrund, Farbverlauf-Knöpfe, Fraunces-Überschriften) gilt nur für Hell/Dunkel über `:where(html:not([data-theme="purple"],[data-theme="baby"]))` (erhöht die Spezifität nicht). Lila und Baby behalten ihren Stil und haben am Blockende eigene Regeln für die neuen Bausteine.
- **Empfehlung als Bühne** (`.rec`): unscharfes Cover als Hintergrund (`recBg`, nur https), großes Poster, Fortschritts-Punkte (`.rdots`), klarere Knöpfe: „＋ Auf die Liste“, „↻ Anderer Tipp“, „✓ Schon gesehen“, „✕ Nichts für mich“. Beim Wechsel Klasse `swap` (Poster dreht herein).
- **Karten:** Poster kippt der Maus hinterher (`--rx/--ry/--gx/--gy`, nur mit Maus), Glanzlicht, Schweben; gesehen = Häkchen-Plakette. Freier Platz: „＋ Platz frei“ mit Knopf „Titel aussuchen“ (öffnet Stöbern). Haken heißt „Schon gesehen?“ / „Gesehen“ und ist auf dem Handy wieder beschriftet.
- **Kurzanleitung** `#howto` (Aussuchen → Schauen → Bewerten), pro Gerät ausblendbar (`wl-howto-hide`).
- **Handy:** feste Leiste unten `#bnav` (Animes, Filme, Serien, Stöbern, Ich = bisheriger `#accfab`), oben nur noch der Bereichsname (`.cth[data-t]`). Info-Fenster kommt als Blatt von unten. Stöbern öffnet ohne Tastatur, Filter sind anfangs zugeklappt (`fo:false`). Meldungen in voller Breite.
- **Bewegung:** `fxEnter()` setzt nach Bereichs-/Tab-/Ansichtswechsel kurz `#main.enter` (gestaffeltes Einblenden über `--i`, Balken wachsen, Zahlen zählen hoch `fxCount`). Info-Fenster: Poster fliegt per View Transitions aus der Karte ins Fenster und zurück (`fxOpenInfo`/`fxCloseInfo`, `view-transition-name:poster`); `#modal.opening` nur beim Aufgehen, damit nichts bei jedem Neuzeichnen flackert (gilt jetzt auch für Lila/Baby). Scroll-Einblenden per `animation-timeline:view()` wo unterstützt. Alles aus bei „Bewegung reduzieren“.
- Wichtig beim Weiterbauen: keine zeitgesteuerten Animationen direkt auf Elemente legen, die `render()` neu aufbaut – immer an `#main.enter`, `.swap` oder `.opening` hängen.
- sw.js: Cache `jj-watchlist-v30`.

### Update: Animationen Runde 2 + Fehlerdurchgang
- **Karten gleiten (FLIP):** `fxSnap()` merkt sich vor dem Zeichnen die Poster-Positionen (`data-k` an den Karten, `#rec[data-k]`), `fxFlip()` animiert danach per Web Animations API. Dadurch fliegt der angenommene Tipp aus der Bühne in die Liste, eine bewertete Karte von der Liste zu „Abgeschlossen“, und die übrigen rücken weich nach. Nur im Watchlist-Tab, höchstens 60 Karten.
- **Einmal-Klassen:** `fxOnce(el,klasse,ms)` + `fxTidy()` – `enter`, `swap`, `opening` gelten nur für das DOM des Zeichnens, das sie gesetzt hat; beim nächsten `render()` werden sie entfernt (sonst startet die Animation neu).
- **Sterne:** Vorschau unter der Maus (`.rate.hov`, `--hv`, Wert als Blase), Funken beim Speichern (`fxBurst`, nur Hell/Dunkel), Zahl ploppt.
- **Navigation:** gleitende Markierung hinter dem aktiven Reiter oben und in der Handy-Leiste (`fxInk()` setzt `--ix/--iw`), Bereichswechsel gleitet aus der Richtung des Reiters herein (`--dir`).
- **Sonst:** Sternenhimmel über dem Polarlicht, Poster der Bühne schwebt, Hauptknopf schimmert, freier Platz „atmet“, Haken-Plakette dreht herein (`fx-seen`), Folgen-Knopf hüpft (`fx-ep`), Info-Fenster und Handy-Blatt staffeln ihren Inhalt, Stöbern öffnet weich.
- **Bedienung:** Leere Plätze sind zu einer Karte „N Plätze frei“ zusammengefasst (übrige `.slmore`, hidden). Abgeschlossene Titel am Desktop kleiner (`.grid.small` 132 px). Meldungen fangen keine Klicks mehr ab und rücken auf dem Handy nach oben, wenn unten ein Fenster offen ist. In fremden Listen keine Bedienhinweise (`#main[data-ro]`).
- **Behobene Fehler:** seitliches Verschieben auf schmalen Handys (Würfeln/Swipen-Knöpfe, Tipp-Knöpfe in Lila, Herzchen in Baby; zusätzlich `html,body{overflow-x:clip}`); Namens-Kollision bei `@keyframes` (meine `shine/bob/twinkle` überschrieben gleichnamige Theme-Animationen → Empfehlung im Baby-Design rutschte aus dem Bild; jetzt `kShine/kBob/kTwinkle`); Klasse `.ro` kollidierte mit dem Hinweisfeld (jetzt `.slro`).
- **Merke:** Neue `@keyframes`- und Klassennamen vorher im Stylesheet suchen – es gibt viele kurze Namen aus den Themes.
- sw.js: Cache `jj-watchlist-v31`.

### Neu: Extras (Finder, Marathon, Quiz, Landkarte, Poster, Ticket, Regal, Tönung, Auto-Design) + interaktiver Rewind
- **Wo:** JS zwischen `// EXTRAS-START` und `// EXTRAS-END` (vor `chReset()`), CSS zwischen `/* EXTRA-START */` und `/* EXTRA-END */` (nach dem Kino-Block). Alles liest nur vorhandene Daten aus `ST` – es gibt keine neuen Cloud-Felder.
- **Gemeinsame Ebene `#xo`** (wie Stöbern unter dem Info-Fenster, z9): `xoOpen(art)`, `xoRender()`, `xoClose()`; Arten `fin`, `mar`, `quiz`, `poster`. Aktionen laufen über `xAct(d)`, das am Anfang von `act()` gefragt wird. Einstiege: Knopf „🧭 Zeit & Stimmung“ neben Würfeln/Swipen, Abschnitt „Filmabend“ im Reiter, Knopfzeile im Statistik-Tab (`xStatBtns`).
- **Zeit-Budget + Stimmungs-Kompass (`fin`):** Laufzeiten in `RT` (IMDb-Minuten, Filme = Länge, Serien = Folgenlänge; Animes pauschal 24 min pro Folge, Filme 105). Kompass: jedes Genre hat in `MOODV` einen Platz auf „leicht–schwer“ und „ruhig–aufregend“, ein Titel liegt im Mittel seiner Genres (`moodOf`). Ergebnis: die 24 nächstgelegenen, noch nicht gesehenen Titel des Bereichs.
- **Marathon-Planer (`mar`):** Reihen in `MARA` als Muster auf den Originaltitel, sortiert nach Jahr; nur Reihen mit ≥ 2 Filmen im Katalog (derzeit 57). Fortschritt aus Sicht der aktuellen Ansicht (`maraSeen`), „＋ Auf die Liste“ für den nächsten Film. Öffnen wechselt in den Film-Bereich.
- **Quiz (`quiz`):** erst ab `QUIZ_MIN=8` bewerteten Titeln (über alle Bereiche). Fragearten: wer gab mehr Sterne, was zuerst gesehen, wie viele Sterne, welcher Titel besser, aus welchem Jahr. 6 Fragen pro Runde, höchstens 2 je Art.
- **Geschmacks-Landkarte** (`tasteHtml`, im Statistik-Tab): pro Genre der Sterne-Schnitt beider (je ≥ 2 Bewertungen), als Punktwolke mit ausweichenden Beschriftungen; dazu gemeinsames Lieblingsgenre, größter Unterschied, größte Einigkeit.
- **Jahres-Poster (`poster`):** Canvas 1240×1754 mit den Covern der bis zu 12 bestbewerteten Titel (`rewindData`), Jahr/Person wählbar, Teilen oder Speichern. Cover werden mit `crossOrigin` geladen (Wikimedia, IMDb, TVmaze, AniList erlauben das); schlägt das fehl, wird ohne Bilder gezeichnet.
- **Haustier schaut mit:** `petReact(id, "look"|"add"|"done")` setzt die Sprechblase passend zum Genre bzw. zur Bewertung; `petFav(u)` ist sein Lieblingstitel (fester Griff in eure Titel ab 7 Sternen). Am Handy erscheint die Blase kurz oben (`#petbub`). Nur mit geschlüpftem Haustier.
- **Seite färbt sich nach dem Titel:** `tintOf(id)` liest die Hauptfarbe des Covers (14×14-Canvas, sonst Farbe aus der ID), `tintApply()` färbt `#tint` (Hintergrund, folgt dem aktuellen Tipp) und `--tint` am Info-Fenster. Nur Hell/Dunkel.
- **Kino-Ticket:** `ticketShow(id)` beim Abschließen aus der Watchlist (nicht bei „schon gesehen“). **Verlauf** hat drei Darstellungen (`hview`, pro Gerät `wl-hview`): Liste, Regal (`.spine`, Höhe = Sterne, Sortierung „Nach Farbe“ neu) und Tickets (`.tkt.mini`).
- **Tag/Nacht von selbst:** Design „Auto“ (`anime-theme-v1="auto"`, `data-auto` am `<html>`): 7–19 Uhr hell, sonst dunkel; geprüft beim Start, alle 5 Minuten und beim Zurückkehren in den Tab.
- **Rewind interaktiv:** `rwInteractive()` fügt bis zu drei Tipp-Fragen vor die Auflösungen ein (Top-Titel, wer war strenger, stärkster Monat; Slide-ID `tipp`, Zustand in `slide.g`), Awards werden einzeln aufgedeckt (`rw.rev`, „Alle aufdecken“), Reaktions-Emojis auf jeder Slide (`rwReact`), Tipp-Bilanz auf der Schluss-Slide, Knopf „🖼 Als Poster“.
- Testhinweis: Bei vielen Testbewertungen geht das Kisten-Fenster auf und fängt Klicks ab – im Test `chShow=()=>{}` setzen.
- sw.js: Cache `jj-watchlist-v32`.

### Update: Bewertung als Zahl mit Regler, Weiterschauen, Empfehlungen, Glocke
- **Bewerten:** `rateHtml` zeigt jetzt große Zahl, Wort (`rWord`, „schwach“ … „Meisterwerk“) und einen Regler, der sich von Rot nach Grün färbt (`.rwrap.r2`, CSS-Variable `--rv` = Wert/10). Die Technik dahinter ist unverändert (`.rate[data-rate]`, Ziehen/Tippen, −/+, Tastatur). **Anzeigen:** `sst()` und `rwSt()` zeigen einen Stern mit Zahl („★ 7,4“; Lila ✦, Baby 💖). Die Zehn-Sterne-Leiste gibt es nicht mehr.
- **Weiterschauen** (`contHtml`, `#cont` über der Empfehlung): bis zu drei angefangene Serien/Animes der aktuellen Liste mit „✓ Folge n“ (nutzt die bestehende Aktion `data-ep`).
- **Empfehlungen:** im Info-Fenster „💌 … empfehlen“ mit optionaler Nachricht. Liegt in `ST.film.x.recs` (`{id,k,from,to,msg,t,st:"new"|"ok"|"no",at}`, höchstens 60) und wird mit dem Film-Bereich über die Cloud geteilt. Die andere Person sieht oben eine Karte (`recInHtml`, `#recin`): Auf meine Liste / Später / Nein danke.
- **Wer ist dran:** `ST.film.x.turn={last,t}`; wer in „Zusammen“ einen Titel auf die Liste setzt, hat gewählt (`xTurn`). In der gemeinsamen Ansicht steht, wer als Nächstes aussuchen darf, mit „tauschen“.
- **Glocke** (`#bell`, Ebene `news`): `newsList()` sammelt Bewertungen der anderen Person (aus `w[id].rt`, letzte 45 Tage, nur Titel, die einen betreffen), Empfehlungen und Antworten darauf, neue Staffeln, offene gemeinsame Bewertungen und wartende Swipe-Abstimmungen. „Neu“ = neuer als der letzte Blick (pro Gerät und Person: `wl-news-<person>`). Kommt beim Abgleich etwas dazu, erscheint eine Meldung und die Glocke läutet.
- **Nicht enthalten:** Mitteilungen aufs gesperrte Handy. Dafür bräuchte es einen Versand über den Server (Supabase) – die Glocke zeigt Neues nur, wenn die Seite geöffnet wird.
- sw.js: Cache `jj-watchlist-v33`.

### Update: Neues Supabase-Projekt
- Cloud läuft jetzt über `https://inqhfkoxmftyellmrxop.supabase.co` (neuer Account). Einrichtung mit `supabase-setup.sql` (Haushalts-Code dort nur als Platzhalter; echten Code nie ins Repo).
- Beim ersten Start nach dem Wechsel setzt die Seite den Abgleich-Stand zurück (`wl-cloud-proj`) und lädt den Stand des Geräts hoch. Das zuerst geöffnete Gerät legt den Cloud-Stand an, weitere Geräte übernehmen ihn.
- sw.js: Cache `jj-watchlist-v34`.

### Neu: Drei Designs „Kinopalast“, „Tiefsee“, „Origami“
- **Wo:** CSS zwischen `/* THEMES-START */` und `/* THEMES-END */` (ganz am Ende des Stylesheets, nach dem Extras-Block), JS zwischen `// THEMES-START` und `// THEMES-END` (nach dem Extras-Block, vor `chReset()`). Werte `data-theme="deco"`, `"sea"`, `"paper"` am `<html>`, gespeichert wie bisher in `anime-theme-v1`.
- **Auswahl:** Das Menü „Design“ ist jetzt ein Raster mit Vorschau-Kugeln (`.seg.thseg`, `.thp.p-…`, Plakette „Neu“ = `.thn`). Gewechselt wird über `thSwitch(t)`: Die neuen Designs spielen ihr Intro, alle anderen blenden per View Transition als Kreis vom Tipp-Punkt aus auf (`html.thsw`).
- **Bühne:** zwei feste Ebenen ohne Klicks: `#tfx` (Szene hinter dem Inhalt, z-index −1; funktioniert nur, solange `<html>` keinen eigenen Hintergrund hat) und `#tfo` (Effekte darüber, z 28). `thScene()` baut die Szene neu, wenn sich Design, Handy/Desktop oder „Bewegung reduzieren“ ändern (MutationObserver auf `data-theme`). Wiederkehrende Effekte laufen über `thEvery()` (pausiert bei verstecktem Tab) und werden mit `thClear()` beendet. Beim Scrollen setzt `thScroll()` die Variablen `--depth` und `--sy` an `#tfx`.
- **Kinopalast (`deco`):** Art-déco-Kino mit Strahlenkranz, Fächermuster, Suchscheinwerfern, gerafften Samtvorhängen mit Kordel und Quaste, Staub im Licht, Filmkorn und Kratzern. Die Reiter sind ein Leuchtschild mit Lauflichtern, die Tipp-Bühne hat einen Glühbirnen-Rahmen (`.rec .mq`). Überschriften in Goldfolie (Limelight), Plaketten-Knöpfe, Poster in Sepia, die beim Zeigen farbig werden. Intro: Filmstart-Countdown 3-2-1, dann geht der Vorhang auf. Bereichswechsel: Vorhang öffnet sich. Konfetti: Spotlights, Goldflitter und „Bravo!“.
- **Tiefsee (`sea`):** Biolumineszenz mit Lichtstrahlen und Kaustik von oben, Meeresschnee, Quallen, Blasen, Fischschwärmen, Seegras und Anemonen am Grund. Je tiefer man scrollt, desto dunkler wird es; der Tiefenmesser unten rechts zeigt beim Scrollen Meter und Zone. Glasflächen, schwebende Karten (sie halten an, sobald man darauf zeigt), Plankton folgt der Maus, Tippen macht Ringe und Blasen. Intro: Abtauchen durch die Wasseroberfläche. Bereichswechsel: Blasenwand. Konfetti: Wal, Blasen und bunte Schnipsel.
- **Origami (`paper`):** Washi-Papier, Fuji mit Torii und Hokusai-Wellen (Parallaxe beim Scrollen, dabei geht die Sonne unter), Wolken, Kirschblüten und vorbeifliegende Papierkraniche. Karten mit Eselsohr, Hanko-Stempel 見 für „gesehen“, Washi-Klebeband an der Bühne, Reiter als Karteikarten, Regler mit Stern. Intro: Eine Klappkarte öffnet sich, Kraniche fliegen heraus. Bereichswechsel: Die Seite blättert um (Stempel 動/映/続). Konfetti: Papierschnipsel und Kraniche.
- **Anschlüsse im bestehenden Code:** `fxEnter()` ruft `thEnter()` auf, `fxBurst()` gibt in Tiefsee und Origami an `thBurst()` ab, und `confetti()` fragt zuerst `thConfetti()`. Rewind, Teilen-Bild (`rwShare`) und Jahres-Poster (`posterMake`) haben eigene Farben pro Design. `xThemed()` (Extras) zählt die neuen Designs mit, deshalb gibt es dort keine Seitentönung und keine Funken.
- **Intro:** höchstens einmal am Tag beim Öffnen (`wl-th-intro`) und immer beim Wechsel ins Design. Jeder Tipp bricht es ab.
- **Bewegung reduzieren:** Die Szene steht still, es gibt kein Intro, kein Konfetti und keine Übergänge.
- **Schriften:** Limelight, Jost und Josefin Sans (Kinopalast), Quicksand (Tiefsee), Shippori Mincho, Zen Maru Gothic und Caveat (Origami), alle über denselben Google-Fonts-Link. Browser laden nur die Schriften, die ein Design wirklich benutzt.
- **Merke:**
  - Die Klassen-Präfixe `dc-`, `se-`, `pp-` und `th-` sind reserviert.
  - Pseudo-Elemente nie in `:is()` schreiben, dort wirken sie nicht.
  - Weichzeichner (`filter: blur`) nicht auf bewegte, große Flächen legen, weiche Kanten lieber mit Verläufen oder Masken bauen. Das spart viel Rechenzeit.
  - In der Tiefsee schweben die Karten. Playwright-Tests brauchen dort `#grid .card{animation:none}`, sonst gelten Knöpfe als „nicht stabil“.
- sw.js: Cache `jj-watchlist-v35`.

### Neu: Kiste neu inszeniert, Geschenk-Kisten, Umzug auf GitHub Pages
- **Wo:** JS zwischen `// KISTE-START` und `// KISTE-END` (ersetzt das frühere Kisten-Popup, gleiche Namen: `chShow`, `chOpen`, `chOpenAll`, `chNext`, `chClose`, `chRender`, `chClick`, `chKey`), CSS zwischen `/* KISTE-START */` und `/* KISTE-END */` (ganz am Ende, nach dem Themes-Block). Klassen-Präfix `kx-`.
- **Ablauf:** Die Kiste fällt mit Gewicht auf die Bühne (Stauchen, Staub, Kamera wackelt) → wartet (atmet, rüttelt alle 3,6 s, Licht dringt aus der Fuge) → Antippen lädt auf (Rütteln per Web Animations immer stärker, Funken werden angesogen, ab gut der Hälfte nimmt das Licht die Farbe der Seltenheit an) → Deckel springt in 3D auf (Blitz, Druckwellen, Funkenregen mit echter Wurfparabel, Lichtsäule; ab Legendär fliegt der Deckel weg) → der Gegenstand dreht sich aus der Kiste nach oben (Lichtkranz, „Neu“-Stempel) → Karte mit Seltenheit (Rauten), Wirkung, Set-Plätzen (das neue Teil springt in seinen Platz) und Ausrüstung. Je seltener, desto länger das Aufladen (1,05 s + 0,26 s pro Stufe über Ungewöhnlich) und desto wuchtiger der Knall. Ab Episch Konfettiregen in den Farben der Seltenheit (in Kinopalast, Tiefsee und Origami zusätzlich deren eigenes Fest, ohne „Bravo!“), Mythisch mit Feuerwerk.
- **Alle öffnen:** Karten drehen sich nacheinander um, die beste zuletzt (mit Funken und pulsierendem Rahmen).
- **Bewegung reduzieren:** Klasse `still`, sofort die Karte, keine Effekte. Die Bühne ist in allen Designs dunkel; die Schrift folgt dem Design (`--kxf`).
- **Leiste:** Der Knopf „Kiste öffnen“ glänzt und das Geschenk rüttelt (`.chpend`, `.chpend2`).
- **Geschenk-Kisten** (`// GESCHENK-START` … `// GESCHENK-END`, vor `chList`): `CH_GIFTS=[["g1",Zeit,"Geschenk"]]` gibt beiden Personen eine Kiste – mindestens episch, bevorzugt fehlende Teile begonnener Sets, nie schon Vorhandenes. Sie liegt außerhalb der Ziehungs-Reihe, ändert also keinen bisher gezogenen Gegenstand. Gezogen wird mit dem Besitz zum Zeitpunkt des Öffnens; geöffnet wird wie jede Kiste über `ST.film.pets[u].ch.g1` (synchronisiert, also nicht pro Gerät doppelt). Die Kiste trägt eine rote Schleife, die beim Öffnen wegfliegt. Weiteres Geschenk: neuen Eintrag mit neuer id anhängen.
- **Umzug:** siehe „Hosting“. Neu im Repo: App-Symbole, Manifest, `.nojekyll`; `sw.js` speichert jede Datei einzeln und startet bei Server-Fehlern die gespeicherte Version.
- Testhinweis: Die Geschenk-Kiste geht nach dem Laden von selbst auf – in Browser-Tests nach `goto` `chShow=()=>{}` setzen und ein offenes Popup schließen (`chOn=false;chRender()`).
- sw.js: Cache `jj-watchlist-v36`.

### Update: Katalog stark erweitert (+2.798 Filme, +1.621 Serien, +1.051 Animes)
- **Filme** (jetzt 4.697 aktive): die nächsten Filme ab 1980 nach IMDb-Stimmen bis etwa 42 Tsd. Stimmen, ohne Dokus und japanische Animationsfilme, nur mit deutschem Wikipedia-Artikel. 2.771 mit Plakat (englische Wikipedia), 27 ohne.
- **Serien** (jetzt 2.835): Serien/Miniserien nach IMDb-Stimmen bis etwa 4.700 Stimmen, ohne Talk-/Reality-/Game-Shows, Nachrichten, Dokus, japanische Animation, indische/türkische Serien, nur mit deutschem Wikipedia-Artikel. Cover + TVmaze-ID von TVmaze (25 ohne Cover).
- **Animes** (jetzt 2.550): die nächsten beliebtesten AniList-Titel (bis etwa 9.500 Mitglieder), ohne Fortsetzungen und Erotik, ohne Doppelte (AniList-ID auch aus der Zusatztabelle der älteren Animes, sonst Name). 300 mit deutscher Beschreibung aus Wikipedia, 751 mit englischer von AniList; 259 mit Beleg für deutsche Synchro (`lang:"de"`), sonst „Synchro unbekannt“. Lange Beschreibung hier höchstens 600 Zeichen.
- Format und Quellen wie bei den letzten Erweiterungen (deutscher Titel = Artikelname ohne Klammerzusatz, Text = Anfang von „Handlung“, sonst Einleitung; Genre/Tags aus IMDb bzw. AniList). Angehängt am Ende von `FILMS`, `SERIES`, `ANIME2`. Laufzeiten für das Zeit-Budget (`RT`, IMDb-Minuten) für alle neuen Filme und Serien ergänzt (jetzt 7.598).
- **Wikipedia-Abruf:** Die API (`api.php`) war stark gebremst (Fehler 429). Texte und Infobox-Bildnamen kamen deshalb über `Spezial:Exportieren` (60–100 Artikel pro Anfrage); Plakat-Adressen werden aus dem Dateinamen über den MD5-Pfad gebaut und per HEAD auf upload.wikimedia.org geprüft (erst `en`, sonst `commons`).
- **Größe:** `index.html` ist jetzt ca. 6,2 MB (vorher 3,5 MB); GitHub Pages überträgt sie komprimiert. Laden dauert dadurch etwa doppelt so lang (lokal gemessen 0,6 s statt 0,3 s, auf gedrosseltem Handy-Profil 2,0 s statt 1,0 s), fast nur durch das Einlesen der Datei.
- **Abzeichen-/Kisten-Prüfung** (`achCheck`) läuft nach jedem Zeichnen mit 1,5 s Verzögerung, jetzt aber spätestens 4 s nach der ersten Anforderung (`achT0`). Vorher verschob das ständige Neuzeichnen beim Nachladen der Staffeln die Prüfung (und damit die Geschenk-Kiste) um bis zu 18 s.
- sw.js: Cache `jj-watchlist-v37`.

### Neu: Bewegungs-System, neue Startseite, Karten ohne Regler (Phase 1 des UX-Umbaus, 18.11.2026)
- **Wo:** CSS zwischen `/* BEWEGUNG-START */` und `/* BEWEGUNG-END */` (ganz am Ende des Stylesheets), JS zwischen `// BEWEGUNG-START` und `// BEWEGUNG-END` (direkt vor `function render()`). Dazu gezielte Änderungen in `cv()`, `render()`, `act()`, `complete()`, `rateCommit()`, `ratePreview()`, `renderToast()`, `cloudUI()`, `achCheck()`, `brwCard()`/`brwResults()`, `sRow()`, `fxCount()`, `fxFlip()`, `accPanel()`, `renderSide()`, `thScene()`/`thEvery()`. Alle neuen Namen beginnen mit `mv` (Klassen `mv…`, `.ck`, `.ghost`, `.cvw`, `.odo`, `.ic`), CSS-Kollisionen vorher geprüft (`.ttl`, `.ok`, `.cl`, `.done`, `.turn` sind vergeben!).
- **Bewegungs-System:** CSS-Variablen `--d1..--d4` (120/220/360/600 ms), `--dsp` (Federdauer), Kurven `--e-out`, `--e-io`, `--e-in`, Federn `--e-spring`, `--e-soft`, `--e-bounce` (echte Federn über CSS `linear()`, ältere Browser bekommen eine cubic-bezier-Näherung). In JS: `MV_EZ`, `MV_D`, `mvA(el,keyframes,opt)` (bei `calm()` sofort am Ziel). Bewegt wird nur transform/opacity bzw. `scale`/`translate`/`rotate` als Einzel-Eigenschaften (damit schräge Theme-Knöpfe schräg bleiben).
- **Startseite (B1):** Die große Tipp-Bühne `#rec` ist versteckt (Code läuft weiter, `#rec{display:none}`). Freie Plätze zeigen direkt einen Tipp als Karte (`mvGhostHtml`, `.card.ghost`, `data-k` = Titel-ID): „✓ Nehmen“ (`data-acc`), ↻ Anderer Tipp (`data-skip`, rückt um die Zahl der Tipp-Karten weiter, `mvGhostN`), ✕ Nichts für mich (`data-rej`), „Schon gesehen?“ (`data-pre`). Mehr freie Plätze als Tipps → danach eine Karte „N Plätze frei“. Liste voll → kein Tipp. Über der Liste ein Knopf „Filmabend starten“ (`#fabtn`, `data-fa` → `faOn`, Fenster `faHtml()` mit Würfeln/Swipen/Zeit & Stimmung; die alten drei Knöpfe `#rollb/#swb2/#finb` gibt es noch, sie sind per CSS versteckt). Listen-Kopf `#lsth` („Deine Liste“), Zähler `#cnt` mit `#cntn` („8 von 10“, rollt), Hinweis `#lsthint` (freie Plätze, „lang drücken/ziehen zum Sortieren“), Zahl bei „Abgeschlossen“ `#dcnt`.
- **Karten ohne Regler (B2):** Watchlist-Karten haben keinen Gesehen-Knopf und keinen Regler mehr, sondern einen runden Haken auf dem Cover (`.ck`, `data-ck`). Antippen: Haken setzen (wie bisher `c.seen`, mit XP-Toast), Stempel landet, nach 650 ms öffnet das **Bewertungs-Blatt** (`rateId`, `rateSheetHtml()`, Kontext `"rs"` in `rateHtml`; Regler ändert nur `rsV`, gespeichert wird erst mit „Speichern“ → `act({n,id})` wie bisher). In „Zusammen“ öffnet der Haken direkt das gemeinsame Fenster (`openDual`). Ist der Haken schon gesetzt, öffnet er sofort das Blatt; „Haken wieder entfernen“ steht im Blatt. Abgeschlossene Karten zeigen die eigene Bewertung als Knopf (`.rdone`, `data-rate1`) statt Regler. Der Verlauf hat seine Regler noch (kommt in Phase 3).
- **Animationen (Nummern wie in der Vorschau):** 1 große Überschrift wandert am Handy in die Kopfzeile (`--mvp`, `#mts`); 2 Blätter (`#modal .mbox`, `#sheet`) mit dem Finger nach unten wegziehen (`mvSheetDrag`); 3 Stöbern und Extras (`#brw`, `#xo`) mit Wisch vom linken Rand schließen (`mvEdge`); 4 Avatar fliegt beim Listenwechsel (`mvViewFrom`); 6 Leiste federt; 7 Haken zeichnet sich + Stempel (`.stp`, in Lila/Baby/Origami landet der Theme-Stempel); 8 Karte fliegt zu „Abgeschlossen“ + „+N XP“ fliegt zum Level (`mvXpPend` → `mvFlyXp`); 9 angenommener Tipp fällt in den Platz (`mvDropId`); 10 Karten per Ziehen sortieren (Handy: lang drücken + ziehen, Desktop: ziehen; `mvLift/mvDragMove/mvDrop`, ändert die Reihenfolge in `c.list`, „@“ wandern ans Ende, mit Rückgängig); 11 lang drücken bzw. Rechtsklick = Vorschau mit Menü (Gesehen – bewerten, Ganz nach vorne, Infos, Aus der Liste nehmen); 12 Cover: Schimmer, dann unscharf → scharf (`MV_CVOK`, `mvCvOk`, schon geladene Bilder sofort scharf); 13 Leuchten in Cover-Farbe (Desktop, Hell/Dunkel, `tintOf`); 14 Bewertungs-Zahl rollt (`mvOdo`), Wort hüpft; 15 Glanz ab 9,0, Konfetti bei 10; 17/18 Tipp fliegt weg bzw. kippt weg (`mvGhostOut`); 21 Knöpfe geben nach und federn zurück (Capture-`pointerdown`, über `scale`); 22 Auswahl-Markierung gleitet (Würfel-Quelle/Stimmung, Verlauf-Ansicht, Stöbern-Reiter, Abzeichen/Inventar-Filter; `mvPillNote/mvPillGo`); 23 Meldungen: federn herein, Zeitleiste (`.tline`), wegwischen, die alte rutscht nach oben weg (`mvToastGhost`); 24 Cloud-Symbol als Linien-Wolke, Pfeile drehen beim Abgleich, danach Häkchen (`mvSyncIcon`); 25 oben herunterziehen gleicht ab (`mvPullSetup`, ruft `cloudPull()`); 26 Zahlen rollen wie ein Kilometerzähler (Listen-Zähler, Statistik-Kacheln via `fxCount`); 27 Stöbern: Karten gleiten beim Sortieren/Filtern; 28 Treffer werden markiert (`mvHl`, auch in der Suche oben); 29 Haustier hüpft bei Reaktionen statt dauernd zu wackeln; 30 neues Abzeichen als Medaille, die sich umdreht (`mvBadge`); 31 Level-Up als Fallblatt-Anzeige (`mvLevel`). 16, 19, 20 (Auf drei!, Filmabend-Ablauf, „Heute läuft“) kommen mit Phase 2.
- **Einstellungen → „Bewegung & Symbole“:** Symbole Emoji oder Linien (`html[data-icons="line"]`, localStorage `wl-icons`; Linien-Symbole in `MV_IC`, Helfer `mvIc(name)`, `mvIcE(emoji)`, statische Stellen über `data-mvi`). „Ruhige Szene“ (`html[data-calm]`, localStorage `wl-calm`): Szenen stehen still (Kinopalast/Tiefsee/Origami bauen sich statisch auf, wiederkehrende Effekte über `thEvery` pausieren, CSS-Animationen in `#tfx/#tfo/#bfx` und Polarlicht angehalten). Beides nur pro Gerät, nichts in der Cloud.
- **Daten:** keine neuen Felder in `ST`/Cloud. Neu nur pro Gerät: `wl-icons`, `wl-calm`.
- **Merke:** Während ein Karten-Ziehen oder die Vorschau läuft, wartet `render()` (`mvHold`, danach wird nachgeholt). Meldungen nehmen jetzt Berührungen auf dem Text an (zum Wegwischen), der Rest bleibt durchklickbar. Bei Tests: Level-/Abzeichen-Popups mit `mvLevel=()=>{};mvBadge=()=>{}` abschalten, Kiste wie bisher mit `chShow=()=>{}`. Native Bild-Drags sind auf den Covern aus (`draggable="false"`), sonst bricht das Ziehen mit der Maus ab.
- **Tests:** `xoOpen("poster")` immer mit `{year,who}` aufrufen (wie die Knöpfe), sonst wirft `berlin()` „Invalid time value“.
- sw.js: Cache `jj-watchlist-v38`.

### Neu: Filmabend als Programmheft, „Auf drei!“, rollende Zahlen überall (Phase 2 des UX-Umbaus, 18.11.2026)
- **Wo:** weiter im BEWEGUNG-Block (CSS und JS), neue Namen mit `mv…` bzw. `fa…` (`faHtml2`, `faAct`, `faCands`, `faDice`, `faLightsOut`). Die vorläufige Filmabend-Auswahl aus Phase 1 (`faHtml`, `.fam/.fao`) ist entfernt; `faOn` gibt es nur noch als immer falschen Zustand.
- **Info-Fenster:** Hauptaktion direkt unter den Angaben (`mvModalActs`): Watchlist-Titel „✓ Gesehen – jetzt bewerten“ (schließt das Fenster, öffnet das Bewertungs-Blatt), abgeschlossene Titel „↩ Zurück in die Watchlist“ (`data-back` + `data-closeinfo`). Ist die Watchlist voll, öffnet sich die Tausch-Auswahl („… kommt aus dem Verlauf zurück. Welcher Titel macht dafür Platz?“, `mvSwapBack`, `mvBackOut`). Vorher landete der Titel als 11. in der Liste – das galt auch für den Knopf im Verlauf.
- **Filmabend (Extras-Seite `xo.k="fa"`, Knopf „Filmabend starten“):** Seite 1: Zeit (egal/kurz/lang), Stimmung (`MOODS`), Quelle (eure Listen/alle) als Chips; die Auswahl gleitet zum neuen Chip (View Transition `mvsel`, `mvChipGo`). Seite 2: bis zu 4 Kandidaten (`faCands`: Bewertung + Zufall, Bonus für „Zusammen“ und je Einzelliste; Punkte zeigen, auf wessen Liste, mit Legende). Unten ein Dock, das am Handy sichtbar bleibt: ‹ Anders, Würfeln (Lichtlauf, `faDice`), Swipen (startet die Swipe-Abstimmung), Hauptknopf mit dem gewählten Titel („„X“ nehmen wir“, rollt beim Wechsel, sonst „Erst einen antippen“). Seite 3 „Heute läuft“: Licht aus, Spot, Poster fliegt aus der Karte, eigene Note je Design (Kinopalast-Vorhang, Tiefsee-Blasen, Origami-Titelblatt mit dem Filmtitel, Manga-Speedlines, Einhorn). „Los geht's“ setzt **Heute Abend**. Seiten blättern um (`mvTurnPage`), der Fokus springt auf die neue Überschrift.
- **Heute Abend:** geteilt über `ST.film.x.tonight = {id, sec, t, by}` (Cloud wie Empfehlungen), gilt 20 h. Banner über der Liste (`#mvtn`, `mvTopRender`): „Heute Abend“, nach 90 Min. „Wie war's?“, jeweils mit „Auf drei!“; × entfernt den Hinweis. Die Karte bekommt das Abzeichen „Heute“. „Heute schauen“ aus der Swipe-Abstimmung setzt ebenfalls Heute Abend (`vPick`). Die Glocke meldet, wenn der/die andere etwas für heute ausgesucht hat.
- **„Auf drei!“ (verdeckt bewerten):** In „Zusammen“ öffnet der Haken jetzt dieses Blatt statt des gemeinsamen Fensters, ebenso „Auf drei!“ im Banner (`blind`, `blindHtml`, `mvBlindOpen`, `mvBlindAct`). Zwei Wege: „Wir sind beide hier“ (ein Handy: erst du, dann weitergeben, dann aufdecken) oder „Ich jetzt, X am eigenen Handy“ (verdeckt gespeichert in `ST[k].blind[id] = {r:{u:wert}, t, by}`; der/die andere sieht Banner und Glocke „… hat verdeckt bewertet – du bist dran“, bewertet und deckt auf). Aufdecken: Countdown 3-2-1, beide Karten drehen sich, Zahlen rollen von 0,0 hoch, Messleiste mit dem Abstand, Stempel „Einig!“ (≤ 0,6), „Fast einig“ (≤ 2) oder „Geschmäcker verschieden“, Konfetti bei Einigkeit. Speichern (`mvBlindSave`) trägt beide Bewertungen in „Zusammen“ ein, schließt den Titel ab und löscht Heute Abend; Schließen nach dem Aufdecken speichert ebenfalls (`mvBlKeep`). Bei zwei Handys bleibt `{done:1, rev:{…}}` stehen, bis beide das Ergebnis gesehen haben („Aufgedeckt – schau, wie einig ihr seid“), dann wird der Eintrag gelöscht. Gemeinsam aufgedeckte Bewertungen zählen auf dem Gerät nicht als Glocken-Neuigkeit (localStorage `wl-mvbl-seen`).
- **Rollende Zahlen überall:** `<span data-odo="schlüssel">12</span>` rollt beim nächsten Zeichnen vom alten zum neuen Wert, auch wenn `render()` das Element neu baut (`mvOdoKeys`, Gedächtnis `MV_ODO`); Balken gleiten (`data-bar`, `mvBars`). Im Einsatz: Weiterschauen (Folge, Fortschritt), Folgen-Knopf auf der Karte, Leiste (Level, Multiplikator), Reiter (Plätze je Liste, Verlauf, Watchlist, Level), Haustier, Abzeichen-Seite (Level, XP), Glocke, Stöbern-Anzahl, Rewind-Countdown. Die Ziffernhöhe kommt aus der eigenen Zeilenhöhe (`--lh`), damit die Zahl genau auf der Grundlinie sitzt. Rollende Beschriftungen (`mvRollTxt`): Listen-Kopf, Hinweis, Untertitel, große Überschrift, Filmabend-Hauptknopf. `renderSide()` (läuft auch ohne `render()`) rollt Leiste und Handy-Blatt mit.
- **Kleine Bewegungen:** Kandidaten kommen gestaffelt (`mvStag`), Schritte im Auf-drei-Blatt gleiten herein, 🤝 reicht weiter, 🙈 ploppt (`mvBlFx`), das „Heute“-Abzeichen ploppt einmal (`mvTdayFx`). Alles einmalig (nicht bei jedem `render()`), bei `calm()` aus.
- **Barrierefreiheit:** kleine Zusatztexte der neuen Ansichten sind etwas kräftiger als `--mute` (in allen Designs AA), Kandidaten-Punkte haben Namen (`role="img"`), Fokus beim Umblättern, Ergebnis über `aria-live`.
- **Daten:** neu in der Cloud: `ST[k].blind` (pro Bereich) und `ST.film.x.tonight`. Neu pro Gerät: `wl-mvbl-seen`.
- **Merke:** `render()` baut auch die Extras-Seite neu (`xoRender`) – Zustände wie „Licht an“ stehen deshalb in `xo` (`xo.lit`), einmalige Animationen werden per JS ausgelöst, nicht als CSS-Animation (die liefe sonst bei jedem Zeichnen neu). `.mk` ist als Klasse vergeben (deshalb `.mvmk`).
- sw.js: Cache `jj-watchlist-v39`.
