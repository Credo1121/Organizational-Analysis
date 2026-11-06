# Anforderungsprüfung und geplanter Nachweis

06.11.2026 · Draft. Rollenwechsel im selben Agenten, keine unabhängige externe Prüfung.

## Reviewbefund

- Quellen: Nutzerinterview/Discovery und REQ-01 bis REQ-15 gelesen bzw. erarbeitet.
- Anforderungen enthalten Nutzen, Rollen, Akzeptanzkriterien, Datenbezug, Abhängigkeiten und offene Entscheidungen.
- Materielle Unklarheiten: Gateway, lokale Runtime/Login, konkrete CSV-Schemata, Bewertungsmaßstäbe, Radar-Skala. Deshalb noch kein Ready und keine Software-Abnahme.
- Keine unverbindlichen Zahlen als validierte Ratings oder erreichte Reife übernommen. Kein automatischer KI-Overwrite. HTML-Dateisicherheit von App-Login getrennt.
- Hypothesen dürfen ausdrücklich als Diskussionsstand exportiert werden; Freigabe der beratenden Person ist keine Kundenbestätigung.

## Geplante Testgruppen

| REQ/AC | Testfall und Erwartung | Ebene | Status |
|---|---|---|---|
| 01, alle | Valide/ungültige CSV, fehlende Kategorie, doppelte IDs, Mehrfachquellen; Personendaten in Spalten/Freitext pseudonymisieren, manuelle Korrektur, konsistente Kennungen, Freigabesperre und Ausschluss ersetzter Originale aus Analyse/Gateway/Export | Integration + UI | NOT RUN |
| 02–03, alle | Quellen verbinden/lösen, Widersprüche, Perspektiv-Leerzustand, STAR-Mehrfachzuordnung, Radar ohne Bewertung | Verhalten + UI | NOT RUN |
| 04, alle | Reife 0/5/leer/1–4, strittige Rolle, Empfehlung verändert Ist-Reife nicht | Integration + UI | NOT RUN |
| 05–06, alle | Manuelle Änderungen erhalten, getrennte Bewertung, 100%-Summe, Zyklus abweisen, kein erfundener Zeitgewinn | Integration + UI | NOT RUN |
| 07, alle | Ausgewählte Berichtsversion offline öffnen, Quellenpfade durchklicken, ausgeschlossene Inhalte nicht eingebettet | Browser + Exportprüfung | NOT RUN |
| 08, alle | Maus/Tastatur priorisieren; Datei exportieren/importieren, fremdes Projekt, veraltete Version, doppelte IDs, Wiederholung | End-to-End | NOT RUN |
| 09, alle | Offene Termine, ungültiger Zeitraum, Abhängigkeit, freigegebener WBS-Export | Integration + UI | NOT RUN |
| 10/14, alle | Reales Gateway mit synthetischen Daten, Timeout, ungültige Referenzen, kein öffentlicher Fallback, kein Overwrite | Contract + Integration | NOT RUN |
| 11, alle | Loopback-Bindung, Datenendpunkt ohne Login, Logout, lokale Startanleitung | Betrieb + Integration | NOT RUN |
| 12, alle | Neustart, fehlgeschlagener Schreibvorgang, Versionskonflikt, Backup/Restore mit Referenzvergleich | Integration | NOT RUN |
| 13, alle | Script-/HTML-Testtext, Datenmarker im Export, Netzwerk blockiert, Dateigrenzen | Security-/Browserprüfung | NOT RUN |
| 15, alle | Synthetische Kernreise, Build/Typprüfung, Tastatur, tatsächlich geöffnete Screenshots von App/HTML | End-to-End + visuell | NOT RUN |

Umgebung für diese Tests noch festzulegen. Vorgeschlagen: Edge/Chrome auf Zielsystem, Desktop 1440×900 und Mobile 390×844; Browser-/Viewport-Vorschlag noch nicht bestätigt. Für Diagramme Textalternative prüfen. Leistungsziele vor Messung konkretisieren.

## Dokumentprüfung

PASS: Python-Prüfung der lokalen Markdown-Verweise und der eindeutigen AC-IDs je Anforderung: 15 REQ-Dateien, 65 Akzeptanzkriterien, keine Link-/Strukturfehler. Alle Anforderungen als Draft markiert. `git diff --check` ohne Befund; neue Dateien sind noch untracked und wurden zusätzlich über die genannte Strukturprüfung gelesen. Keine Anwendungstests ausgeführt.

## Ergebnis

Fachlicher Review: ausstehend. Software-/UI-Abnahme: BLOCKED (noch keine Anwendung). Alle Verhaltenstests NOT RUN. Dokumentstruktur-Prüfung wird separat ausgeführt; daraus folgt kein QA-PASS für die Anwendung.


## Fortschreibung nach Umsetzung

Der vorherige Abschnitt dokumentiert den ursprünglichen Vorabreview. Inzwischen ist ein PoC umgesetzt und geprüft. Der aktuelle technische Stand mit Grenzen und echten Screenshots steht in [CHG-002](CHG-002.md). Daraus folgt keine vollständige Erfüllung aller REQ/AC.
