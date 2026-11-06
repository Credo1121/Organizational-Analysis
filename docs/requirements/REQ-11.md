# REQ-11: Lokaler Betrieb und Zugriffsschutz

Status: Draft · Revision: 1 · Datum: 06.11.2026
Typ: Enabler · Geplante Iteration: I1
Quelle: [Discovery](../discovery/organizational-analysis.md), Nutzerinterview im Chat. Keine fachliche Abnahme der folgenden Detailvorschläge.

## Problem und Benefit Statement

Damit Kundendaten nicht über eine öffentlich erreichbare App verarbeitet werden, läuft die App geschützt auf meinem Unternehmensrechner.

## Rollen und Scope

Lokaler Einzelbenutzerbetrieb; technische Voraussetzung für die zugeordneten Business-Features.
Umfang und Regeln werden durch die folgenden Akzeptanzkriterien begrenzt. Vorschläge und offene Entscheidungen sind unten explizit aufgeführt.

## Akzeptanzkriterien

- **AC-01**: Die Anwendung bindet ausschließlich an Loopback; ein Zugriff über eine andere Netzwerkschnittstelle ist nicht möglich.
- **AC-02**: Vor gültiger Anmeldung liefern UI und Datenendpunkte keine Projektinhalte; Abmeldung beendet den Zugriff auf geschützte Operationen.
- **AC-03**: Kundendaten, Exporte und Zugangsdaten liegen außerhalb des Git-Checkout; die Standardkonfiguration sendet keine Telemetrie oder Daten an externe Dienste.
- **AC-04**: Dokumentierte Start-/Stopp-Anweisungen funktionieren auf dem vereinbarten Unternehmenssystem; ohne Gateway bleibt der manuelle Kernworkflow nutzbar.

## Daten und Abhängigkeiten

Quellen, Findings, Empfehlungen und Exportstände werden über stabile IDs verknüpft. Personenkennungen sind Pseudonyme, keine Klarnamen. Abhängigkeiten: REQ-12, REQ-13.

## Offene Entscheidungen und Nicht-Scope

Zielbetriebssystem, erlaubte lokale Runtime und Authentifizierungsverfahren offen. Vorschlag: lokale Einzelbenutzer-App. Keine behauptete Verschlüsselung der Dateien durch Login; Unternehmensgeräte-/Backup-Schutz separat klären.

## Priorität und Abnahme

Die Iterationszuordnung ist ein zu reviewender Planungsvorschlag. Vor Ready müssen die für diesen Slice relevanten offenen Entscheidungen gelöst, Verträge und Testfälle konkretisiert sein. Featureumfang zur PoC-Umsetzung vom Nutzer bestätigt (06.11.2026). Technische Abdeckung je AC: [Prüfbericht CHG-002](../qa/CHG-002.md); nicht alle Kriterien sind umgesetzt oder verifiziert. Fachliche Abnahme der laufenden Anwendung: ausstehend.

