# REQ-04: RACI, Prozessschritte und Reifegrad-Gaps verknüpfen

Status: Draft · Revision: 1 · Datum: 06.11.2026
Typ: Business · Geplante Iteration: I1
Quelle: [Discovery](../discovery/organizational-analysis.md), Nutzerinterview im Chat. Keine fachliche Abnahme der folgenden Detailvorschläge.

## Problem und Benefit Statement

Damit Verantwortungs- und Reifelücken nachvollziehbar werden, verbinde ich Prozessschritte, RACI, Findings und Empfehlungen.

## Rollen und Scope

Beratende Person als Bearbeiter; Kunden als Leser des freigegebenen HTML-Berichts und Teilnehmer der Priorisierung.
Umfang und Regeln werden durch die folgenden Akzeptanzkriterien begrenzt. Vorschläge und offene Entscheidungen sind unten explizit aufgeführt.

## Akzeptanzkriterien

- **AC-01**: Ist-/Soll-Reifegrade akzeptieren nur ganze Werte von 1 bis 4 oder explizit unbewertet; Rollen R/A/C/I und Prozessreife werden getrennt angezeigt.
- **AC-02**: Prozessreife: 1 personenabhängig/kein Prozess; 2 teilweise etabliert; 3 Prozess genutzt, nicht konsequent gesteuert; 4 etabliert und entscheidungswirksam. Ist und Ziel sowie Einschätzungsquelle bleiben sichtbar.
- **AC-03**: Ein Prozessschritt kann mit mehreren Findings/Empfehlungen verknüpft werden; aus der Detailansicht sind die jeweiligen Belege erreichbar.
- **AC-04**: Empfehlungen können Nachweise für den Ziel-Reifegrad enthalten; ihre Freigabe oder Erledigung erhöht den Ist-Reifegrad nicht automatisch.
- **AC-05**: Die Einschätzung der PM-Leitung und entgegenstehende Interviewaussagen werden nebeneinander erhalten; unbekannte oder strittige Verantwortung bleibt als solche markiert.

## Daten und Abhängigkeiten

Quellen, Findings, Empfehlungen und Exportstände werden über stabile IDs verknüpft. Personenkennungen sind Pseudonyme, keine Klarnamen. Abhängigkeiten: REQ-01, REQ-02.

## Offene Entscheidungen und Nicht-Scope

Konkretes RACI-Schema, Bedeutung Ist-/Soll-Rolle und genaue Prozessnamen fehlen; kein automatischer organisationsweiter Vollständigkeitscheck aus einer reinen PM-Sicht.

## Priorität und Abnahme

Die Iterationszuordnung ist ein zu reviewender Planungsvorschlag. Vor Ready müssen die für diesen Slice relevanten offenen Entscheidungen gelöst, Verträge und Testfälle konkretisiert sein. Featureumfang zur PoC-Umsetzung vom Nutzer bestätigt (06.11.2026). Technische Abdeckung je AC: [Prüfbericht CHG-002](../qa/CHG-002.md); nicht alle Kriterien sind umgesetzt oder verifiziert. Fachliche Abnahme der laufenden Anwendung: ausstehend.

