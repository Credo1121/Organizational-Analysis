# REQ-05: Empfehlungen, Bewertung und Priorität bearbeiten

Status: Draft · Revision: 1 · Datum: 06.11.2026
Typ: Business · Geplante Iteration: I1
Quelle: [Discovery](../discovery/organizational-analysis.md), Nutzerinterview im Chat. Keine fachliche Abnahme der folgenden Detailvorschläge.

## Problem und Benefit Statement

Damit meine Beratungshoheit erhalten bleibt, bearbeite und priorisiere ich Handlungsempfehlungen und halte Kundenbewertungen separat fest.

## Rollen und Scope

Beratende Person als Bearbeiter; Kunden als Leser des freigegebenen HTML-Berichts und Teilnehmer der Priorisierung.
Umfang und Regeln werden durch die folgenden Akzeptanzkriterien begrenzt. Vorschläge und offene Entscheidungen sind unten explizit aufgeführt.

## Akzeptanzkriterien

- **AC-01**: Empfehlungen lassen sich erstellen, ändern und mit Findings verknüpfen; strategisch/taktisch/operativ, erwartetes Ergebnis und Abhängigkeiten sind bearbeitbar.
- **AC-02**: Problemschwere am Finding, Aufwand an der Empfehlung und Reihenfolge im Backlog werden separat gespeichert; ein leeres Bewertungsfeld heißt unbewertet.
- **AC-03**: Eine Kundenbewertung wird mit Datum und Bewertungsrolle dokumentiert; sie entsteht nicht automatisch durch Freigabe eines Berichts oder Anzahl der Erwähnungen.
- **AC-04**: Änderungen an einer Empfehlung überschreiben keine Quellenaussagen. Abhängigkeiten können nicht auf sich selbst zeigen oder geschlossene Zyklen erzeugen.

## Daten und Abhängigkeiten

Quellen, Findings, Empfehlungen und Exportstände werden über stabile IDs verknüpft. Personenkennungen sind Pseudonyme, keine Klarnamen. Abhängigkeiten: REQ-02, REQ-12.

## Offene Entscheidungen und Nicht-Scope

Bewertungsmaßstab offen. Vorschlag für I1: qualitative Einstufungen mit Begründung statt unbegründetem Gesamtscore; keine automatische Gewichtungsformel. Kriterien werden vor Bewertungs-Implementierung abgestimmt.

## Priorität und Abnahme

Die Iterationszuordnung ist ein zu reviewender Planungsvorschlag. Vor Ready müssen die für diesen Slice relevanten offenen Entscheidungen gelöst, Verträge und Testfälle konkretisiert sein. Featureumfang zur PoC-Umsetzung vom Nutzer bestätigt (06.11.2026). Technische Abdeckung je AC: [Prüfbericht CHG-002](../qa/CHG-002.md); nicht alle Kriterien sind umgesetzt oder verifiziert. Fachliche Abnahme der laufenden Anwendung: ausstehend.

