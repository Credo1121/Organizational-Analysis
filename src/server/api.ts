import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { z, ZodError } from 'zod';
import { createHash } from 'node:crypto';
import { authenticated, checkPassword, createSession, endSession, cookieName } from './auth';
import {
  readProject,
  saveProject,
  replaceProject,
  meta,
  pseudonyms,
  database,
  Conflict,
} from './store';
import { validateProject, statementSchema, processSchema } from '../domain/schema';
import { demoProject } from '../domain/demo';
import { renderReport } from '../domain/report';

const attempts: number[] = [];
async function body(request: Request) {
  if (Number(request.headers.get('content-length') ?? 0) > 2 * 1024 * 1024)
    throw new Error('Maximal 2 MiB pro Anfrage.');
  const reader = request.body?.getReader();
  let size = 0;
  const chunks: Uint8Array[] = [];
  if (reader)
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.length;
      if (size > 2 * 1024 * 1024) {
        await reader.cancel();
        throw new Error('Maximal 2 MiB pro Anfrage.');
      }
      chunks.push(value);
    }
  return JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}');
}
export async function handle(request: Request, path: string, method: string) {
  try {
    const host = request.headers.get('host') ?? '';
    if (!/^(127\.0\.0\.1|localhost)(:\d+)?$/.test(host))
      return NextResponse.json({ error: 'Nur lokaler Zugriff erlaubt.' }, { status: 403 });
    if (!['GET', 'HEAD'].includes(method)) {
      const origin = request.headers.get('origin');
      if (!origin || origin !== `http://${host}`)
        return NextResponse.json({ error: 'Ungültiger Anfrageursprung.' }, { status: 403 });
    }
    if (path === 'health' && method === 'GET') return NextResponse.json({ status: 'ok' });
    if (path === 'session') {
      if (method === 'GET')
        return NextResponse.json({
          authenticated: await authenticated(),
          configured: !!meta('password'),
        });
      if (method === 'POST') {
        if (!meta('password'))
          return NextResponse.json(
            { error: 'Bitte zuerst npm run setup:local ausführen.' },
            { status: 503 },
          );
        const now = Date.now();
        while (attempts.length && attempts[0] < now - 60000) attempts.shift();
        if (attempts.length >= 8)
          return NextResponse.json(
            { error: 'Zu viele Versuche. Bitte eine Minute warten.' },
            { status: 429 },
          );
        attempts.push(now);
        const { password } = z
          .object({ password: z.string().max(1000) })
          .strict()
          .parse(await body(request));
        if (!checkPassword(password))
          return NextResponse.json({ error: 'Anmeldung fehlgeschlagen.' }, { status: 401 });
        (await cookies()).set(cookieName, createSession(), {
          httpOnly: true,
          sameSite: 'strict',
          path: '/',
          maxAge: 8 * 60 * 60,
        });
        return NextResponse.json({ ok: true });
      }
      if (method === 'DELETE') {
        await endSession();
        (await cookies()).delete(cookieName);
        return NextResponse.json({ ok: true });
      }
    }
    if (!(await authenticated()))
      return NextResponse.json(
        { error: 'Bitte anmelden. Die Sitzung ist möglicherweise abgelaufen.' },
        { status: 401 },
      );
    if (path === 'project' && method === 'GET') return NextResponse.json(readProject());
    if (path === 'project' && method === 'PUT') {
      const input = validateProject(await body(request));
      return NextResponse.json(saveProject(input, input.version));
    }
    if (path === 'demo' && method === 'POST') {
      const p = readProject();
      if (p.statements.length || p.findings.length || p.processes.length)
        throw new Conflict(
          'Demo nur in einem leeren Projekt laden. Bestehende Daten bleiben erhalten.',
        );
      return NextResponse.json(replaceProject(demoProject(), p.version));
    }
    if (path === 'gateway' && method === 'GET')
      return NextResponse.json({
        available: false,
        reason: 'Internes LM-Gateway noch nicht angebunden. Manuelle Analyse ist verfügbar.',
      });
    if (path === 'import-key' && method === 'GET')
      return NextResponse.json({ key: meta('import-key') });
    if (path === 'pseudonyms' && method === 'POST') {
      const { fingerprints } = z
        .object({ fingerprints: z.array(z.string().regex(/^[a-f0-9]{64}$/)).max(1000) })
        .strict()
        .parse(await body(request));
      return NextResponse.json(pseudonyms(fingerprints));
    }
    if (path === 'import' && method === 'POST') {
      const data = z
        .object({
          version: z.number().int(),
          confirmed: z.literal(true),
          statements: z.array(statementSchema).max(2000),
          processes: z.array(processSchema).max(2000),
        })
        .strict()
        .parse(await body(request));
      const p = readProject();
      if (data.version !== p.version)
        throw new Conflict('Projektstand hat sich geändert. Import bitte erneut prüfen.');
      if (!data.statements.length && !data.processes.length)
        throw new Error('Keine Daten zum Import vorhanden.');
      if (
        data.statements.some((s) => p.statements.some((x) => x.id === s.id)) ||
        data.processes.some((s) => p.processes.some((x) => x.id === s.id))
      )
        throw new Conflict('Kennung bereits vorhanden. Keine Daten wurden überschrieben.');
      return NextResponse.json(
        saveProject(
          {
            ...p,
            statements: [...p.statements, ...data.statements],
            processes: [...p.processes, ...data.processes],
          },
          p.version,
        ),
      );
    }
    if (path === 'report' && method === 'POST') {
      const data = z
        .object({ version: z.number().int(), sourceRelease: z.literal(true) })
        .strict()
        .parse(await body(request));
      const p = readProject();
      if (data.version !== p.version)
        throw new Conflict('Projektstand hat sich geändert. Berichtsvorschau erneut prüfen.');
      return new Response(renderReport(p), {
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'Content-Disposition': 'attachment; filename="orglens-ergebnisbericht.html"',
          'Cache-Control': 'no-store',
        },
      });
    }
    if (path === 'priorities' && method === 'POST') {
      const data = z
        .object({
          projectId: z.string(),
          version: z.number().int(),
          order: z.array(z.string()).max(500),
          confirmed: z.literal(true),
        })
        .strict()
        .parse(await body(request));
      const p = readProject();
      const key = createHash('sha256').update(JSON.stringify(data)).digest('hex');
      const receipt = database().prepare('SELECT version FROM receipts WHERE key=?').get(key) as
        { version: number } | undefined;
      if (data.projectId !== p.id) throw new Conflict('Die Datei gehört zu einem anderen Projekt.');
      if (receipt?.version === p.version) return NextResponse.json(p);
      if (data.version !== p.version)
        throw new Conflict('Die Priorisierung gehört zu einem veralteten Projektstand.');
      const released = p.recommendations.filter((r) => r.released);
      if (
        new Set(data.order).size !== data.order.length ||
        data.order.length !== released.length ||
        data.order.some((id) => !released.some((r) => r.id === id))
      )
        throw new Conflict('Die Empfehlungskennungen sind unvollständig, doppelt oder unbekannt.');
      const d = database();
      d.exec('BEGIN IMMEDIATE');
      try {
        const next = saveProject(
          {
            ...p,
            recommendations: [
              ...data.order.map((id) => p.recommendations.find((r) => r.id === id)!),
              ...p.recommendations.filter((r) => !r.released),
            ],
          },
          p.version,
        );
        d.prepare('INSERT OR REPLACE INTO receipts VALUES(?,?)').run(key, next.version);
        d.exec('COMMIT');
        return NextResponse.json(next);
      } catch (error) {
        d.exec('ROLLBACK');
        throw error;
      }
    }
    if (path === 'backup' && method === 'GET')
      return new Response(JSON.stringify(readProject(), null, 2), {
        headers: {
          'Content-Type': 'application/json',
          'Content-Disposition': 'attachment; filename="orglens-projektbackup.json"',
        },
      });
    if (path === 'restore' && method === 'POST') {
      const data = z
        .object({ version: z.number().int(), confirmed: z.literal(true), project: z.unknown() })
        .strict()
        .parse(await body(request));
      return NextResponse.json(replaceProject(data.project, data.version));
    }
    return NextResponse.json({ error: 'Endpunkt nicht gefunden.' }, { status: 404 });
  } catch (error) {
    if (error instanceof Conflict)
      return NextResponse.json({ error: error.message }, { status: 409 });
    if (error instanceof ZodError)
      return NextResponse.json(
        {
          error: error.issues
            .slice(0, 3)
            .map((i) => `${i.path.join('.')}: ${i.message}`)
            .join(' · '),
        },
        { status: 400 },
      );
    if (error instanceof SyntaxError)
      return NextResponse.json({ error: 'Ungültiges JSON.' }, { status: 400 });
    const message = error instanceof Error ? error.message : 'Unbekannter Fehler';
    if (/SQLITE|database|ENOENT|EACCES|constraint/i.test(message))
      return NextResponse.json(
        {
          error:
            'Lokaler Speichervorgang fehlgeschlagen. Bestehenden Stand neu laden und Datenverzeichnis prüfen.',
        },
        { status: 500 },
      );
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
