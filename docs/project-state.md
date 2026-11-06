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
- Nutzer hat den GitHub-Push beauftragt und möchte die Sichtbarkeit selbst auf Public ändern. Übergabe wird gemäß [REL-001](releases/REL-001.md) ausgeführt; Commit-/Remote-Nachweis folgt im Übergabeprotokoll.
- [Statische Pages-Demo](index.html) ist ausschließlich ein fiktiver Ergebnisbericht. Vollständige App mit Login/SQLite kann nicht auf GitHub Pages betrieben werden; alternativer Hostingweg bleibt zu klären. Pages-Aktivierung und Live-Smoke-Test noch nicht belegt.
