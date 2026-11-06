# Architektur des lokalen PoC

Ein lokaler Next.js-Prozess: Browser → validierte API → Domain-Services → SQLite. Der eigenständige HTML-Bericht benötigt keinen Server und führt keine Netzwerkaufrufe aus. Gateway: nicht konfiguriert, keine Attrappe und kein Fallback.

- `src/components`: React-Oberfläche und Radar; kein direkter Datenbankzugriff.
- `src/domain`: Zod-Schemata, Import-/Pseudonymisierungslogik, Referenzprüfung, Demo-Daten und HTML-Report.
- `src/server`: SQLite, Passwort-/Sitzungsverwaltung, API-Orchestrierung.
- `src/app/api`: schmale HTTP-Grenze; jede Datenoperation prüft Sitzung, jede Mutation zusätzlich Origin und Payload.
- `tests`: reale SQLite-/Domain-Tests und Browser-Kernreise mit synthetischen Daten.

Projekt enthält Statements, Findings, Empfehlungen, Prozessschritte und STAR-Bewertungen; stabile IDs, Projektversion und Schema-Version. Referenzen und Empfehlungszyklen werden vor Speichern geprüft. SQLite speichert atomare Projektsnapshots mit Versionskonflikterkennung sowie Sitzungen und HMAC-Pseudonymzuordnung. Datenpfad standardmäßig im privaten Benutzer-Datenverzeichnis, optional außerhalb des Repos über ORGLENS_DATA_DIR.

Vertrauensgrenzen: Importdateien und Modelldaten gelten als nicht vertrauenswürdig; React/Text-Encoding verhindert aktive Quellinhalte. Originale bleiben im Browser bis bestätigter Bereinigung. HMAC-Schlüssel, Passworthash und Sitzungsdaten verbleiben lokal im privaten Datenverzeichnis. Berichte erhalten ausschließlich explizit freigegebene Findings/Empfehlungen und die vom Berater bestätigte Quellenbasis, niemals Auth-Daten oder interne Notizen.

Bedrohungen/Maßnahmen: Datenzugriff ohne Login → serverseitige Sitzung; CSRF/DNS-Rebinding → Origin-/Host-Prüfung und SameSite-Cookie; XSS im Export → HTML-/JSON-Escaping und eingebettetes festes Skript; verlorene Änderungen → Transaktion/Version; veraltete Workshopdatei → Projekt-/Versionsprüfung; PII-Leak → lokale Vorschau, manuelle Prüfung, keine Rohdaten-Logs. Restgrenzen: kompromittiertes Gerät, weitergeleitete HTML-Datei, indirekte Personenidentifikation und unerkannte Freitextdaten sind durch diese Maßnahmen nicht ausgeschlossen. Kein ASVS-Konformitätsnachweis; formales Mapping/Review vor produktiver Freigabe ausstehend.

Recovery: validierter JSON-Backup-Export und bewusste Restore-Übernahme; Auth-Daten/Fingerprints sind absichtlich nicht Bestandteil des Projektbackups. Wiederherstellung auf einem neuen Gerät benötigt Passwort-Setup und erneute Pseudonymisierungszuordnung bei neuen Rohdatenimports. Technischer Healthcheck gibt keine Projektinhalte aus. Keine Inhaltslogs oder Telemetrie.

Testziele: Login, Importfreigabe, XSS, Quellenketten, Konflikt/Replay, Backup, Neustart und Offline-Bericht. Browser Edge/Chrome-kompatibel, hier Chromium; tatsächlicher Unternehmensrechner bleibt ungeprüft. Designscreenshot ist nur Referenz, echte UI-Evidenz wird separat erstellt.
