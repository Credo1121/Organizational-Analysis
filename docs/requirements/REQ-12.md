# REQ-12: Persistenz, Versionierung und Wiederherstellung

Status: Draft · Revision: 1 · Datum: 06.11.2026
Typ: Enabler · Geplante Iteration: I1
Quelle: [Discovery](../discovery/organizational-analysis.md), Nutzerinterview im Chat. Keine fachliche Abnahme der folgenden Detailvorschläge.

## Problem und Benefit Statement

Damit meine Analyse nicht durch Neustart, Import oder Berichtsaustausch verloren geht, werden Daten und Versionsbezüge dauerhaft und konsistent gespeichert.

## Rollen und Scope

Lokaler Einzelbenutzerbetrieb; technische Voraussetzung für die zugeordneten Business-Features.
Umfang und Regeln werden durch die folgenden Akzeptanzkriterien begrenzt. Vorschläge und offene Entscheidungen sind unten explizit aufgeführt.

## Akzeptanzkriterien

- **AC-01**: Nach Speichern, Beenden und Neustart sind Quellen, Zuordnungen, Findings, Empfehlungen, Bewertungen und Prioritäten unverändert vorhanden.
- **AC-02**: Ein fehlgeschlagener Import/Speichervorgang hinterlässt keinen halben fachlichen Zustand und meldet den Fehler; Datenbanktransaktionen oder gleichwertiges Verhalten werden geprüft.
- **AC-03**: Berichte und Priorisierungsdateien enthalten eindeutige Projekt-/Versionsbezüge; veraltete Änderungen werden erkannt und nicht blind angewendet.
- **AC-04**: Ein dokumentiertes Projekt-Backup lässt sich in ein leeres lokales Datenverzeichnis wiederherstellen; ein Vergleich bestätigt Inhalte und Referenzen. Wiederherstellen überschreibt kein bestehendes Projekt ohne bewusste Entscheidung.

## Daten und Abhängigkeiten

Quellen, Findings, Empfehlungen und Exportstände werden über stabile IDs verknüpft. Personenkennungen sind Pseudonyme, keine Klarnamen. Abhängigkeiten: REQ-11.

## Offene Entscheidungen und Nicht-Scope

Speicherformat, Backup-Ort/-Verantwortung, Aufbewahrung und Löschung technisch/fachlich festlegen. I1 ein aktiver lokaler Bearbeiter, keine gleichzeitige Mehrbenutzerbearbeitung.

## Priorität und Abnahme

Die Iterationszuordnung ist ein zu reviewender Planungsvorschlag. Vor Ready müssen die für diesen Slice relevanten offenen Entscheidungen gelöst, Verträge und Testfälle konkretisiert sein. Featureumfang zur PoC-Umsetzung vom Nutzer bestätigt (06.11.2026). Technische Abdeckung je AC: [Prüfbericht CHG-002](../qa/CHG-002.md); nicht alle Kriterien sind umgesetzt oder verifiziert. Fachliche Abnahme der laufenden Anwendung: ausstehend.
