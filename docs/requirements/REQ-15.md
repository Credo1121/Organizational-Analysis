# REQ-15: Prüfbare Qualität und visuelle Umsetzung

Status: Draft · Revision: 1 · Datum: 06.11.2026
Typ: Enabler · Geplante Iteration: I1, je Iteration erweitern
Quelle: [Discovery](../discovery/organizational-analysis.md), Nutzerinterview im Chat. Keine fachliche Abnahme der folgenden Detailvorschläge.

## Problem und Benefit Statement

Damit wir die fachliche Wirkung und Bedienbarkeit beurteilen können, wird jede gelieferte Iteration gegen reale Akzeptanzkriterien geprüft.

## Rollen und Scope

Lokaler Einzelbenutzerbetrieb; technische Voraussetzung für die zugeordneten Business-Features.
Umfang und Regeln werden durch die folgenden Akzeptanzkriterien begrenzt. Vorschläge und offene Entscheidungen sind unten explizit aufgeführt.

## Akzeptanzkriterien

- **AC-01**: Ein synthetischer Referenzdatensatz enthält Innen-/Außensicht, fehlende Themen, Widersprüche, RACI-Gaps und unbewertete Werte; erwartete Verknüpfungen sind dokumentiert.
- **AC-02**: Die Kernreise Import → Finding manuell ändern → Empfehlung → HTML exportieren → Priorisierung zurückimportieren → Neustart wird erfolgreich ausgeführt; Fehler- und Fremdprojektfälle werden separat geprüft.
- **AC-03**: Für vereinbarte Desktop- und Mobile-Viewports werden echte Screenshots der laufenden App und des Exports erzeugt und geöffnet geprüft; generierte Konzeptbilder gelten nicht als Testevidenz.
- **AC-04**: Navigation, Bearbeitung und Priorisierung sind per Tastatur bedienbar; Fokus, Formularfehler und Diagrammwerte als Text sind zugänglich. Ohne Bewertungen werden keine Messwerte erfunden.
- **AC-05**: Build/Typprüfung und relevante Verhaltenstests werden mit Ergebnissen dokumentiert; NOT RUN, FAIL und PASS bleiben getrennt. Fachliche Abnahme wird ausschließlich vom Nutzer erteilt.

## Daten und Abhängigkeiten

Quellen, Findings, Empfehlungen und Exportstände werden über stabile IDs verknüpft. Personenkennungen sind Pseudonyme, keine Klarnamen. Abhängigkeiten: Alle I1-Features.

## Offene Entscheidungen und Nicht-Scope

Vorschlag für Testmatrix: Edge und Chrome auf tatsächlichem Unternehmenssystem, Desktop 1440×900/Mobile 390×844. Leistungsziel/-Messumgebung noch zu vereinbaren; keine ungemessenen Performanceversprechen.

## Priorität und Abnahme

Die Iterationszuordnung ist ein zu reviewender Planungsvorschlag. Vor Ready müssen die für diesen Slice relevanten offenen Entscheidungen gelöst, Verträge und Testfälle konkretisiert sein. Featureumfang zur PoC-Umsetzung vom Nutzer bestätigt (06.11.2026). Technische Abdeckung je AC: [Prüfbericht CHG-002](../qa/CHG-002.md); nicht alle Kriterien sind umgesetzt oder verifiziert. Fachliche Abnahme der laufenden Anwendung: ausstehend.
