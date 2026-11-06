# Lokaler API-Vertrag v1

Zentrale Typ-/Validierungsquelle: `src/domain/schema.ts`. Ein lokaler Bearbeiter, ein aktives Projekt. Alle Projektoperationen erfordern Sitzung. Fehler `{error: string}` ohne Stacktrace; HTTP 400 Validierung, 401 Sitzung, 403 Origin, 409 Version/Referenzkonflikt, 413 Payload, 503 nicht eingerichtet.

`GET /api/session`: `{authenticated, configured}`. `POST /api/session` `{password}` startet Sitzung; Rate-Limit. `DELETE /api/session` beendet Sitzung. Cookie HttpOnly, SameSite=Strict; nur lokales HTTP. `GET /api/health`: `{status:'ok'}` ohne Projektdaten.

`GET /api/project`: Projektsnapshot. `PUT /api/project`: vollständiger validierter Snapshot mit erwarteter `version`; neue Version im Resultat. Unbekannte Referenzen/Zyklen/ungültige Ratings abweisen. `POST /api/demo`: ausdrücklich synthetisches Projekt, nur wenn aktuelles Projekt leer ist; keine Benutzerdaten ersetzen.

`POST /api/import`: `{version, confirmed:true, statements, processes}`; ausschließlich bereinigte Inhalte. `POST /api/pseudonyms`: `{fingerprints:string[]}` vergibt vorab projektstabile Kennungen, keine Klartextnamen. Fingerprints werden im Browser mit einem über authentifiziertes `GET /api/import-key` erhaltenen projektspezifischen HMAC-Schlüssel erstellt. Unbestätigte/doppelte IDs und falsche Versionen werden ohne Projektänderung abgewiesen. Import maximal 2 MiB und 2000 Statements/Prozesszeilen, CSV-Datei im Browser ebenfalls begrenzt. Pro Statementzeile eine Interviewkennung; mehrere Interviewbelege werden über mehrere Statements am Finding verknüpft.

`POST /api/report`: `{version, sourceRelease:true}` erzeugt HTML-Anhang mit aktuellem Projekt-/Versionsbezug und ausschließlich explizit freigegebenen Objekten, bestätigter Quellenbasis und RACI. `POST /api/priorities`: `{projectId, version, order:string[], confirmed:true}` prüft vollständige eindeutige Empfehlungsmenge und Version. Wiedereinspielen der zuletzt identisch übernommenen Datei ist idempotent. Lokale App ändert Reihenfolge ebenfalls über versioniertes Speichern.

`GET /api/backup` liefert validierten Snapshot ohne Auth-/Pseudonym-Schlüssel; `POST /api/restore` `{version, confirmed:true, project}` ersetzt nach Nutzerbestätigung atomar, erzeugt eine neue Projektkennung und Versionsbasis und setzt die projektbezogene Identitätszuordnung zurück. `GET /api/gateway`: `{available:false, reason}`; keine Inhalte senden, keine Gateway-Konfiguration erfinden.

Freigabe-Zustand bedeutet Beraterfreigabe zur Diskussion, nicht Kundenvalidierung. Null/leer heißt unbewertet. Anzeigen von 1–4 bei STAR erfordert Bewertungsbegründung; Prozessreife bleibt separate Skala. Fehlende Quellen verhindern belegte Finding-Freigabe. Export von Empfehlungen nur mit freigegebenen Finding-Bezügen und vollständig enthaltenen Abhängigkeiten.
