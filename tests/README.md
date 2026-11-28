# Tests der Watchlist

Browser-Tests mit [Playwright](https://playwright.dev). Sie starten die echte App (`index.html` + `katalog.js`) auf einem
eigenen kleinen Server, erzeugen Testdaten und prüfen die wichtigsten Abläufe. Keine echten Daten, keine Cloud:
fremde Bilder werden durch Platzhalter ersetzt, TMDB und Supabase werden nachgebildet (`lib.js`).

```bash
cd tests
npm ci                                  # einmalig
npx playwright install chromium         # einmalig, falls noch kein Browser da ist
node run.js                             # alle Tests (~8 Min.)
node run.js 03 07                       # nur bestimmte Dateien
```

Bei jedem Push laufen sie automatisch auf GitHub (`.github/workflows/tests.yml`, Reiter „Actions“).

| Datei | prüft |
|---|---|
| `01-start` | Katalog, Startseite, Haken → Bewerten → Abschluss |
| `02-ueberlauf` | kein seitliches Scrollen, alle Designs, 340/390 px |
| `03-filmabend` | Zurück in die Watchlist, Filmabend bis „Heute Abend“, „Auf drei!“ (ein Handy) |
| `04-auf-drei-zwei-handys` | verdeckt bewerten, „Du bist dran“, aufdecken |
| `05-filmabend-auswahl` | Quelle, Knopf mit Titel, Würfeln, × nach dem Aufdecken |
| `06-zurueck-tausch` | volle Liste: Tausch, Rückgängig, freier Platz |
| `07-verlauf-einladung` | ⋯-Menü, Reaktionen, Einladung über zwei Geräte, .ics, Demnächst, Blatt wegziehen |
| `08-haptik` | Vibration bzw. iPhone-Schalter-Trick, Schalter im Menü |
| `09-kontrast` | WCAG-AA-Kontrast und Überlauf der neueren Texte in allen Designs |
| `10-abgleich` | Cloud-Abgleich führt gleichzeitige Änderungen zweier Geräte zusammen |
| `11-phase4` | „Passt zu euch beiden“, Tipp-Spiel, Abspann, Kennt-Kachel, „Wo läuft's?“ |
| `12-tipp-spiel-zwei-handys` | Tipp-Spiel über zwei Geräte, keine doppelten Punkte |
| `13-rundgang` | erster Start, Kiste, alle Extras, Rewind, Swipen, alle Designs/Bereiche/Reiter |

Neue Tests: Datei `NN-name.test.js` anlegen und `L.run('Name', async (browser, t) => { … t.ok(bedingung, 'Text', info) … })`
verwenden. Seitenfehler werden über `t.watch(page)` automatisch zu einer fehlgeschlagenen Prüfung.
Auf langsamen Rechnern alle Wartezeiten strecken: `TEST_SLOW=2 node run.js`.
