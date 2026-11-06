# REQ-07: Interaktiven HTML-Ergebnisbericht exportieren

Status: Draft · Revision: 1 · Datum: 06.11.2026
Typ: Business · Geplante Iteration: I1
Quelle: [Discovery](../discovery/organizational-analysis.md), Nutzerinterview im Chat. Keine fachliche Abnahme der folgenden Detailvorschläge.

## Problem und Benefit Statement

Damit ich Ergebnisse ohne installierte Kunden-App besprechen kann, exportiere ich einen eigenständig nutzbaren, nachvollziehbaren Bericht.

## Rollen und Scope

Beratende Person als Bearbeiter; Kunden als Leser des freigegebenen HTML-Berichts und Teilnehmer der Priorisierung.
Umfang und Regeln werden durch die folgenden Akzeptanzkriterien begrenzt. Vorschläge und offene Entscheidungen sind unten explizit aufgeführt.

## Akzeptanzkriterien

- **AC-01**: Der Export enthält den ausdrücklich ausgewählten und freigegebenen Stand mit Projektkennung, Berichtsversion, Exportzeitpunkt und Kennzeichnung als Diskussionsstand oder abgestimmter Stand.
- **AC-02**: Im lokal geöffneten Bericht funktionieren Navigation, Filter und Details ohne laufende Berater-App und ohne externe Netzwerkaufrufe.
- **AC-03**: Vom Finding sind alle verknüpften Problem Statements und pseudonymisierten Interviewquellen erreichbar; RACI und Ist-/Soll-Reifegrade sind enthalten. Transkripte, Zugangsdaten und interne Bearbeitungsnotizen fehlen.
- **AC-04**: Vor Export zeigt eine Vorschau den enthaltenen Datenumfang; nicht freigegebene Findings erscheinen nicht versteckt im HTML-Datenbestand. Das Quellenverzeichnis enthält die für diesen Export bewusst freigegebene vollständige Quellenbasis.
- **AC-05**: Fehlende Bewertungen/Perspektiven und Hypothesen bleiben sichtbar; keine KI-Vorschläge werden ohne menschliche Auswahl exportiert.

## Daten und Abhängigkeiten

Quellen, Findings, Empfehlungen und Exportstände werden über stabile IDs verknüpft. Personenkennungen sind Pseudonyme, keine Klarnamen. Abhängigkeiten: REQ-01 bis REQ-05, REQ-13.

## Offene Entscheidungen und Nicht-Scope

Vorschlag: eine selbstenthaltende HTML-Datei, Download aus Teams und lokales Öffnen in unterstütztem Browser. Dateizugriff bedeutet Inhaltszugriff; kein vorgetäuschter HTML-Passwortschutz. Quellenumfang muss vor Export bewusst freigegeben werden.

## Priorität und Abnahme

Die Iterationszuordnung ist ein zu reviewender Planungsvorschlag. Vor Ready müssen die für diesen Slice relevanten offenen Entscheidungen gelöst, Verträge und Testfälle konkretisiert sein. Featureumfang zur PoC-Umsetzung vom Nutzer bestätigt (06.11.2026). Technische Abdeckung je AC: [Prüfbericht CHG-002](../qa/CHG-002.md); nicht alle Kriterien sind umgesetzt oder verifiziert. Fachliche Abnahme der laufenden Anwendung: ausstehend.

