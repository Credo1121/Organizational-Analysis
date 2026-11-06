import { createHash } from 'node:crypto';
import { type Project } from './schema';
import { radarMarkup, radarCss } from './radar';
export const escapeHtml = (s: string) =>
  s.replace(
    /[&<>"']/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!,
  );
export function renderReport(project: Project) {
  const p = project,
    findings = p.findings.filter((f) => f.released),
    fIds = new Set(findings.map((f) => f.id));
  const recs = p.recommendations.filter((r) => r.released);
  if (recs.some((r) => r.dependencies.some((id) => !recs.some((x) => x.id === id))))
    throw new Error('Freigegebene Empfehlungen haben nicht freigegebene Abhängigkeiten.');
  const h = escapeHtml;
  const data = JSON.stringify({
    projectId: p.id,
    version: p.version,
    order: recs.map((r) => r.id),
  }).replace(/</g, '\\u003c');
  const script = `const data=${data};let dragged=null;const list=document.getElementById('backlog');function changed(){document.getElementById('dirty').textContent='Reihenfolge geändert · noch nicht als Datei gespeichert';}list.addEventListener('click',e=>{const b=e.target.closest('button[data-direction]');if(!b)return;const row=b.closest('[data-id]');if(b.dataset.direction==='up'&&row.previousElementSibling)list.insertBefore(row,row.previousElementSibling);if(b.dataset.direction==='down'&&row.nextElementSibling)list.insertBefore(row.nextElementSibling,row);changed();});list.addEventListener('dragstart',e=>{dragged=e.target.closest('[data-id]');if(dragged)e.dataTransfer.setData('text/plain',dragged.dataset.id);});list.addEventListener('dragover',e=>e.preventDefault());list.addEventListener('drop',e=>{e.preventDefault();const row=e.target.closest('[data-id]');if(row&&dragged&&row!==dragged){const before=e.clientY<row.getBoundingClientRect().top+row.getBoundingClientRect().height/2;list.insertBefore(dragged,before?row:row.nextElementSibling);changed();}});document.getElementById('save').addEventListener('click',()=>{const result={...data,order:[...list.children].map(x=>x.dataset.id),confirmed:true};const url=URL.createObjectURL(new Blob([JSON.stringify(result,null,2)],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download='orglens-priorisierung.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);document.getElementById('dirty').textContent='Priorisierungsdatei heruntergeladen · HTML-Datei unverändert';});document.querySelectorAll('a[data-star]').forEach(a=>a.addEventListener('click',()=>{document.querySelectorAll('[data-stars]').forEach(el=>el.hidden=!el.dataset.stars.split('|').includes(a.dataset.star));}));document.getElementById('all').addEventListener('click',()=>document.querySelectorAll('[data-stars]').forEach(el=>el.hidden=false));document.addEventListener('click',e=>{const link=e.target.closest('a[href^=\"#\"]');if(!link)return;const target=document.getElementById(link.getAttribute('href').slice(1));if(!target)return;target.hidden=false;let parent=target.parentElement;while(parent){if(parent.tagName==='DETAILS')parent.open=true;parent=parent.parentElement;}target.scrollIntoView();});`;
  const hash = createHash('sha256').update(script).digest('base64');
  return `<!doctype html><html lang="de"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'sha256-${hash}'; style-src 'unsafe-inline'; img-src data:; connect-src 'none'; base-uri 'none'; form-action 'none'"><title>${h(p.name)} · Ergebnisbericht</title><style>
 *{box-sizing:border-box}body{margin:0;background:#f8fafc;color:#172033;font:15px/1.6 -apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif}header,main{max-width:1120px;margin:auto;padding:28px}header{border-bottom:1px solid #e1e7ef}nav{display:flex;gap:24px;flex-wrap:wrap;margin-top:20px}a{color:#1c4b91}h1{font-size:clamp(30px,5vw,46px);letter-spacing:-1.8px;line-height:1.14}h2{font-size:26px;letter-spacing:-.7px}h3{margin:0 0 10px}section{scroll-margin-top:20px;margin:40px 0}article,details,.panel{background:white;border:1px solid #e2e8f0;border-radius:18px;padding:24px;margin:14px 0}.split{display:grid;grid-template-columns:1.1fr 1fr;gap:24px}.muted{color:#64748b}.badge{display:inline-block;background:#eef3fb;color:#1c4b91;padding:3px 9px;border-radius:7px;font-size:12px}button{font:inherit;border:1px solid #cbd5e1;border-radius:9px;background:white;padding:9px 14px;cursor:pointer;color:#1c4b91}button:focus-visible,a:focus-visible,summary:focus-visible{outline:3px solid #1c4b91;outline-offset:3px}#save{background:#1c4b91;color:white}table{width:100%;border-collapse:collapse}th,td{text-align:left;padding:12px;border-bottom:1px solid #e2e8f0}.table-wrap{overflow:auto}li{margin:10px 0}.backlog-row{display:flex;align-items:center;gap:16px}.backlog-row .body{flex:1}.grip{color:#94a3b8;font-size:22px}.actions{display:flex;gap:5px}summary{cursor:pointer;font-weight:600}.source{scroll-margin:20px}.notice{padding:14px 18px;background:#fff7e8;border-radius:10px;color:#805b23}.radar{max-width:480px;margin:auto}.radar-legend{display:flex;justify-content:center;gap:30px}footer{margin-top:48px;padding:24px 0;color:#64748b;border-top:1px solid #e2e8f0}${radarCss}@media(max-width:700px){.split{grid-template-columns:1fr}main,header{padding:20px}.backlog-row{align-items:flex-start;flex-wrap:wrap}article,details,.panel{padding:18px}nav{gap:14px}}
 </style></head><body><header><strong>OrgLens</strong> <span class="muted">/ Interaktiver Ergebnisbericht</span><nav><a href="#overview">Überblick</a><a href="#findings">Findings</a><a href="#raci">Prozesse & RACI</a><a href="#actions">Maßnahmen</a><a href="#sources">Quellen</a></nav></header><main><section id="overview"><span class="badge">Diskussionsstand${p.synthetic ? ' · Fiktive Beispieldaten' : ''}</span><h1>${h(p.name)}</h1><p class="muted">Ein gemeinsames Verständnis. Klare nächste Schritte.</p><p class="notice">Beraterfreigabe zur Diskussion, keine automatische Kundenvalidierung. Fehlende Perspektiven und Bewertungen bleiben offen.</p><div class="split"><div class="panel"><h2>STAR · Ist und Ziel</h2><div class="radar">${radarMarkup(p.starRatings)}</div><div class="radar-legend"><span>━ Ist</span><span>┄ Ziel</span></div><p class="muted">Manuelle Bewertung · keine automatische Reifeberechnung</p>${p.starRatings.map((r) => `<details><summary><a href="#findings" data-star="${h(r.dimension)}">${h(r.dimension)}</a> · ${r.current ?? 'Offen'} → ${r.target ?? 'Offen'}</summary><p>${h(r.rationale || 'Bewertungsmaßstab noch offen.')}</p></details>`).join('')}</div><div><h2>Zentrale Handlungsfelder</h2>${
   findings
     .slice(0, 3)
     .map(
       (f) =>
         `<article><span class="badge">${h(f.level)}</span><h3><a href="#${h(f.id)}">${h(f.title)}</a></h3><p>${h(f.observation)}</p></article>`,
     )
     .join('') || '<p>Noch keine Findings freigegeben.</p>'
 }</div></div></section>
 <section id="findings"><h2>Findings und Perspektiven</h2><button id="all">Alle Dimensionen anzeigen</button>${findings
   .map((f) => {
     const ss = p.statements.filter((s) => f.statementIds.includes(s.id));
     return `<article id="${h(f.id)}" data-stars="${h(f.stars.join('|'))}"><span class="badge">${h(f.id)} · ${h(f.stars.join(' / '))} · ${h(f.level)}</span><h3>${h(f.title)}</h3><p><strong>Beobachtung:</strong> ${h(f.observation)}</p><details><summary>Interpretation und Handlungshypothese</summary><p>${h(f.interpretation)}</p><p>${h(f.hypothesis)}</p></details><div class="split">${[
       'Innen',
       'Außen',
     ]
       .map(
         (side) =>
           `<div><strong>${side}</strong>${
             ss
               .filter((s) => s.perspective === side)
               .map((s) => `<p><a href="#source-${h(s.id)}">${h(s.id)}</a> · ${h(s.text)}</p>`)
               .join('') || '<p class="muted">Keine Belege aus dieser Perspektive.</p>'
           }</div>`,
       )
       .join(
         '',
       )}</div><p class="muted">${ss.length} Erwähnungen · ${new Set(ss.map((s) => s.interview)).size} Interviewquellen · Schwere: ${h(f.severity || 'Unbewertet')}</p>${f.assessmentRole ? `<p>Bewertung: ${h(f.assessmentRole)} · ${h(f.assessmentDate)} · ${h(f.assessmentNote)}</p>` : ''}</article>`;
   })
   .join('')}</section>
 <section id="raci"><h2>Prozesse, Verantwortung und Reife</h2><p class="muted">1 Personenabhängig · 2 Teilweise etabliert · 3 Prozess genutzt · 4 Etabliert und entscheidungswirksam</p>${
   p.processes
     .map(
       (s) =>
         `<details><summary>${h(s.process)} · ${h(s.step)} · ${s.current ?? 'Offen'} → ${s.target ?? 'Offen'}</summary><p>PM-Rolle: ${h(s.currentRole)} → ${h(s.targetRole)} · Quelle: ${h(s.source)}</p><p><strong>Nachweis für Zielreife:</strong> ${h(s.evidence || 'Noch zu vereinbaren')}</p><p>Findings: ${
           s.findingIds
             .filter((id) => fIds.has(id))
             .map((id) => `<a href="#${h(id)}">${h(id)}</a>`)
             .join(', ') || 'Noch keine freigegebenen Verknüpfungen'
         }</p></details>`,
     )
     .join('') || '<p>Keine Prozessdaten vorhanden.</p>'
 }</section>
 <section id="actions"><h2>Was gehen wir zuerst an?</h2><p class="muted">Empfehlungen verschieben und die neue Reihenfolge als Datei speichern.</p><div id="backlog">${recs.map((r) => `<article draggable="true" data-id="${h(r.id)}" class="backlog-row"><span class="grip" aria-hidden="true">⠿</span><div class="body"><span class="badge">${h(r.level)}</span><h3>${h(r.title)}</h3><details><summary>Ergebnis und Belege</summary><p>${h(r.description)}</p><p><strong>Erwartetes Ergebnis:</strong> ${h(r.outcome)}</p><p>Aufwand: ${h(r.effort || 'Offen')}</p><p>Findings: ${r.findingIds.map((id) => `<a href="#${h(id)}">${h(id)}</a>`).join(', ')}</p><p>Abhängigkeiten: ${h(r.dependencies.join(', ') || 'Keine hinterlegt')}</p></details></div><div class="actions"><button data-direction="up" aria-label="${h(r.title)} nach oben">↑</button><button data-direction="down" aria-label="${h(r.title)} nach unten">↓</button></div></article>`).join('')}</div><p id="dirty" role="status">Reihenfolge entspricht dem exportierten Stand.</p><button id="save">Priorisierung als Datei speichern</button><p class="muted">Zur kontrollierten Rückübernahme in die Berater-App. Keine automatische Speicherung in dieser HTML-Datei.</p></section>
 <section id="sources"><h2>Quellenverzeichnis</h2><details><summary>Interviewquellen (${new Set(p.statements.map((s) => s.interview)).size})</summary>${[...new Set(p.statements.map((s) => s.interview))].map((i) => `<p>${h(i)} · ${h([...new Set(p.statements.filter((s) => s.interview === i).map((s) => s.department))].join(', '))}</p>`).join('')}</details><details><summary>Problem Statements (${p.statements.length})</summary>${p.statements.map((s) => `<article id="source-${h(s.id)}" class="source"><strong>${h(s.id)}</strong> · ${h(s.interview)} · ${h(s.perspective)} · ${h(s.department)}<p>${h(s.text)}</p><small>${h(s.topic || 'Themenfeld offen')}</small></article>`).join('')}</details><a href="#raci">Zur vollständigen RACI-/Prozessübersicht</a></section><footer>Projekt ${h(p.id)} · Version ${p.version} · Export ${new Date().toISOString()}<br>Keine Transkripte. Dateizugriff bedeutet Zugriff auf die enthaltenen Informationen.</footer></main><script>${script}</script></body></html>`;
}
