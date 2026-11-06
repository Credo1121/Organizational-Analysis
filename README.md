# OrgLens · Lokaler Organisationsanalyse-PoC

Lauffähiger erster Stand des Beratungsinstruments: CSV-Import mit Pseudonymisierung und Freigabe, Quellen, manuell bearbeitbare Findings/Cluster, Innen-/Außensicht, STAR, Prozessreife/RACI, Empfehlungen, eigenständiger HTML-Bericht und Priorisierungsaustausch.

## GitHub Pages: interaktives App-Frontend ohne Installation

Die Startseite öffnet **OrgLens Studio**, eine eigenständige React-Frontend-Demo der Berater-App. Navigation, STAR-Radar, Quellen, Findings/Cluster, Innen-/Außensicht, RACI, Zielbildsimulation, Empfehlungen und Berichtsvorschau sind direkt im Browser nutzbar. Findings, Empfehlungen, RACI und STAR-Beispielbewertungen können manuell bearbeitet werden.

Die Demo enthält ausschließlich erfundene Daten. Änderungen werden nur im Sitzungsspeicher des aktuellen Browser-Tabs gehalten; sie sind weder serverseitig gespeichert noch mit anderen Nutzern synchronisiert. **Kein Login, kein Upload echter Kundendaten und keine KI-Verbindung.** Der Zielbildregler ist eine UI-Simulation, keine berechnete Kapazitätsprognose.

`index.html` und `docs/index.html` referenzieren dieselben gebündelten React-/CSS-Dateien über relative Pfade. Damit funktionieren beide Pages-Quellordner, Hauptordner (`/`) und `/docs`, auch unter dem Repository-Basispfad. Die bestehende Pages-Einstellung muss nicht geändert werden; neue Commits werden durch den bestehenden Pages-Build veröffentlicht. Nach einem Update bei Bedarf hart neu laden.

Der bisherige selbstenthaltende HTML-Beispielbericht bleibt unter `report.html` und `docs/report.html` erhalten. Er ist ein fester Musterstand; neue Änderungen aus der Frontend-Sitzung erscheinen in der **Berichtsvorschau** der App, nicht automatisch in diesem alten HTML-Beispiel. Die Vorschau lässt sich über Drucken/PDF ausgeben.

Für Entwickler:

```sh
npm run build:pages
npm run test:pages
```

Der Generator verwendet ausschließlich fiktive Daten, prüft den Bundlegraphen auf ausgeschlossene Servermodule und erzeugt versionierte Assetnamen gegen veraltete Browsercaches. Third-Party-Lizenzhinweise bleiben im Bundle erhalten. Die Tests benötigen Chromium wie der übrige Browsertest. Für den Nutzer ist keine lokale Node.js-Installation nötig.

GitHub Pages führt weiterhin keinen Node.js-/SQLite-Server aus. Die vollständige lokale Backend-App bleibt separat vorhanden und unverändert; die Frontend-Demo täuscht deren Anmeldung oder Speicherung nicht vor. Architektur: [ADR-002](docs/adr/ADR-002.md), Umfang: [REQ-16](docs/requirements/REQ-16.md).

## Lokal starten

Voraussetzung: **Node.js 24** und npm. Kein Docker und kein Datenbankserver erforderlich.

```sh
npm ci
npm run setup:local
npm run dev
```

Bei der Einrichtung ein eigenes Passwort mit mindestens zwölf Zeichen setzen. Die Eingabe ist verborgen. Danach im Browser `http://127.0.0.1:3000` öffnen und anmelden. Es gibt kein Standardpasswort. **Fiktive Demo laden** startet ein ausdrücklich synthetisches Projekt; alternativ die leere Analyse über **Daten & Quellen → CSV importieren** befüllen. Bereits gefüllte Projekte werden nicht durch die Demo überschrieben.

Für einen Produktionsbuild auf dem lokalen Rechner:

```sh
npm run build
npm start
```

Stoppen mit Strg+C. Die Skripte binden ausschließlich an Loopback und deaktivieren Next.js-Telemetrie. Die Entwicklung hier wurde unter Linux mit Node 24 und Chromium geprüft; Unternehmens-Windows/macOS und IT-Richtlinien bleiben vor realer Nutzung zu prüfen.

## Daten und Zugang

- Standardpfad: `<Benutzerverzeichnis>/.local/share/orglens/orglens.sqlite`, außerhalb des Checkouts.
- Optional `.env.example` nach `.env.local` kopieren und `ORGLENS_DATA_DIR` auf einen absoluten externen Pfad setzen. Einrichtung und App müssen dasselbe Datenverzeichnis verwenden.
- SQLite-Datei enthält Projektdaten, Passworthash, Sitzungen und Fingerprints zur Pseudonymzuordnung. Private Dateirechte werden gesetzt, soweit das Betriebssystem sie unterstützt. Keine Dateiverschlüsselung durch das Login.
- Passwort bewusst zurücksetzen: `npm run setup:local -- --reset`; bestehende Sitzungen werden ungültig, Projektdaten bleiben erhalten.
- Projektbackups über **Ergebnisbericht** herunterladen und an einem freigegebenen Ort ablegen. Wiederherstellung erfolgt nach Bestätigung und erzeugt eine neue Projektkennung. Backup enthält keine Auth-Daten und keinen Pseudonym-Schlüssel; neue Rohdatenimports nach Wiederherstellung benötigen erneute Prüfung der Zuordnung.
- Kundendaten, Berichte, Backups und Zugangsdaten nicht ins Repository kopieren. Datensicherungen und Laufwerks-/Geräteschutz sind durch die Unternehmensumgebung zu regeln.

## Import und Pseudonymisierung

[Problem-Statement-Vorlage](public/samples/problem-statements.csv) und [RACI-Vorlage](public/samples/raci.csv) enthalten ausschließlich erfundene Daten. UTF-8, Komma/Semikolon, maximal 2 MiB und 2000 Zeilen pro Import. Die CSV-Spalten sind in der Oberfläche zuordenbar. Eine Statementzeile hat eine Interviewquelle; gleiche Problemtexte aus verschiedenen Interviews mit eigenen Statement-IDs erfassen und gemeinsam im Finding verknüpfen.

Das zugeordnete Personenfeld, erkannte E-Mail-Adressen und mögliche Telefonnummern werden durch Projektkennungen ersetzt. Weitere Namen/Begriffe manuell ergänzen; die bereinigte Vorschau vollständig prüfen und bei Bedarf korrigieren. Erst danach freigeben. Rohdaten und Klartext-Zuordnung verbleiben bis dahin im Browser-Arbeitsspeicher und werden nicht an den Server geschickt. Für konsistente Kennungen speichert der Server projektspezifische HMAC-Fingerprints. Keine Garantie vollständiger automatischer Erkennung; Pseudonymisierung ist keine Anonymisierung. Auch Rollen und Vorfälle können Personen erkennbar machen.

Ein erneuter Import bestehender IDs wird ohne Änderung abgewiesen. Quellen können mehreren Findings zugeordnet werden. Ein Finding ohne Quellen darf nicht für den Bericht freigegeben werden. Empfehlungen benötigen freigegebene Finding-Bezüge. Beziehungen zwischen Empfehlungen dürfen keine Zyklen bilden.

## Bericht und Workshop

Unter **Ergebnisbericht** zunächst enthaltene Findings, Empfehlungen, vollständige Quellenbasis und RACI prüfen und bewusst freigeben. Der Download ist eine selbstenthaltende HTML-Datei ohne externe Fonts/Bibliotheken oder Gateway-Zugriff. Dateien können in Teams abgelegt und von dort heruntergeladen werden; direkter HTML-Betrieb innerhalb von Teams wird nicht vorausgesetzt.

Der Bericht bietet Navigation, STAR-Filter, Quellen-Drill-down und Priorisierung per Ziehen oder Hoch/Runter. **Priorisierung als Datei speichern** lädt eine JSON-Datei herunter; die HTML-Datei wird nicht überschrieben. Unter **Empfehlungen** diese Datei mit Vorschau wieder importieren. Veraltete oder fremde Projektstände werden zurückgewiesen; nach weiteren Änderungen bei Bedarf einen neuen Bericht erzeugen.

Der Bericht besitzt keinen App-Login: Wer die Datei erhält, kann die enthaltenen Informationen lesen. Er ist ein Diskussionsstand, keine automatische Kundenvalidierung.

## Grenzen dieses PoC

- Kein internes LM-Gateway angebunden; keine echten KI-Vorschläge. Manuelle Analyse und synthetische Demo sind voll nutzbar.
- Kein Transkript-/XLSX-Import und keine gemeinsame Mehrbenutzerbearbeitung.
- Kein berechnetes Kapazitätsmodell, keine Zielbildregler und keine WBS-/Terminplanung; diese bleiben die geplanten Folgeslices.
- STAR-Werte sind standardmäßig unbewertet. Numerische Eingaben benötigen eine eigene dokumentierte Bewertungsgrundlage; keine behauptete validierte STAR-Skala. Prozessreife 1–4 bleibt davon getrennt.
- Noch keine Freigabe für produktive sensible Kundendaten oder formale Sicherheits-/Datenschutz-Konformitätsprüfung.
- Die verwaltete Testumgebung blockiert `file://` im Browser. Der erzeugte HTML-Inhalt wird hier bei gesperrtem Netzwerk geprüft; tatsächliches Öffnen als lokale Datei und der Teams-Downloadweg bleiben auf dem Unternehmensrechner zu testen.

## Struktur

```text
src/app/          Next.js-Seiten und schmale API-Routen
src/components/   Gemeinsame React-Editoren und lokale Backend-Oberfläche
src/demo/         Statische Frontend-Demo mit eigenen Arbeitsbereichen
src/domain/       Zod-Verträge, Referenz-/Fachregeln, CSV, Bericht
src/server/       SQLite, Authentifizierung, API-Orchestrierung
scripts/          Lokales Passwort-Setup und Startskript
tests/            Domain-/SQLite-Tests und Browser-Kernreise
docs/             Anforderungen, Architektur, Verträge und Evidenz
```

Ein modularer Monolith: Frontend und Backend sind fachlich getrennt, laufen aber im selben lokalen Prozess. [Architektur](docs/architecture.md), [API-Vertrag](docs/contracts/local-api.md), [Anforderungen](docs/requirements/README.md).

## Prüfen

```sh
npm run typecheck
npm test
npm run build
npm run test:e2e
```

Der Browsertest startet einen isolierten Server auf Port 3100 mit ausschließlich synthetischen Daten und eigenem temporären Datenverzeichnis. Er erwartet Chromium unter `/usr/bin/chromium`; alternativ `ORGLENS_CHROMIUM` auf den absoluten Pfad des installierten Chromium-Browsers setzen. Build vor dem Browsertest ausführen. Testpasswort und Testdateien gelten ausschließlich für diese isolierte Testumgebung.

[Testbericht und Screenshots](docs/qa/CHG-002.md). Generierte Konzeptbilder sind ausdrücklich keine Laufzeit-Evidenz.
