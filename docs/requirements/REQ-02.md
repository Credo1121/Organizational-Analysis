# REQ-02: Cluster und belegte Findings manuell bearbeiten

Status: Draft · Revision: 1 · Datum: 06.11.2026
Typ: Business · Geplante Iteration: I1
Quelle: [Discovery](../discovery/organizational-analysis.md), Nutzerinterview im Chat. Keine fachliche Abnahme der folgenden Detailvorschläge.

## Problem und Benefit Statement

Damit ich Aussagen fachlich verdichten kann, bilde und bearbeite ich Cluster und Findings mit prüfbaren Belegen.

## Rollen und Scope

Beratende Person als Bearbeiter; Kunden als Leser des freigegebenen HTML-Berichts und Teilnehmer der Priorisierung.
Umfang und Regeln werden durch die folgenden Akzeptanzkriterien begrenzt. Vorschläge und offene Entscheidungen sind unten explizit aufgeführt.

## Akzeptanzkriterien

- **AC-01**: Statements können mehreren Findings und Clustern zugeordnet und wieder entfernt werden; die Quellen bleiben unverändert erhalten.
- **AC-02**: Finding-Titel, Beobachtung, Interpretation und Handlungshypothese sind getrennt bearbeitbar; Speichern und Neustart erhalten die Änderungen.
- **AC-03**: Ein Finding ohne Belege bleibt als unbelegte Hypothese erkennbar und kann nicht als belegter Befund freigegeben werden.
- **AC-04**: Widersprechende Aussagen können mit Verweis auf ihre Quelle dokumentiert werden; einseitige oder fehlende Perspektiven sind sichtbar.

## Daten und Abhängigkeiten

Quellen, Findings, Empfehlungen und Exportstände werden über stabile IDs verknüpft. Personenkennungen sind Pseudonyme, keine Klarnamen. Abhängigkeiten: REQ-01, REQ-12.

## Offene Entscheidungen und Nicht-Scope

Vorgeschlagene Zustände: Entwurf, geprüft, zur Diskussion freigegeben. Freigabe durch die beratende Person, keine vorweggenommene Kundenvalidierung.

## Priorität und Abnahme

Die Iterationszuordnung ist ein zu reviewender Planungsvorschlag. Vor Ready müssen die für diesen Slice relevanten offenen Entscheidungen gelöst, Verträge und Testfälle konkretisiert sein. Featureumfang zur PoC-Umsetzung vom Nutzer bestätigt (06.11.2026). Technische Abdeckung je AC: [Prüfbericht CHG-002](../qa/CHG-002.md); nicht alle Kriterien sind umgesetzt oder verifiziert. Fachliche Abnahme der laufenden Anwendung: ausstehend.

