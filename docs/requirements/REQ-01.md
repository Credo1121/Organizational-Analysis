# REQ-01: Quellen importieren und prüfen

Status: Draft · Revision: 2 · Datum: 06.11.2026
Typ: Business · Geplante Iteration: I1
Quelle: [Discovery](../discovery/organizational-analysis.md), Nutzerinterview im Chat. Keine fachliche Abnahme der folgenden Detailvorschläge.

## Problem und Benefit Statement

Damit ich meine vorhandene Analyse weiterverwenden kann, importiere ich pseudonymisierte Problem Statements und RACI-Daten mit nachvollziehbaren Quellen.

## Rollen und Scope

Beratende Person als Bearbeiter; Kunden als Leser des freigegebenen HTML-Berichts und Teilnehmer der Priorisierung.
Umfang und Regeln werden durch die folgenden Akzeptanzkriterien begrenzt. Vorschläge und offene Entscheidungen sind unten explizit aufgeführt.

## Akzeptanzkriterien

- **AC-01**: Eine CSV mit Problemtext, stabiler Statement-ID, Interviewkennung, Zugehörigkeit und Innen-/Außensicht lässt sich über eine Vorschau und Spaltenzuordnung einlesen; Themenfeld darf fehlen und wird als offen markiert.
- **AC-02**: Fehlender Problemtext, ungültige Perspektive oder unbekannte Pflichtzuordnung werden mit Zeile und Feld angezeigt; vor Bestätigung werden keine Projektdaten verändert.
- **AC-03**: Ein erneuter Import gleicher IDs erzeugt keine stillen Duplikate oder Überschreibungen; Konflikte werden zur Entscheidung angezeigt.
- **AC-04**: RACI-Import erhält Prozess-/Schrittkennung, PM-Rollen, Ist-/Soll-Reifegrad und Quelle der Einschätzung; Originaldateien werden nicht verändert.
- **AC-05**: Enthalten die Importdaten personenbezogene Angaben, können diese vor der Übernahme in die Analyse innerhalb der App pseudonymisiert werden. Die Prüfung umfasst zugeordnete Personenfelder und Freitexte; erkannte Stellen werden in einer bereinigten Vorschau markiert und können manuell ergänzt oder korrigiert werden.
- **AC-06**: Dieselbe Person erhält innerhalb eines Projekts eine konsistente Kennung, beispielsweise INT-01. Bezüge zwischen Interviewquellen, Problem Statements und RACI bleiben erhalten; bereits pseudonymisierte Quellen werden nicht ungefragt neu nummeriert.
- **AC-07**: Erst nach ausdrücklicher Prüfung und Bestätigung der bereinigten Vorschau werden die Daten für Analyse, Gateway-Verarbeitung und Bericht freigegeben. Ein synthetischer Testfall mit Personendaten in Spalten und Freitext belegt, dass die ersetzten Originalangaben dort nicht enthalten sind.

## Daten und Abhängigkeiten

Quellen, Findings, Empfehlungen und Exportstände werden über stabile IDs verknüpft. Personenkennungen sind Pseudonyme, keine Klarnamen. Abhängigkeiten: REQ-12, REQ-13.

## Offene Entscheidungen und Nicht-Scope

Spaltenstruktur einschließlich mehrerer Quellen je Statement und RACI-Rollenformat; CSV als erster Importweg ist ein Vorschlag. Pseudonymisierung innerhalb der App ist aufgrund des Nutzerreviews Teil von I1. Zu erkennende Angaben (z. B. Namen, E-Mail-Adressen, Telefonnummern), Erkennungsverfahren und Aufbewahrung einer etwaigen Zuordnungstabelle sind vor Umsetzung zu konkretisieren. Automatische Erkennung garantiert keine Vollständigkeit oder Anonymität; manuelle Prüfung bleibt erforderlich. Nicht-Scope: XLSX-/Transkriptverarbeitung in I1. Originalangaben und eine etwaige Zuordnungstabelle gehören nicht in den HTML-Bericht oder Gateway-Anfragen.

## Priorität und Abnahme

Die Iterationszuordnung ist ein zu reviewender Planungsvorschlag. Vor Ready müssen die für diesen Slice relevanten offenen Entscheidungen gelöst, Verträge und Testfälle konkretisiert sein. Featureumfang zur PoC-Umsetzung vom Nutzer bestätigt (06.11.2026). Technische Abdeckung je AC: [Prüfbericht CHG-002](../qa/CHG-002.md); nicht alle Kriterien sind umgesetzt oder verifiziert. Fachliche Abnahme der laufenden Anwendung: ausstehend.
