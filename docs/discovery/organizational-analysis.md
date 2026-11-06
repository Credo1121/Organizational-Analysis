# Discovery: Beratungsinstrument für Organisationsanalysen

Status: Featureentwurf nach B1-Ergänzung vom Nutzer bestätigt und PoC beauftragt. Lauffähiger lokaler Stand gemäß CHG-002; fachliche Abnahme und offene Detailentscheidungen ausstehend.
Quelle: Beschreibung des Nutzers im Chat; Perspektive der beratenden Person. Kundensicht noch nicht direkt validiert.

## Interviewnotizen

- Aktueller Anwendungsfall: Organisationsanalyse des Produktmanagements im anlagentechnischen Brandschutz.
- Grundlage: rund 14 Interviews mit Produktmanagement und Schnittstellen, darunter Vertrieb, Pre-Sales, Qualität und Werkskundendienst; bereits vorhandene Excel-Aufbereitung mit etwa fünf bis sieben Problemstellungen je Interview; zusätzliche RACI.
- Gewünschte Unterstützung: Inputs importieren (zunächst wahrscheinlich CSV), Problemstellungen strukturieren und clustern, gemeinsame Themen und Schwere erkennen sowie Quellenreferenzen erhalten.
- Innen- und Außensicht gegenüberstellen: zum Beispiel operative Belastung durch Artikelpflege und Medienbrüche gegenüber Erwartungen an Portfolioarbeit, Anforderungen und Unterstützung im Produktentstehungsprozess/Lifecycle.
- Bestätigt: Findings anhand des Star Model nach Jay Galbraith einordnen: Strategie, Struktur, Prozesse, Anreize und Menschen. McKinsey 7S ist eine getrennte Perspektive; Nutzer bevorzugt zunächst STAR.
- Handlungsempfehlungen vorschlagen, manuell bearbeiten/überschreiben und durch die beratende Person priorisieren; aktueller Planungshorizont 2027.
- Operative, taktische und strategische Arbeit im Ist und Ziel darstellen. Veränderbare Gewichtung soll den Fokus auf Empfehlungen sichtbar machen; operative Entlastung ist eine Voraussetzung für mehr taktische/strategische Arbeit.
- Bestätigte Aufteilung: Die beratende Person nutzt die Analyse-App für Datenverarbeitung, Analyse und Bearbeitung von Handlungsempfehlungen. Kunden erhalten einen interaktiven HTML-Ergebnisbericht statt einer gemeinsamen Analyse-App. Wiederverwendung für weitere Beratungsfälle erwünscht.
- Hohe Vertraulichkeit, Pseudonymisierung und Login gewünscht. Keine Klarnamen in der Analyse. Lokaler Betrieb bzw. lokale Bereitstellung über einen internen Port erwünscht; konkrete Betriebsform offen.
- Ergänzung aus der nächsten Interviewrunde: pseudonymisierte Inhalte sollen durch ein vorhandenes internes LM-Gateway verarbeitet werden. Technische Schnittstelle, Authentifizierung und konkrete Freigaben sind noch ungeprüft.
- Erste Nutzung für einen Kunden. Bestätigt: Teams dient als Ablage des HTML-Ergebnisberichts. Im Bericht sollen Kunden Themen aufklappen/erkunden können, etwa unter Strategie interne/externe Problemstellungen, RACI-Gaps und zugehörige Empfehlungen. Keine gemeinsame Bearbeitung oder Ausführung neuer KI-Analysen durch Kunden gewünscht. Konkreter Öffnungsweg und technische Exportform noch ungeprüft.
- Nutzer klärt das interne LM-Gateway mit internen Experten; Dokumentation und Zugriff noch offen. Für die Entwicklung zunächst keine sensiblen Kundendaten; Beispieldaten werden später bereitgestellt. Synthetische Entwicklungsdaten sind als Vorschlag zu behandeln, nicht als echte Analyse-Evidenz.
- Eingabestruktur laut Nutzer: Problem Statement in Spalte A; teilweise gepflegtes Themenfeld (Kapazität, Kompetenzen, Datensysteme, Prozesse, Schnittstellen, Strategie/Portfolio); Interviewpartner und organisatorische Zugehörigkeit, darüber Innen-/Außenperspektive. Vorhandene persönliche Lösungsideen und Excel-Heatmap sollen zunächst nicht als Analysegrundlage übernommen werden.
- Schwere soll durch manuelles Scoring gemeinsam mit dem Kunden bewertet werden; genaue Skala, Kriterien und Bewertungsebene noch offen. Nutzer ist offen für interpretative Unterstützung. Priorisierung von Findings und Ableitung der Maßnahmen sollen daran anschließen.
- Umsetzungsaufwand ist als eigene Betrachtung relevant: Nutzerbeispiel SAP-Implementierung gegenüber Änderung einer Meetingstruktur. Konkrete Einstufungen sind nicht validiert und nicht mit Schwere gleichzusetzen.
- Ist-Verteilung: Laut Nutzer liegt eine Selbstauswertung mit etwa 70–80 % operativer Arbeit vor; genaue Werte für alle drei Ebenen noch nicht bereitgestellt. Zielidee etwa 50 % operativ, 30–35 % taktisch, Rest strategisch; noch kein festgelegter Standard oder bestätigtes Ziel.
- Ziel der Regler: Bei mehr taktischer/strategischer Arbeit die notwendigen Empfehlungen zur operativen Entlastung und zum Aufbau der entsprechenden Fähigkeiten sichtbar machen. Beispiele: Entlastung bei Artikel-/Stammdatenpflege durch Automatisierung/Arbeitsmodell; Anforderungsmanagement, Marktanalyse und Portfolioarbeit stärken. Keine belastbaren Zeitersparnisse oder quantitativen Wirkungsmodelle bislang genannt.
- RACI laut Nutzer: vier Kernprozesse über den Produktlebenszyklus einschließlich Idee bis Abkündigung und Reklamationen; Abgleich einer Prozessmatrix mit der Einschätzung des PM-Leiters zur R/A/C/I-Verantwortung des Produktmanagements. Zusätzlich Ist-/Soll-Reifegrad und gewünschte Verantwortung. Unklare Verantwortungen und daraus entstehende Zusatzarbeit sind ein Untersuchungsthema. Konkrete Spalten und Prozessnamen fehlen noch. Einschätzungen des Leiters nicht als organisationsweit bestätigte Fakten behandeln.
- Reifegradskala aus dem Interview: 1 = personenabhängig, kein Prozess; 2 = teilweise etabliert; 3 = Prozesse vorhanden und in Nutzung, aber noch nicht konsequent gesteuert; 4 = Prozesse vollständig aufgesetzt, Entscheidungen werden darüber getroffen. Diese Skala beschreibt Prozessreife, nicht Problemschwere.
- Interviews liegen als Transkripte vor; Nutzer hat sie bereits in etwa 70 Problem Statements in Excel/CSV ausgewertet. Vorherige Pseudonymisierung durch den Nutzer mit stabilen Gesprächspartner-Kennungen ist für ihn möglich. Import vollständiger Transkripte in Version 1 noch nicht ausdrücklich entschieden.
- Nutzer stimmt dem Ansatz zu, verdichtete Findings mit Belegen gemeinsam zu bewerten. Für das erste Gespräch sollen strategische, taktische und operative Themen sowie Handlungshypothesen diskutiert, gewichtet und zur Vertiefung ausgewählt werden.
- Meilensteine laut Nutzer: initiale Besprechung mit Leiter PM nächste Woche, zunächst eventuell mit ein bis zwei fehlenden Perspektiven; konkreter Analysebericht bis Ende November mit Findings, Empfehlungen und einer Work Breakdown Structure für priorisierte Empfehlungen. Bezug zum Gesprächsdatum 06.11.2026: nächste Kalenderwoche 09.–15.11.2026, Monatsende 30.11.2026; genauer Gesprächstermin offen. Umfang der WBS und Integration in den HTML-Bericht noch abzustimmen.
- Präzisierung: Erstgespräch voraussichtlich Mitte/Ende nächster Woche, noch nicht terminiert. Interaktiver HTML-Bericht wird bereits für dieses Gespräch benötigt und anschließend weiterentwickelt.
- WBS soll Empfehlungen, Arbeitsergebnisse und eine Zeitleiste für erwartete Ergebnisse in 2027 umfassen. Genauere Tiefe wird anhand konkreter Empfehlungen abgestimmt; Termine und Aufwände sind noch nicht festgelegt.
- Bestätigt: Berater-App soll lokal laufen. Nutzer fragt nach dem Unterschied zwischen privatem GitHub-Repository und lokalem Betrieb; Repository-Sichtbarkeit ist nicht geprüft. Empfehlung zur Trennung von Quellcode in Git und Kundendaten außerhalb des Repositorys steht noch zur fachlichen Bestätigung.
- Exportumfang bestätigt: Quellenverzeichnis mit allen pseudonymisierten Interviewquellen und Problem Statements sowie RACI einschließlich Ist-/Soll-Reifegrad. Keine Interviewtranskripte. Navigierbare Verbindungen zwischen Prozessschritt, Problemen/Findings, Verantwortungs-/Reifegrad-Gaps und Empfehlungen gewünscht.
- Nutzer möchte nachvollziehen, ob Empfehlungen einen Ziel-Reifegrad unterstützen (z. B. 2 auf 4). Vorgeschlagene Interpretation, noch zu bestätigen: Zielerreichung anhand definierter Nachweise prüfen; Empfehlungen alleine beweisen keine Reifegradsteigerung.
- Bewertungen können im Gespräch mitgeschrieben werden. Zusätzlich wünscht der Nutzer eine direkte Backlog-Priorisierung im HTML-Bericht durch Verschieben der Empfehlungen. Rückspeicherung wurde noch nicht festgelegt. Vorschlag: Prioritätsänderungen explizit als Datei exportieren und in die Berater-App zurückimportieren, ohne den HTML-Bericht automatisch als neue freigegebene Fassung zu behandeln.

## Visuelle Entwürfe und Nutzerfeedback

- Erste Konzepttafeln für Berater-App und HTML-Bericht wurden positiv bewertet. Es handelt sich um generierte Mockups mit fiktiven Daten, nicht um Screenshots einer Implementierung.
- Nutzerwunsch: reduziertere Gestaltung, an Apples Einfachheit orientiert, mit mehr Weißraum und dem bereitgestellten Blau als Grundfarbe. Exakter Farbwert noch nicht festgelegt.
- Manuelle Eingriffe sind besonders wichtig: Findings, Zuordnungen, Bewertungen und Empfehlungen müssen durch die beratende Person bearbeitbar sein. Details des Umgangs mit erneuten KI-Vorschlägen noch zu spezifizieren.
- Radar als gewünschte ergänzende Darstellungsform. Überarbeiteter Entwurf zeigt manuell bewertete Ist-/Zielwerte der fünf STAR-Dimensionen. Dies ist ein Darstellungsvorschlag; die dafür erforderlichen Bewertungskriterien und die Übertragbarkeit der bisherigen Prozessreifeskala auf alle STAR-Dimensionen sind noch nicht bestätigt. Keine automatische Ableitung aus der Anzahl von Aussagen.
- Zweiter visueller Entwurf: `/workspace/generated_images/exec-393b771a-b9d9-419b-b2e2-f27f3b7d6e10.png`. Vier Ansichten: STAR-Überblick, manuelle Finding-Bearbeitung, HTML-Überblick und HTML-Priorisierung. Das Bild ist keine Funktions- oder Testevidenz.
- Nutzer bestätigt anschließend die futuristischere Radar-Variante als passende Designrichtung. Referenz: `/workspace/generated_images/exec-7356f3f2-1a32-4d6a-8ee8-ffc1c3f3d85a.png`. Dies bestätigt die Optik, nicht die zugrunde liegende Radar-Bewertungsmethodik.

## Erste offene Entscheidungen

Nutzerreview zu B1: Personendaten sollen bei Bedarf innerhalb der App pseudonymisiert werden. Damit ersetzt die neue Anforderung die bisherige vorgeschlagene Beschränkung auf bereits bereinigte Inputs. REQ-01 Revision 2 enthält Vorschau, manuelle Korrektur, konsistente Kennungen und Freigabe vor Analyse. Erkennungsumfang und Umgang mit Zuordnungstabellen sind noch offen.

1. Daten-/Code-Trennung und Schutz der lokalen App; zulässiger lokaler Start-/Installationsweg.
2. Speicherung/Rückübernahme der Priorisierung im HTML-Bericht und Freigabe neuer Berichtsversionen.
3. Bewertungsmaßstäbe und messbare Nachweise für angestrebte Reifegrade.

Weiterhin offen: Login der lokalen Berater-App; Gateway-Schnittstelle und Authentifizierung (Klärung durch Nutzer); konkreter HTML-Öffnungsweg; Bewertungsmaßstäbe und Freigabeablauf. Pseudonymisierung vor Import durch Nutzer ist möglich, verbindlicher Importumfang noch festzulegen.

## Weitere Interviewthemen

- Konkrete anonymisierte Struktur der Interviews, Problem-Statement-Tabelle und RACI; Herkunft und Nachverfolgbarkeit einzelner Aussagen.
- Bedeutung von Korrelation (z. B. thematische Übereinstimmung), Häufigkeit und Schwere; Umgang mit Widersprüchen, Minderheitenpositionen und Beleglage.
- Menschliche Prüfung und Freigabe vorgeschlagener Cluster, Findings und Empfehlungen.
- Bedeutung der Gewichtungsregler: Schwerpunktdarstellung, Priorisierung oder belastbare Kapazitätsplanung; Messgrundlage und Abhängigkeiten.
- Sichtbarkeit der Quellen für Kunden, Rollen, Projekttrennung, Export, Aufbewahrung und Löschung.
- Abgrenzung der ersten Version und fachliche Erfolgskriterien anhand eines konkreten Beratungsfalls.

Nächster Schritt: [Anforderungsentwurf](../requirements/README.md) mit 10 Business- und 5 Enabler-Features reviewen; offene Entscheidungen zu Scope, Daten, Bewertung und lokalem Betrieb klären. Noch keine Implementierung; Gateway-Integration bleibt bis zur technischen Klärung offen.

## Umsetzung nach Nutzerauftrag

Nutzer beauftragt den ersten lauffähigen PoC. Architektur und Verträge dokumentiert; manueller lokaler Kern einschließlich Pseudonymisierung und HTML-Priorisierung umgesetzt. Keine realen Kundendaten verwendet. Aktueller Stand: [Projektstatus](../project-state.md), [Prüfbericht](../qa/CHG-002.md). Nächster Schritt ist das Review der tatsächlichen Anwendung, nicht eine erneute allgemeine Scope-Bestätigung.
