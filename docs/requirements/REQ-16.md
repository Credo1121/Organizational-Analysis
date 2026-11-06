# REQ-16: Interaktive Frontend-Demo der Berater-App

Status: PoC-Slice zur Umsetzung beauftragt · 06.11.2026. Quelle: Nutzer bestätigt funktionierende Pages-Demo, fordert deutlich höherwertiges Look-and-Feel und ausschließlich das Frontend der Web-App zum direkten Start auf Pages. Keine Abnahme der neuen Oberfläche vorweggenommen.

Benefit: Der Nutzer kann die Berater-App als zusammenhängendes Produkt im Browser erleben, Ansichten wechseln und manuelle Änderungen mit synthetischen Daten ausprobieren, bevor Backend-/Gatewaybetrieb eingerichtet wird.

- AC-01: Pages öffnet eine eigenständige App mit Navigation zu Überblick, Quellen, Findings, Innen-/Außensicht, Prozessen, Zielbild, Empfehlungen und Berichtsvorschau statt des bisherigen langen HTML-Berichts.
- AC-02: Gestaltung folgt bestätigtem Blau, heller reduzierter Oberfläche und präzisem Radar; Desktop und Mobile sind lesbar und per Tastatur bedienbar.
- AC-03: Suche/Filter, Quellen-Drill-down, Bearbeitung von Findings/Empfehlungen und Priorisierung funktionieren im Browser. Änderungen gelten nur für das synthetische Demo-Projekt im aktuellen Browser-Tab; kein Login oder Serverspeichern wird vorgetäuscht.
- AC-04: Die Demo lädt keine privaten Projektdaten, macht keine API-/Gateway-Anfragen und bietet keinen Upload echter Kundendaten. Fiktiver Charakter und Sitzungsgrenzen sind sichtbar.
- AC-05: Root und /docs als Pages-Quelle funktionieren auch unter dem Repository-Basispfad. Der bisherige selbstenthaltende Beispielbericht bleibt als report.html erreichbar; er ist ausdrücklich ein festes Beispiel, kein Export neuer Änderungen.
- AC-06: Echte Browserprüfungen und geöffnete Desktop-/Mobile-Screenshots belegen die neue Oberfläche; Commit/Push ist vom Nutzer angefordert.

Nicht-Scope: Öffentlicher Backendbetrieb, Login-Sicherheit, produktive Kundendaten, echte KI, berechnete Kapazitätswirkung, serverseitige Synchronisierung. Zielbildregler sind eine gekennzeichnete UI-Simulation, kein neuer Backend-Vertrag.

Technische Umsetzung und lokale Prüfungen abgeschlossen: [CHG-005 QA](../qa/CHG-005.md). Fachliches Nutzerreview steht aus.
