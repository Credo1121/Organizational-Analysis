# Projektstand

06.11.2026 · erster lokaler PoC implementiert und technisch geprüft.

- Nutzer hat den Featureumfang mit Pseudonymisierungs-Ergänzung von B1 bestätigt und den PoC beauftragt. Keine fachliche Abnahme der laufenden App oder produktive Freigabe.
- Next.js 16.4.5 / React 19.3.1 / TypeScript / Zod; SQLite über Node 24. Modularer Monolith mit getrennten Frontend-, Domain- und Servermodulen. [Architektur](architecture.md), [ADR](adr/ADR-001.md), [API](contracts/local-api.md).
- Kern: Login, CSV/Pseudonymisierung/Freigabe, Quellen, manuelle Findings/Cluster, Innen-/Außensicht, STAR, RACI/Reife, Empfehlungen, HTML-Export/Priorisierung und Backup/Restore.
- [CHG-002-Prüfbericht](qa/CHG-002.md): 6 Fach-/SQLite-Testgruppen und 1 Browser-Kernreise PASS, Typprüfung/Build/Format PASS, npm-Laufzeitaudit 0 Advisories. Echte Desktop-/Mobile-Screenshots erstellt und geöffnet geprüft.
- Offline-Ausführung des exportierten HTML-Inhalts PASS. Direkte file://-Navigation hier durch Browserrichtlinie blockiert; Zielrechner und Teams-Weg NOT RUN.
- Gateway, Zielbildregler und WBS/2027-Planung nicht umgesetzt; keine Kundendaten verarbeitet. STAR-Maßstab und Unternehmensfreigaben bleiben offen.
- Start: Node 24, npm ci, npm run setup:local, npm run dev. Kein Standardpasswort und kein dauerhaft laufender Testserver. Daten außerhalb des Repos.
- Nächster Schritt: fachliches Review des PoC mit Nutzer; danach kundenspezifische CSV-Vorlagen und internes Gateway klären. Siehe [Anforderungen](requirements/README.md) und [Traceability](traceability.md).
- Nutzer hat den GitHub-Push beauftragt und möchte die Sichtbarkeit selbst auf Public ändern. PoC und Pages-Artefakt erfolgreich nach main gepusht: Payload-Commit 2327ab0d6ceb81436adb74c97ecb93eecd9166b6, ohne Force-Push. [Ausführungsnachweis](releases/REL-001-execution.md).
- [Statische Pages-Demo](index.html) ist ausschließlich ein fiktiver Ergebnisbericht. Vollständige App mit Login/SQLite kann nicht auf GitHub Pages betrieben werden; alternativer Hostingweg bleibt zu klären. Pages-Aktivierung und Live-Smoke-Test noch nicht belegt.
- Nutzer meldet gerenderte README auf Pages. [BUG-001](bugs/BUG-001.md) / [CHG-004](changes/CHG-004.md): fehlenden Root-Einstieg reproduziert und behoben. Identische index.html/.nojekyll in / und /docs; beide Browser-Regressionen inklusive Radar, Quellen und Priorisierungsdownload PASS. Echte Desktop-/Mobile-Screenshots geöffnet geprüft. Keine Änderung der Pages-Einstellung nötig. Live-Smoke-Test wegen Proxy-403 weiterhin nicht möglich; regulärer Bugfix-Push beauftragt.

## Aktuell: hochwertigere Frontend-Demo

Nutzer bestätigt funktionierenden Pages-Aufruf, findet den HTML-Bericht zu rudimentär und beauftragt ein deutlich hochwertigeres eigenständiges Frontend mit Push. [REQ-16](requirements/REQ-16.md) / [ADR-002](adr/ADR-002.md): OrgLens Studio als statische React-App mit acht Arbeitsbereichen, manuell bearbeitbaren Findings/Empfehlungen/RACI/STAR-Werten, Quellen-Drill-down und UI-Zielbildsimulation. Öffentliche Demo ausschließlich mit fiktiven Daten, sessionStorage pro Browser-Tab, kein Login/Upload/KI oder Backendzugriff. Bestehende Next.js-/SQLite-App unverändert. Alter fester Bericht liegt jetzt unter report.html; index.html ist die Frontend-App.

Technisches UI-Review abgeschlossen: Typprüfung, Format, Produktionsbuild, sechs Fach-/SQLite-Testgruppen und beide Pages-Browserreisen erfolgreich. Desktop-/Mobile-Evidenz und Grenzen: [CHG-005 QA](qa/CHG-005.md). Regulärer Commit/Push ist beauftragt, Übergabe: [REL-002](releases/REL-002.md). Anschließend fachliches Nutzerreview über dieselbe Pages-Adresse; tatsächlicher Pages-Live-Smoke-Test bleibt durch die Netzwerksperre der Umgebung blockiert.
