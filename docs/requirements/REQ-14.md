# REQ-14: Gateway-Vertrag und geschützte Konfiguration

Status: Draft · Revision: 1 · Datum: 06.11.2026
Typ: Enabler · Geplante Iteration: I2
Quelle: [Discovery](../discovery/organizational-analysis.md), Nutzerinterview im Chat. Keine fachliche Abnahme der folgenden Detailvorschläge.

## Problem und Benefit Statement

Damit KI-Verarbeitung intern kontrolliert bleibt, erhält die App einen verifizierten Integrationsvertrag und getrennt verwaltete Zugangsdaten.

## Rollen und Scope

Lokaler Einzelbenutzerbetrieb; technische Voraussetzung für die zugeordneten Business-Features.
Umfang und Regeln werden durch die folgenden Akzeptanzkriterien begrenzt. Vorschläge und offene Entscheidungen sind unten explizit aufgeführt.

## Akzeptanzkriterien

- **AC-01**: Authentifizierung, Endpunkt, Anfrage-/Antwortschema, Timeouts und Größenlimits werden anhand interner Dokumentation beschrieben und mit einem freigegebenen Testaufruf verifiziert.
- **AC-02**: Zugangsdaten werden nicht im Browser ausgeliefert, nicht exportiert, nicht eingecheckt und nicht in Logs geschrieben; der lokale geschützte Dienst führt Gateway-Aufrufe aus.
- **AC-03**: Es gibt keinen automatischen Fallback auf öffentliche KI-Dienste; fehlende Konfiguration macht die KI-Funktion sichtbar nicht verfügbar.
- **AC-04**: Logs enthalten keine Interviewtexte/Prompts/Antwortinhalte. Modellantworten gelten als untrusted Daten und können keine App-Operationen oder Änderungen ohne Nutzerentscheidung auslösen.

## Daten und Abhängigkeiten

Quellen, Findings, Empfehlungen und Exportstände werden über stabile IDs verknüpft. Personenkennungen sind Pseudonyme, keine Klarnamen. Abhängigkeiten: REQ-11, REQ-13.

## Offene Entscheidungen und Nicht-Scope

Interne Experten liefern technische Angaben und Freigaben; keine Secrets im Chat. Verbindungsfehler und reale Integrationsprüfung bleiben bis dahin offen.

## Priorität und Abnahme

Die Iterationszuordnung ist ein zu reviewender Planungsvorschlag. Vor Ready müssen die für diesen Slice relevanten offenen Entscheidungen gelöst, Verträge und Testfälle konkretisiert sein. Featureumfang zur PoC-Umsetzung vom Nutzer bestätigt (06.11.2026). Technische Abdeckung je AC: [Prüfbericht CHG-002](../qa/CHG-002.md); nicht alle Kriterien sind umgesetzt oder verifiziert. Fachliche Abnahme der laufenden Anwendung: ausstehend.
