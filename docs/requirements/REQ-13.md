# REQ-13: Sichere Quellenverarbeitung und eigenständiger Export

Status: Draft · Revision: 2 · Datum: 06.11.2026
Typ: Enabler · Geplante Iteration: I1
Quelle: [Discovery](../discovery/organizational-analysis.md), Nutzerinterview im Chat. Keine fachliche Abnahme der folgenden Detailvorschläge.

## Problem und Benefit Statement

Damit importierte Inhalte nicht zu ausführbarem Code oder unbeabsichtigter Datenweitergabe werden, werden Quellen und Export technisch begrenzt verarbeitet.

## Rollen und Scope

Lokaler Einzelbenutzerbetrieb; technische Voraussetzung für die zugeordneten Business-Features.
Umfang und Regeln werden durch die folgenden Akzeptanzkriterien begrenzt. Vorschläge und offene Entscheidungen sind unten explizit aufgeführt.

## Akzeptanzkriterien

- **AC-01**: Ein synthetischer Problemtext mit HTML-/Script-Markup wird in App und Bericht als Text dargestellt und führt keinen Code aus.
- **AC-02**: Ein Exporttest bei blockiertem Netzwerk bestätigt Navigation, Filter und Priorisierung ohne externe Schrift-, Bibliotheks-, Bild- oder API-Aufrufe.
- **AC-03**: Ausgeblendete Daten werden nicht nur optisch versteckt: Ein Test durchsucht den Export nach Testmarkern für ausgeschlossene Notizen, Transkripte und Zugangsdaten und findet keine.
- **AC-04**: Ungültige/über den vereinbarten Grenzen liegende Importdateien werden vor Zustandsänderung abgewiesen; Links aus Quelldaten werden nicht ungeprüft zu aktiven Inhalten.

## Daten und Abhängigkeiten

Quellen, Findings, Empfehlungen und Exportstände werden über stabile IDs verknüpft. Personenkennungen sind Pseudonyme, keine Klarnamen. Abhängigkeiten: REQ-01, REQ-07.

## Offene Entscheidungen und Nicht-Scope

Importgrößenlimits und erlaubte Dateitypen festlegen. REQ-01 umfasst Pseudonymisierung innerhalb der App vor Freigabe zur Analyse; Schutz der temporär verarbeiteten Originalangaben und einer etwaigen Zuordnungstabelle ist im Sicherheitsdesign zu berücksichtigen. Automatische Erkennung garantiert keine Vollständigkeit oder Anonymität. Bei CSV-Ausgaben zusätzlich Formelinjektion behandeln.

## Priorität und Abnahme

Die Iterationszuordnung ist ein zu reviewender Planungsvorschlag. Vor Ready müssen die für diesen Slice relevanten offenen Entscheidungen gelöst, Verträge und Testfälle konkretisiert sein. Featureumfang zur PoC-Umsetzung vom Nutzer bestätigt (06.11.2026). Technische Abdeckung je AC: [Prüfbericht CHG-002](../qa/CHG-002.md); nicht alle Kriterien sind umgesetzt oder verifiziert. Fachliche Abnahme der laufenden Anwendung: ausstehend.

