/*
 * Prova de navegador da LP: o script do CashFlow, o cupom nos links e o IC.
 *
 * FORA do `npm test` e sem dependência no package.json, de propósito: precisa
 * de um Chrome e do `playwright-core` já instalados na máquina. Rode à mão
 * antes de publicar uma mudança em Closing.tsx, ScriptDoCashflow.tsx,
 * cupom.ts ou use-cupom-no-link.ts:
 *
 *   npm run build && npx next start -p 3917 &
 *   PLAYWRIGHT_CORE=/caminho/para/node_modules/playwright-core \
 *   CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
 *   node tests/e2e/prova-lp.cjs [http://localhost:3917] [--so=react-primeiro,pjs-primeiro,hostil,plano,dashboard,origem]
 *
 * Sem PLAYWRIGHT_CORE, tenta `require('playwright-core')`; sem CHROME, usa o
 * Chromium do próprio Playwright (se instalado).
 *
 * NENHUM evento real: o coletor (POST /t/t) e o facebook.* respondem com
 * dublê, o Supabase é abortado e qualquer outra escrita é interceptada. O
 * único acesso real é o GET do p.js (e, no cenário "origem", os GET do app
 * em /assinatura).
 *
 * O que ela segura e mais nada segura: as DUAS ordens entre o p.js e o React
 * (p.js atrasado 3 s; bundle do React atrasado 2 s). Com o cupom pelo estado
 * do React (`href={comCupom(p.href, cupom)}`), a ordem "p.js primeiro"
 * reprova: o link perde sck/utm/fbclid antes de qualquer gesto.
 */
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { chromium } = require(process.env.PLAYWRIGHT_CORE || 'playwright-core');

const BASE = process.argv.find((a) => a.startsWith('http')) || 'http://localhost:3917';
const SO = (process.argv.find((a) => a.startsWith('--so=')) || '').slice(5).split(',').filter(Boolean);
const W = 'b3e3617c-e6d1-4dca-924e-0f6248442b66';
const O = '2e9f0d87-c735-4c32-b610-9e057dd231da';
const PIXEL = '1963955624447587';
const PJS_URL = `https://cashflow.mentoriaprocesso.com/t/p.js?w=${W}&o=${O}`;
const PLANOS = ['gold', 'diamond', 'ruby', 'master'];
const CHROME = process.env.CHROME || undefined;

let falhas = 0;
let total = 0;
function ok(cond, msg, extra) {
  total++;
  if (cond) console.log('  ok   ', msg);
  else {
    falhas++;
    console.log('  FALHA', msg, extra !== undefined ? JSON.stringify(extra) : '');
  }
}
const espera = (ms) => new Promise((r) => setTimeout(r, ms));

let PJS_BODY = null;
async function pjs() {
  if (!PJS_BODY) {
    const r = await fetch(PJS_URL);
    PJS_BODY = await r.text();
    if (!PJS_BODY.includes(PIXEL)) throw new Error('p.js inesperado');
  }
  return PJS_BODY;
}

/* Registro de tudo o que sairia da máquina. */
function novoRegistro() {
  return { pjs: 0, fbevents: 0, facebook: [], coletor: [], supabase: 0, escritas: [], outros: [], reais: [] };
}

async function contexto(browser, { atrasoPjs = 0, atrasoChunks = 0, assinaturaReal = false } = {}) {
  const ctx = await browser.newContext();
  const reg = novoRegistro();
  await ctx.addInitScript(() => {
    // linha do tempo do href de cada link de plano: quem escreveu primeiro?
    window.__hrefs = [];
    const anotar = (a) => {
      try {
        const u = new URL(a.href);
        window.__hrefs.push({ plano: u.searchParams.get('plano'), sck: u.searchParams.has('sck'), cupom: u.searchParams.has('cupom'), t: performance.now() });
      } catch {}
    };
    new MutationObserver((ms) => {
      for (const m of ms) {
        if (m.type === 'attributes' && m.target.matches && m.target.matches('a[data-cashflow]')) anotar(m.target);
      }
    }).observe(document, { attributes: true, attributeFilter: ['href'], subtree: true });
    window.__alertas = 0;
    window.alert = () => { window.__alertas++; };
  });
  await ctx.route('**/*', async (route) => {
    const req = route.request();
    const u = req.url();
    const m = req.method();
    const cors = { 'access-control-allow-origin': req.headers()['origin'] || '*', 'access-control-allow-credentials': 'true', 'access-control-allow-headers': '*', 'access-control-allow-methods': 'POST, GET, OPTIONS' };
    if (u.startsWith(BASE)) {
      if (atrasoChunks && u.includes('/_next/static/chunks/') && u.endsWith('.js')) await espera(atrasoChunks);
      return route.continue();
    }
    if (u.startsWith('https://cashflow.mentoriaprocesso.com/t/p.js')) {
      reg.pjs++;
      const body = await pjs();
      if (atrasoPjs) await espera(atrasoPjs);
      return route.fulfill({ status: 200, contentType: 'application/javascript', body });
    }
    if (u.includes('connect.facebook.net')) {
      reg.fbevents++;
      reg.facebook.push(u);
      return route.fulfill({ status: 200, contentType: 'application/javascript', body: '/* fbevents interceptado */' });
    }
    if (/facebook\.(com|net)/.test(u)) {
      reg.facebook.push(u);
      return route.fulfill({ status: 200, body: '' });
    }
    if (m === 'OPTIONS') return route.fulfill({ status: 204, headers: cors });
    if (u.startsWith('https://cashflow.mentoriaprocesso.com/t/') && m === 'POST') {
      let corpo = null;
      try { corpo = JSON.parse(req.postData() || 'null'); } catch { corpo = req.postData(); }
      reg.coletor.push({ url: u, corpo, de: req.frame() ? req.frame().url() : null });
      return route.fulfill({ status: 200, contentType: 'application/json', body: '{}', headers: cors });
    }
    if (u.includes('supabase.co')) {
      // a LP já lê stats-publicas (GET) e o /assinatura lê o banco: tudo abortado
      reg.supabase++;
      if (m !== 'GET') reg.escritas.push(`${m} ${u}`);
      return route.abort();
    }
    if (m !== 'GET') {
      reg.escritas.push(`${m} ${u}`);
      return route.fulfill({ status: 200, contentType: 'application/json', body: '{}', headers: cors });
    }
    if (u.startsWith('https://cashflow.mentoriaprocesso.com/')) {
      if (assinaturaReal) { reg.reais.push(`${m} ${u}`); return route.continue(); } // GET do app real (só leitura)
      return route.fulfill({ status: 200, contentType: 'text/html', body: '<!doctype html><title>checkout</title>ok' });
    }
    reg.outros.push(u);
    return route.abort();
  });
  return { ctx, reg };
}

const ics = (reg) => reg.coletor.filter((c) => c.corpo && Array.isArray(c.corpo.ev) && c.corpo.ev.some((e) => e.n === 'InitiateCheckout')).length;
const visitas = (reg) => reg.coletor.filter((c) => c.corpo && Array.isArray(c.corpo.ev) && c.corpo.ev.some((e) => e.n === 'PageView'));
const filaFbq = (page) => page.evaluate(() => ((window.fbq && window.fbq.queue) || []).map((a) => Array.from(a).slice(0, 2).join(':')));
const hrefs = (page) => page.evaluate(() => Array.from(document.querySelectorAll('a[data-cashflow]')).map((a) => a.getAttribute('href')));

async function pronto(page) {
  await page.waitForFunction(() => !!window.cashflow, null, { timeout: 20000 });
  await page.waitForTimeout(800);
}

function conferirLinks(lista, { cupom, decorado = true, rotulo }) {
  ok(lista.length === 4, `${rotulo}: 4 links de plano com data-cashflow`, lista.length);
  lista.forEach((h, i) => {
    const u = new URL(h);
    const nome = `${rotulo} [${PLANOS[i]}]`;
    ok(u.origin + u.pathname === 'https://cashflow.mentoriaprocesso.com/assinatura', `${nome} mesma origem e caminho`, h);
    ok(JSON.stringify(u.searchParams.getAll('plano')) === JSON.stringify([PLANOS[i]]), `${nome} plano original, um só`, h);
    if (cupom === null) ok(!u.searchParams.has('cupom'), `${nome} sem cupom`, h);
    else ok(u.searchParams.get('cupom') === cupom, `${nome} cupom=${cupom}`, h);
    if (decorado) {
      ok(/^[a-z0-9]{12}$/.test(u.searchParams.get('sck') || ''), `${nome} sck da visita`, h);
      ok(u.searchParams.get('utm_content') === 'AD1' && u.searchParams.get('fbclid') === 'FBCLID1', `${nome} utm_content e fbclid`, h);
    }
  });
}

const BUSCA = '?cupom=lucas-nwwm&utm_source=FB&utm_content=AD1&fbclid=FBCLID1';

/* (a)(b)(c)(e)(f)(g) numa ordem forçada */
async function cenarioOrdem(browser, { nome, atrasoPjs, atrasoChunks, quemPrimeiro, gestos = true }) {
  console.log(`\n== Ordem: ${nome}`);
  const { ctx, reg } = await contexto(browser, { atrasoPjs, atrasoChunks });
  const page = await ctx.newPage();
  const erros = [];
  page.on('pageerror', (e) => erros.push(e.message));
  await page.goto(BASE + '/' + BUSCA);
  await pronto(page);

  const linha = await page.evaluate(() => window.__hrefs);
  const primeira = linha.find((x) => x.plano === 'gold');
  ok(primeira && (quemPrimeiro === 'react' ? primeira.cupom && !primeira.sck : primeira.sck && !primeira.cupom),
    `a ordem forçada aconteceu (${quemPrimeiro} escreveu primeiro no href)`, primeira);

  // (c) sem gesto nenhum: o href já tem tudo
  conferirLinks(await hrefs(page), { cupom: 'LUCAS-NWWM', rotulo: 'sem gesto' });

  // (a) uma fonte de Pixel só
  const fila = await filaFbq(page);
  ok(fila.filter((x) => x.startsWith('init')).length === 1 && fila.includes('init:' + PIXEL), '(a) um único fbq init, o do p.js', fila);
  ok(fila.filter((x) => x === 'track:PageView').length === 1, '(a) um PageView no fbq', fila);
  ok(reg.fbevents === 1, '(a) fbevents.js pedido UMA vez (pelo p.js; nenhum connect.facebook.net nosso)', reg.facebook);
  ok(reg.pjs === 1, 'p.js carregado uma vez', reg.pjs);

  // (b) a visita é da oferta
  const vs = visitas(reg);
  ok(vs.length === 1 && vs[0].corpo.offer === O && vs[0].corpo.w === W, `(b) um POST de visita com offer=${O}`, vs.map((v) => v.corpo && { offer: v.corpo.offer, w: v.corpo.w }));
  ok(vs[0] && vs[0].corpo.ev.map((e) => e.n).join(',') === 'PageView,ViewContent', '(b) PageView+ViewContent no coletor', vs[0] && vs[0].corpo.ev);

  ok(!(await page.evaluate(() => document.body.innerText.toUpperCase().includes('LUCAS-NWWM'))), 'o cupom não aparece no texto da página');

  if (gestos) {
    // (f) clique = 1 IC, aba nova com cupom + decoração
    const [aba1] = await Promise.all([ctx.waitForEvent('page'), page.click('a[data-cashflow][href*="plano=gold"]')]);
    await page.waitForTimeout(700);
    conferirLinks([aba1.url(), ...((await hrefs(page)).slice(1))], { cupom: 'LUCAS-NWWM', rotulo: 'clique (aba nova gold + demais links)' });
    ok(ics(reg) === 1, '(f) 1 clique = 1 InitiateCheckout no coletor', ics(reg));
    ok((await filaFbq(page)).filter((x) => x === 'track:InitiateCheckout').length === 1, '(f) 1 InitiateCheckout no fbq');

    // botão do meio
    await page.waitForTimeout(1700);
    const [aba2] = await Promise.all([ctx.waitForEvent('page'), page.click('a[data-cashflow][href*="plano=diamond"]', { button: 'middle' })]);
    await page.waitForTimeout(500);
    const u2 = new URL(aba2.url());
    ok(u2.searchParams.get('plano') === 'diamond' && u2.searchParams.get('cupom') === 'LUCAS-NWWM' && u2.searchParams.has('sck') && u2.searchParams.get('utm_content') === 'AD1',
      'botão do meio: a aba leva plano, cupom, sck e utm', aba2.url());
    // o p.js conta IC só no 'click' (ouvinte do gatilho por URL); o auxclick
    // decora e manda CheckoutClick. Comportamento do p.js, igual ao do
    // MetaPixel antigo (onClick do React também não dispara no botão do meio).
    ok(ics(reg) === 1, 'botão do meio: decora mas não soma IC (regra do p.js)', ics(reg));

    // (g) clique duplo = 1 IC
    await page.waitForTimeout(1700);
    const antes = ics(reg);
    const abas = [];
    ctx.on('page', (p) => abas.push(p));
    await page.dblclick('a[data-cashflow][href*="plano=ruby"]');
    await page.waitForTimeout(1200);
    ok(ics(reg) - antes === 1, '(g) clique duplo = 1 IC (trava de 1,5 s)', ics(reg) - antes);
    ok(abas.every((p) => new URL(p.url()).searchParams.get('cupom') === 'LUCAS-NWWM'), '(g) as abas do clique duplo levam o cupom', abas.map((p) => p.url()));

    // (e) recarregar sem a query mantém o cupom (mesma aba)
    await page.goto(BASE + '/');
    await pronto(page);
    const depois = await hrefs(page);
    ok(depois.every((h) => new URL(h).searchParams.get('cupom') === 'LUCAS-NWWM'), '(e) recarga sem query: os 4 links mantêm o cupom', depois);
  }
  ok(erros.length === 0, 'sem erro de página', erros);
  ok(reg.escritas.length === 0 && reg.reais.length === 0, 'nada além do p.js foi à rede real; zero escrita (Supabase: GET abortado)', { escritas: reg.escritas, supabaseAbortados: reg.supabase });
  await ctx.close();
  return reg;
}

/* (d) cupom hostil */
async function cenarioHostil(browser) {
  console.log('\n== Cupom hostil');
  const { ctx, reg } = await contexto(browser);
  const page = await ctx.newPage();
  const erros = [];
  page.on('pageerror', (e) => erros.push(e.message));
  page.on('dialog', (d) => { erros.push('dialog ' + d.message()); d.dismiss(); });
  await page.goto(BASE + '/');
  await pronto(page);
  const casos = [
    ['%22%3E%3Cimg%20src%3Dx%20onerror%3Dalert(1)%3E', null],
    ['javascript:alert(1)', 'JAVASCRIPT:ALERT(1)'],
    ['X%26plano%3Dmaster', 'X&PLANO=MASTER'],
    ['A%0AB', null],
    ['%20%20', null],
    ['X'.repeat(65), null],
  ];
  for (const [bruto, esperado] of casos) {
    const p2 = await ctx.newPage();
    p2.on('pageerror', (e) => erros.push(e.message));
    p2.on('dialog', (d) => { erros.push('dialog ' + d.message()); d.dismiss(); });
    await p2.goto(BASE + '/?cupom=' + bruto + '&utm_content=AD1&fbclid=FBCLID1');
    await pronto(p2);
    const lista = await hrefs(p2);
    conferirLinks(lista, { cupom: esperado, rotulo: `cupom=${bruto.slice(0, 24)}` });
    for (const h of lista) {
      const q = h.split('?')[1] || '';
      ok(!/[<>"' ]/.test(q) && q.split('&').filter((x) => x.toLowerCase().startsWith('plano=')).length === 1,
        `cupom=${bruto.slice(0, 24)}: só aparece codificado, um plano= só`, h);
    }
    const agora = await p2.evaluate(() => ({ injetados: document.querySelectorAll('img[src="x"], [onerror]').length, alertas: window.__alertas }));
    ok(agora.injetados === 0 && agora.alertas === 0, `cupom=${bruto.slice(0, 24)}: nenhum nó injetado nem alert`, agora);
    await p2.close();
  }
  ok(erros.length === 0, 'sem erro de página nem diálogo', erros);
  await ctx.close();
  return reg;
}

/* ?plano= rola até #planos */
async function cenarioPlano(browser) {
  console.log('\n== ?plano=');
  const { ctx } = await contexto(browser);
  const page = await ctx.newPage();
  await page.goto(BASE + '/?cupom=X1&plano=ruby');
  await pronto(page);
  const r = await page.evaluate(() => ({ top: document.getElementById('planos').getBoundingClientRect().top, y: window.scrollY }));
  ok(r.y > 1000 && Math.abs(r.top) < 200, '?plano=ruby: a página rola até #planos', r);
  conferirLinks(await hrefs(page), { cupom: 'X1', decorado: false, rotulo: '?plano=ruby' });
  const p2 = await ctx.newPage();
  await p2.goto(BASE + '/?cupom=X1&plano=xyz');
  await pronto(p2);
  const r2 = await p2.evaluate(() => window.scrollY);
  ok(r2 < 50, '?plano=xyz: não faz nada', r2);
  await ctx.close();
}

/* /dashboard sem script */
async function cenarioDashboard(browser) {
  console.log('\n== /dashboard');
  const { ctx, reg } = await contexto(browser);
  const page = await ctx.newPage();
  await page.goto(BASE + '/dashboard?cupom=X1&utm_content=AD1');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1500);
  ok(reg.pjs === 0 && reg.facebook.length === 0 && reg.coletor.length === 0, '/dashboard: zero p.js, zero facebook, zero coletor', reg);
  ok(!(await page.evaluate(() => 'fbq' in window || 'cashflow' in window)), '/dashboard: sem fbq nem window.cashflow');
  await ctx.close();
}

/* (f) a aba nova é o /assinatura REAL: a origem guardada leva utm_content e fbclid */
async function cenarioOrigemNoCheckout(browser) {
  console.log('\n== Origem no /assinatura real (Supabase abortado, coletor interceptado)');
  const { ctx, reg } = await contexto(browser, { assinaturaReal: true });
  const page = await ctx.newPage();
  await page.goto(BASE + '/' + BUSCA);
  await pronto(page);
  const [aba] = await Promise.all([ctx.waitForEvent('page'), page.click('a[data-cashflow][href*="plano=gold"]')]);
  await aba.waitForLoadState('load');
  await aba.waitForTimeout(4000);
  const origem = await aba.evaluate(() => {
    const out = {};
    for (let i = 0; i < sessionStorage.length; i++) { const k = sessionStorage.key(i); out[k] = sessionStorage.getItem(k); }
    return out;
  });
  const bruto = origem['cashflow_origem'];
  let o = null;
  try { o = JSON.parse(bruto); } catch {}
  ok(o && o.utm_content === 'AD1' && o.fbclid === 'FBCLID1', "sessionStorage['cashflow_origem'] da aba nova tem utm_content e fbclid", origem);
  ok(new URL(aba.url()).searchParams.get('cupom') === 'LUCAS-NWWM', 'a aba nova abriu com o cupom', aba.url());
  ok(reg.reais.every((x) => x.startsWith('GET ')), 'tudo o que foi à rede real é GET (o app do /assinatura); escritas interceptadas', { reais: reg.reais.length, interceptadas: reg.escritas });
  console.log('   (coletor interceptado:', reg.coletor.length, 'POSTs; Supabase abortado:', reg.supabase, ')');
  await ctx.close();
}

(async () => {
  const browser = await chromium.launch({ executablePath: CHROME, headless: true });
  const roda = (n) => !SO.length || SO.includes(n);
  try {
    if (roda('react-primeiro')) await cenarioOrdem(browser, { nome: 'p.js atrasado 3 s (React escreve o cupom primeiro)', atrasoPjs: 3000, quemPrimeiro: 'react' });
    if (roda('pjs-primeiro')) await cenarioOrdem(browser, { nome: 'p.js imediato, bundle do React atrasado 2 s (p.js decora primeiro)', atrasoChunks: 2000, quemPrimeiro: 'pjs' });
    if (roda('hostil')) await cenarioHostil(browser);
    if (roda('plano')) await cenarioPlano(browser);
    if (roda('dashboard')) await cenarioDashboard(browser);
    if (roda('origem')) await cenarioOrigemNoCheckout(browser);
  } finally {
    await browser.close();
  }
  console.log(`\n${total - falhas}/${total} afirmações ok, ${falhas} falha(s)`);
  process.exit(falhas ? 1 : 0);
})();
