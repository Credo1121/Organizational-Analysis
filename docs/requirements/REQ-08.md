# REQ-08: Workshop-Priorisierung speichern und zurückübernehmen

Status: Draft · Revision: 1 · Datum: 06.11.2026
Typ: Business · Geplante Iteration: I1
Quelle: [Discovery](../discovery/organizational-analysis.md), Nutzerinterview im Chat. Keine fachliche Abnahme der folgenden Detailvorschläge.

## Problem und Benefit Statement

Damit Entscheidungen im Gespräch nicht verloren gehen, ordne ich Maßnahmen direkt im Bericht und übernehme diese kontrolliert in die App.

## Rollen und Scope

Beratende Person als Bearbeiter; Kunden als Leser des freigegebenen HTML-Berichts und Teilnehmer der Priorisierung.
Umfang und Regeln werden durch die folgenden Akzeptanzkriterien begrenzt. Vorschläge und offene Entscheidungen sind unten explizit aufgeführt.

## Akzeptanzkriterien

- **AC-01**: Empfehlungen lassen sich per Drag-and-drop sowie per Tastatur/hoch-runter bedienen; jede Empfehlung erhält genau einen Rang.
- **AC-02**: Ungespeicherte Änderungen werden angezeigt. Speichern lädt eine Priorisierungsdatei mit Projekt-/Berichtsversion und stabilen Empfehlungs-IDs herunter; der unveränderte HTML-Bericht wird nicht als überschrieben dargestellt.
- **AC-03**: Eine Priorisierungsdatei zum passenden Bericht lässt sich nach einer Änderungsvorschau bewusst übernehmen; eine fremde Projektkennung wird ohne Änderung abgewiesen.
- **AC-04**: Bei veralteter Berichtsversion, unbekannten/fehlenden/doppelten IDs oder zwischenzeitlichen Änderungen erfolgt kein stilles Überschreiben. Erneuter Import derselben übernommenen Reihenfolge erzeugt keine zusätzliche fachliche Änderung.

## Daten und Abhängigkeiten

Quellen, Findings, Empfehlungen und Exportstände werden über stabile IDs verknüpft. Personenkennungen sind Pseudonyme, keine Klarnamen. Abhängigkeiten: REQ-05, REQ-07, REQ-12.

## Offene Entscheidungen und Nicht-Scope

Vorgeschlagen: JSON-Datei und bewusste Übernahme; keine freie Finding-Bearbeitung, gemeinsame Synchronisation oder automatisch dauerhaft gespeicherte HTML-Datei.

## Priorität und Abnahme

Die Iterationszuordnung ist ein zu reviewender Planungsvorschlag. Vor Ready müssen die für diesen Slice relevanten offenen Entscheidungen gelöst, Verträge und Testfälle konkretisiert sein. Featureumfang zur PoC-Umsetzung vom Nutzer bestätigt (06.11.2026). Technische Abdeckung je AC: [Prüfbericht CHG-002](../qa/CHG-002.md); nicht alle Kriterien sind umgesetzt oder verifiziert. Fachliche Abnahme der laufenden Anwendung: ausstehend.
