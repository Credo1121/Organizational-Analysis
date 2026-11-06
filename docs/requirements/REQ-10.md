# REQ-10: KI-gestützte Analysevorschläge mit menschlicher Kontrolle

Status: Draft · Revision: 1 · Datum: 06.11.2026
Typ: Business · Geplante Iteration: I2, nach Gateway-Freigabe
Quelle: [Discovery](../discovery/organizational-analysis.md), Nutzerinterview im Chat. Keine fachliche Abnahme der folgenden Detailvorschläge.

## Problem und Benefit Statement

Damit ich schneller analysieren kann, erhalte ich belegbezogene Vorschläge für Themen, Cluster, Findings und Empfehlungen und entscheide selbst über deren Übernahme.

## Rollen und Scope

Beratende Person als Bearbeiter; Kunden als Leser des freigegebenen HTML-Berichts und Teilnehmer der Priorisierung.
Umfang und Regeln werden durch die folgenden Akzeptanzkriterien begrenzt. Vorschläge und offene Entscheidungen sind unten explizit aufgeführt.

## Akzeptanzkriterien

- **AC-01**: Ein Analyselauf verarbeitet nur bewusst ausgewählte pseudonymisierte Daten über das freigegebene Gateway; Inhalt und Umfang sind vor dem Start erkennbar.
- **AC-02**: Vorschläge sind als KI-generiert gekennzeichnet, nennen bestehende Quell-IDs und trennen Beobachtung von Interpretation. Unbekannte Quell-IDs werden als fehlerhaft abgewiesen.
- **AC-03**: Jeder Vorschlag kann bearbeitet, übernommen oder verworfen werden; ein neuer Lauf überschreibt weder manuell bearbeitete Inhalte noch bestätigte Bewertungen.
- **AC-04**: Gateway-Ausfall, Timeout oder ungültige Antwort werden ohne Datenverlust angezeigt; ein abgebrochener Lauf erzeugt keine scheinbar vollständige Analyse.
- **AC-05**: Ein vollständiger Testlauf mit freigegebenen synthetischen Daten belegt die reale Integration. Manuelle Analyse bleibt bei fehlender KI-Verbindung möglich.

## Daten und Abhängigkeiten

Quellen, Findings, Empfehlungen und Exportstände werden über stabile IDs verknüpft. Personenkennungen sind Pseudonyme, keine Klarnamen. Abhängigkeiten: REQ-01, REQ-02, REQ-14.

## Offene Entscheidungen und Nicht-Scope

Gateway-Dokumentation, Zugriffsfreigabe, Datennutzung/Aufbewahrung, Kontextlimits und Modellverhalten fehlen. I1 ohne echte KI ist ein expliziter Umfangsvorschlag, kein Ersatz für diese Anforderung.

## Priorität und Abnahme

Die Iterationszuordnung ist ein zu reviewender Planungsvorschlag. Vor Ready müssen die für diesen Slice relevanten offenen Entscheidungen gelöst, Verträge und Testfälle konkretisiert sein. Featureumfang zur PoC-Umsetzung vom Nutzer bestätigt (06.11.2026). Technische Abdeckung je AC: [Prüfbericht CHG-002](../qa/CHG-002.md); nicht alle Kriterien sind umgesetzt oder verifiziert. Fachliche Abnahme der laufenden Anwendung: ausstehend.

