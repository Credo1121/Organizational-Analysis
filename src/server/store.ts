import { DatabaseSync } from 'node:sqlite';
import { mkdirSync, chmodSync, existsSync } from 'node:fs';
import { homedir } from 'node:os';
import { resolve, join, sep } from 'node:path';
import { randomBytes } from 'node:crypto';
import { emptyProject, validateProject, type Project } from '../domain/schema';

let db: DatabaseSync;
export function dataDirectory() {
  const dir = resolve(
    /* turbopackIgnore: true */ process.env.ORGLENS_DATA_DIR ??
      join(homedir(), '.local', 'share', 'orglens'),
  );
  const checkout = resolve(/* turbopackIgnore: true */ process.cwd());
  if (dir === checkout || dir.startsWith(checkout + sep))
    throw new Error('Das Datenverzeichnis muss außerhalb des Repositorys liegen.');
  return dir;
}
export function database() {
  if (db) return db;
  const dir = dataDirectory();
  mkdirSync(dir, { recursive: true, mode: 0o700 });
  chmodSync(dir, 0o700);
  const path = join(dir, 'orglens.sqlite');
  db = new DatabaseSync(path);
  if (existsSync(path)) chmodSync(path, 0o600);
  const schemaVersion = (db.prepare('PRAGMA user_version').get() as { user_version: number })
    .user_version;
  if (schemaVersion > 1) {
    db.close();
    db = undefined as unknown as DatabaseSync;
    throw new Error('Diese Datenbank benötigt eine neuere OrgLens-Version.');
  }
  db.exec(`PRAGMA journal_mode = DELETE; PRAGMA foreign_keys = ON;
 CREATE TABLE IF NOT EXISTS metadata(key TEXT PRIMARY KEY, value TEXT NOT NULL);
 CREATE TABLE IF NOT EXISTS project(singleton INTEGER PRIMARY KEY CHECK(singleton=1), version INTEGER NOT NULL, body TEXT NOT NULL);
 CREATE TABLE IF NOT EXISTS sessions(token TEXT PRIMARY KEY, expires INTEGER NOT NULL);
 CREATE TABLE IF NOT EXISTS identities(fingerprint TEXT PRIMARY KEY, pseudonym TEXT NOT NULL UNIQUE);
 CREATE TABLE IF NOT EXISTS receipts(key TEXT PRIMARY KEY, version INTEGER NOT NULL);
 PRAGMA user_version = 1;`);
  if (!db.prepare('SELECT 1 FROM project').get()) {
    const p = emptyProject();
    db.prepare('INSERT INTO project VALUES(1,0,?)').run(JSON.stringify(p));
  }
  if (!meta('import-key')) setMeta('import-key', randomBytes(32).toString('hex'));
  return db;
}
export function meta(key: string): string | undefined {
  const d = db ?? database();
  return (
    d.prepare('SELECT value FROM metadata WHERE key=?').get(key) as { value: string } | undefined
  )?.value;
}
export function setMeta(key: string, value: string) {
  database()
    .prepare('INSERT INTO metadata VALUES(?,?) ON CONFLICT(key) DO UPDATE SET value=excluded.value')
    .run(key, value);
}
export function readProject(): Project {
  return validateProject(
    JSON.parse(
      (database().prepare('SELECT body FROM project WHERE singleton=1').get() as { body: string })
        .body,
    ),
  );
}
export class Conflict extends Error {}
export function saveProject(input: unknown, expected: number): Project {
  const p = validateProject(input),
    d = database();
  const current = readProject();
  if (p.id !== current.id) throw new Conflict('Projektkennung stimmt nicht überein.');
  const next = { ...p, version: expected + 1 };
  const result = d
    .prepare('UPDATE project SET version=?,body=? WHERE singleton=1 AND version=?')
    .run(next.version, JSON.stringify(next), expected);
  if (result.changes !== 1)
    throw new Conflict('Der Projektstand hat sich geändert. Bitte neu laden.');
  return next;
}
export function replaceProject(input: unknown, expected: number): Project {
  const p = validateProject(input),
    d = database();
  d.exec('BEGIN IMMEDIATE');
  try {
    const current = readProject();
    if (current.version !== expected) throw new Conflict('Projektstand hat sich geändert.');
    const next = { ...p, id: crypto.randomUUID(), version: current.version + 1 };
    d.prepare('UPDATE project SET version=?,body=? WHERE singleton=1').run(
      next.version,
      JSON.stringify(next),
    );
    d.exec('DELETE FROM identities; DELETE FROM receipts;');
    setMeta('import-key', randomBytes(32).toString('hex'));
    d.exec('COMMIT');
    return next;
  } catch (error) {
    d.exec('ROLLBACK');
    throw error;
  }
}
export function pseudonyms(fingerprints: string[]) {
  const d = database(),
    result: Record<string, string> = {};
  d.exec('BEGIN IMMEDIATE');
  try {
    let next = (d.prepare('SELECT COUNT(*) AS n FROM identities').get() as { n: number }).n + 1;
    for (const fp of fingerprints) {
      let row = d.prepare('SELECT pseudonym FROM identities WHERE fingerprint=?').get(fp) as
        { pseudonym: string } | undefined;
      if (!row) {
        let candidate: string;
        const sources = new Set(readProject().statements.map((s) => s.interview));
        do {
          candidate = `INT-${String(next++).padStart(2, '0')}`;
        } while (
          sources.has(candidate) ||
          d.prepare('SELECT 1 FROM identities WHERE pseudonym=?').get(candidate)
        );
        d.prepare('INSERT INTO identities VALUES(?,?)').run(fp, candidate);
        row = { pseudonym: candidate };
      }
      result[fp] = row.pseudonym;
    }
    d.exec('COMMIT');
    return result;
  } catch (e) {
    d.exec('ROLLBACK');
    throw e;
  }
}
