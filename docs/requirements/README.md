# Anforderungsreview: Organisationsanalyse

Status: Featureumfang zur PoC-Umsetzung vom Nutzer bestätigt · 06.11.2026. Detailanforderungen mit offenen Entscheidungen bleiben Draft; fachliche Abnahme der laufenden App ausstehend. Aktuelle Umsetzung: [CHG-002](../changes/CHG-002.md).

## Ziel und bestätigter Kontext

Lokales Beratungsinstrument für Organisationsanalysen, zunächst Produktmanagement im anlagentechnischen Brandschutz. Pseudonymisierte Problem Statements und RACI bilden die Quellenbasis. Findings, Innen-/Außensicht, STAR, Prozessreife und Empfehlungen bleiben nachvollziehbar verbunden und manuell bearbeitbar. Kunden erhalten einen interaktiven HTML-Ergebnisbericht als freigegebenen Stand, nicht die Analyse-App. Quelle: [Interviewnotizen](../discovery/organizational-analysis.md).

Das reduzierte, helle Design mit Nutzer-Blau und futuristischem Radar ist als visuelle Richtung bestätigt. Konzeptgrafiken sind keine Implementierung oder Prüfevidenz. Radarbewertung und Prozessreife sind getrennte fachliche Entscheidungen.

## Begriffe

- Problem Statement: aufbereitetes Quellmaterial, einschließlich pseudonymisierter Herkunft.
- Cluster: thematische Gruppierung, nicht automatisch ein bestätigtes Problem.
- Finding: fachlich verdichtete Beobachtung mit Belegen und getrennter Interpretation.
- Handlungshypothese: noch zu prüfender Lösungsansatz.
- Empfehlung: durch Berater bearbeitbare Maßnahme mit erwarteter Wirkung und Verknüpfungen.
- Schwere: Kundenbewertung des Problems; Aufwand: Umsetzung einer Maßnahme; Priorität: vereinbarte Reihenfolge. Keine Gleichsetzung oder stillschweigende Gesamtformel.
- Freigabe zur Diskussion durch Berater ist keine Kundenbestätigung. Eine fehlende Perspektive bleibt fehlend, nicht Zustimmung.

## Featureverzeichnis

| ID | Typ | Feature | Vorschlag |
|---|---|---|---|
| [REQ-01](REQ-01.md) | Business | Quellen importieren und prüfen | I1 |
| [REQ-02](REQ-02.md) | Business | Cluster und belegte Findings manuell bearbeiten | I1 |
| [REQ-03](REQ-03.md) | Business | Innen-/Außensicht und STAR erkunden | I1; Radarbewertung nach Klärung |
| [REQ-04](REQ-04.md) | Business | RACI, Prozessschritte und Reifegrad-Gaps verknüpfen | I1 |
| [REQ-05](REQ-05.md) | Business | Empfehlungen, Bewertung und Priorität bearbeiten | I1 |
| [REQ-06](REQ-06.md) | Business | Arbeitsverteilung und Handlungsschwerpunkte erkunden | I2 |
| [REQ-07](REQ-07.md) | Business | Interaktiven HTML-Ergebnisbericht exportieren | I1 |
| [REQ-08](REQ-08.md) | Business | Workshop-Priorisierung speichern und zurückübernehmen | I1 |
| [REQ-09](REQ-09.md) | Business | Arbeitspakete und Ergebnisfahrplan 2027 | I3 |
| [REQ-10](REQ-10.md) | Business | KI-gestützte Analysevorschläge mit menschlicher Kontrolle | I2, nach Gateway-Freigabe |
| [REQ-11](REQ-11.md) | Enabler | Lokaler Betrieb und Zugriffsschutz | I1 |
| [REQ-12](REQ-12.md) | Enabler | Persistenz, Versionierung und Wiederherstellung | I1 |
| [REQ-13](REQ-13.md) | Enabler | Sichere Quellenverarbeitung und eigenständiger Export | I1 |
| [REQ-14](REQ-14.md) | Enabler | Gateway-Vertrag und geschützte Konfiguration | I2 |
| [REQ-15](REQ-15.md) | Enabler | Prüfbare Qualität und visuelle Umsetzung | I1, je Iteration erweitern |

## Vorgeschlagener Lieferplan

### I1a: Erster durchgängiger Entwicklungsstand

REQ-01 (Problem-Statement-CSV), REQ-02, REQ-03 (Filter/Innen-Außen, noch keine ungeklärten Radarwerte), REQ-05 (manuelle Empfehlungen; Scoring erst nach Skalenentscheidung), REQ-07 sowie die dafür nötigen REQ-11–13 und REQ-15. Ein vollständig synthetisches Projekt durchläuft Import → manuelles Finding → Empfehlung → Bericht → Neustart. Das ist eine funktionsfähige Vorschau, noch nicht der komplette gewünschte Workshop-Bericht.

### I1b: Erster Workshop-Bericht

Ergänzt RACI-Import und REQ-04, REQ-08 und die bestätigten Bewertungen/Radarwerte. Bericht mit Quellenverzeichnis, RACI, Innen-/Außensicht, Findings und manuell erstellten Handlungshypothesen; offene Bewertungen und fehlende Interviews sichtbar. Kernreise schließt Priorisierungsaustausch ein.

I1a/I1b bilden gemeinsam den vorgeschlagenen Umfang der ersten Iteration. Reihenfolge abhängig von vorhandenen Daten und Gateway-Klärung. Kein Fertigstellungsdatum zugesagt: Erstgespräch noch nicht terminiert; Durchführbarkeit erst nach Umgebungs-/Schnittstellenprüfung bewerten.

### I2: Analyse beschleunigen und Zielbild erkunden

REQ-06, REQ-10 und REQ-14. Echte KI nur über freigegebenes Gateway, mit Quellenprüfung und menschlicher Übernahme. Falls automatische Vorschläge bereits für den ersten Workshop zwingend sind, ist das ein Umfangsentscheid: Gateway wird dann Voraussetzung des ersten Workshop-Stands. Keine Attrappe als erfüllte KI-Funktion deklarieren.

### I3: Ergebnisbericht und Umsetzungsfahrplan

REQ-09 und fachliche Vertiefung vorhandener Features: priorisierte Empfehlungen, Arbeitsergebnisse und Zeitleiste 2027. Geplanter Analyseabschluss laut Interview Ende November 2026; Umsetzungstermine für 2027 sind zunächst Annahmen, keine Zusagen.

## Voraussetzungen und aktueller Stand

1. **Fachlicher Umfang:** Featureentwurf nach B1-Ergänzung vom Nutzer bestätigt und PoC beauftragt. Umgesetzte Teilumfänge und verbliebene AC stehen im [Prüfbericht](../qa/CHG-002.md); keine vollständige Produktabnahme.
2. **Eingabe-Vertrag:** rein synthetische oder leere CSV-Vorlagen für Problem Statements und RACI, stabile IDs/Mehrfachquellen und Rollenfelder festlegen. Keine echten Daten für den Entwicklungsstart erforderlich.
3. **Arbeitsplatz:** Zielbetriebssystem, erlaubte Runtime, Startweg und Speicherort außerhalb des Repositorys bestätigen. Lokales Login-Verfahren und Backup-/Löschregeln festlegen.
4. **Bewertung:** Definitionen für Findingschwere, Empfehlungsaufwand und STAR-Radar bestätigen. Unbewertete Zustände sind zulässig; keine Übertragung der Prozessreifeskala auf STAR ohne fachliche Entscheidung.
5. **Integrations- und Testgrundlage:** Architektur, Datenmodell, UI-/Datenverträge, Authentifizierung und risikobasierte Testfälle für I1 ausarbeiten. Browser, Viewports, Importgrenzen und ein messbares Leistungsziel mit Messumgebung festlegen.
6. **Für KI:** interne Gateway-Dokumentation, Zugriff und Datenschutz-/Betriebsfreigaben. Dies blockiert die echte KI-Funktion, nicht den vorgeschlagenen manuellen/synthetischen Kern.

## Vorschläge, die noch zu bestätigen sind

- Erst CSV, kein XLSX- oder Transkriptimport. Nutzerreview B1: Pseudonymisierung vorhandener Personendaten innerhalb der App vor Freigabe für Analyse, Gateway und Export; bereits bereinigte Daten bleiben ebenfalls importierbar. Details zu Erkennung und Zuordnungstabelle noch offen.
- Ein lokaler Bearbeiter und ein Projekt im ersten Lieferumfang; keine Multi-Mandantenverwaltung.
- Quellcode in privatem GitHub-Repository; Kundendaten, Exporte, Backups und Secrets außerhalb des Repositorys. Sichtbarkeit des aktuellen GitHub-Repositorys ist nicht geprüft.
- Eigenständige HTML-Datei; Teams als Ablage, Download und Öffnen im Browser. Tatsächlicher Unternehmensbrowser und Teams-Downloadweg noch zu testen.
- Quellenverzeichnis enthält alle ausdrücklich freigegebenen pseudonymisierten Quellen und Problem Statements, keine Transkripte. Berichtszugriff ist Dateizugriff; kein vorgetäuschter Zugriffsschutz im statischen HTML.
- Prioritätsaustausch als Datei mit Projekt-/Versionsbezug und bewusster Übernahme.
- Zielbildregler verändern Hervorhebungen, nicht automatisch bestätigte Rangfolge oder berechnete Kapazität.

## Abnahme und Grenzen

Vor Ready: klarer Scope, fachliche Kriterien und notwendige technische Voraussetzungen je Slice geklärt. Vor Done: AC tatsächlich getestet, Kernreise/Persistenz/Fehlerfälle geprüft und echte UI-Screenshots kontrolliert. Fachliche Abnahme durch den Nutzer separat. Vor produktiver Nutzung mit Kundendaten: vereinbarter lokaler Schutz und Unternehmensfreigaben verifiziert. Keine pauschale Sicherheits-, Datenschutz- oder Normkonformitätsbehauptung.

Der lokale PoC ist implementiert. 6 Fach-/SQLite-Testgruppen, 1 Browser-Kernreise, Typprüfung, Build und Formatprüfung bestanden. [Prüfbericht mit AC-Abgrenzung und echten Screenshots](../qa/CHG-002.md). Noch nicht umgesetzte oder ungeprüfte Kriterien bleiben offen; Konzeptbilder sind keine Testevidenz.

Nächster Arbeitsmodus: web-requirements für fachliches Review des laufenden PoC. Architektur, Verträge und erste Tests liegen vor. Anschließend Gateway und kundenspezifische CSV-Struktur konkretisieren; I2/I3 bleiben als Folgeslices bestehen.
