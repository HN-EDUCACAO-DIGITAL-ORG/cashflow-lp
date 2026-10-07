/**
 * A fiação da atribuição, lida no HTML que o build entrega ao visitante.
 *
 * Por que importa: três detalhes da página decidem se uma venda vinda da LP
 * casa com o anúncio, e nenhum deles quebra o build nem a regra do cupom.
 * - O script do CashFlow da oferta precisa sair no `<head>` da `/`, com o
 *   `w`, o `o` e o `data-offer` certos (sem `data-offer` a visita não pertence
 *   a oferta nenhuma).
 * - Os 4 links de plano precisam de `data-cashflow`; sem ele o p.js não leva
 *   `sck`/`utm_*`/`fbclid` ao checkout, e a venda chega sem origem.
 * - Nenhum outro Pixel: com `fbq` próprio na página, a Meta recebe PageView e
 *   InitiateCheckout em dobro, metade sem `event_id`.
 * E o `/dashboard` (um mock) não pode contar visita da oferta.
 *
 * Roda com `npm run test:build` (build + este teste). Sem `.next`, falha alto.
 */
import { test, describe, before } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const APP = path.join(RAIZ, ".next", "server", "app");
const ESTATICOS = path.join(RAIZ, ".next", "static");
const WORKSPACE = "b3e3617c-e6d1-4dca-924e-0f6248442b66";
const OFERTA = "2e9f0d87-c735-4c32-b610-9e057dd231da";
const PLANOS = ["gold", "diamond", "ruby", "master"];

function lerHtml(nome) {
  const arquivo = path.join(APP, nome);
  assert.ok(
    existsSync(arquivo),
    `${arquivo} não existe: rode \`npm run test:build\` (ele faz o next build antes)`,
  );
  return readFileSync(arquivo, "utf8");
}

/** As tags <script> que carregam o p.js, com os atributos já lidos. */
function tagsDoPjs(html) {
  return [...html.matchAll(/<script\b[^>]*\bsrc="[^"]*\/t\/p\.js[^"]*"[^>]*>/g)].map((m) => {
    const tag = m[0];
    const attr = (n) => {
      const a = tag.match(new RegExp(`\\s${n}="([^"]*)"`));
      return a ? a[1].replace(/&amp;/g, "&") : null;
    };
    return { tag, indice: m.index, src: attr("src"), oferta: attr("data-offer"), async: /\sasync(=|\s|>)/.test(tag) };
  });
}

describe("a página inicial", () => {
  let html;
  before(() => {
    html = lerHtml("index.html");
  });

  test("tem UMA tag do script do CashFlow, async, no <head>, com w, o e data-offer da oferta Assinatura", () => {
    const tags = tagsDoPjs(html);
    assert.equal(tags.length, 1, tags.map((t) => t.tag).join("\n"));
    const [t] = tags;
    const fimDoHead = html.indexOf("</head>");
    assert.ok(fimDoHead > 0 && t.indice < fimDoHead, "a tag do p.js está fora do <head>");
    const src = new URL(t.src);
    assert.equal(src.origin + src.pathname, "https://cashflow.mentoriaprocesso.com/t/p.js");
    assert.equal(src.searchParams.get("w"), WORKSPACE);
    assert.equal(src.searchParams.get("o"), OFERTA);
    assert.equal(t.oferta, OFERTA);
    assert.ok(t.async, "o p.js tem de ser async");
  });

  test("os 4 links de plano levam data-cashflow e o próprio plano", () => {
    const links = [...html.matchAll(/<a\b[^>]*>/g)]
      .map((m) => m[0])
      .filter((tag) => /\sdata-cashflow(=|\s|>)/.test(tag));
    const hrefs = links.map((tag) => (tag.match(/\shref="([^"]*)"/) || [])[1]?.replace(/&amp;/g, "&"));
    assert.equal(links.length, 4, hrefs.join("\n"));
    assert.deepEqual(
      hrefs.map((h) => new URL(h).searchParams.get("plano")),
      PLANOS,
    );
    for (const h of hrefs) {
      const u = new URL(h);
      assert.equal(u.origin + u.pathname, "https://cashflow.mentoriaprocesso.com/assinatura", h);
    }
  });

  test("nenhum cupom no HTML: ele só entra no navegador, a partir da URL do visitante", () => {
    assert.doesNotMatch(html, /cupom=/i);
  });

  test("nenhum Pixel próprio: zero fbq( e zero connect.facebook.net", () => {
    assert.doesNotMatch(html, /fbq\(/);
    assert.doesNotMatch(html, /connect\.facebook\.net/);
  });
});

/** Todo .js que o navegador baixa do build (o p.js vem de fora e não está aqui). */
function chunksDoNavegador() {
  assert.ok(existsSync(ESTATICOS), `${ESTATICOS} não existe: rode \`npm run test:build\``);
  return readdirSync(ESTATICOS, { recursive: true })
    .filter((f) => String(f).endsWith(".js"))
    .map((f) => ({ nome: String(f), codigo: readFileSync(path.join(ESTATICOS, String(f)), "utf8") }));
}

describe("o código que o navegador baixa", () => {
  /*
    Um Pixel montado por componente cliente (o MetaPixel antigo, com
    next/script) NÃO aparece no HTML: o código mora num chunk e só o
    <noscript> sobra na página. Por isso a varredura é nos chunks também.
  */
  test("nenhum chunk instala Pixel próprio: zero connect.facebook.net, fbevents e fbq(", () => {
    const chunks = chunksDoNavegador();
    assert.ok(chunks.length > 0, "nenhum chunk .js no build");
    const culpados = chunks.filter((c) => /connect\.facebook\.net|fbevents|fbq\(/.test(c.codigo)).map((c) => c.nome);
    assert.deepEqual(culpados, []);
  });

  test("nem o <noscript> do Pixel (facebook.com/tr) no HTML da /", () => {
    assert.doesNotMatch(lerHtml("index.html"), /facebook\.com\/tr/);
  });
});

describe("o /dashboard (mock)", () => {
  test("não carrega o script do CashFlow nem Pixel", () => {
    const html = lerHtml("dashboard.html");
    assert.equal(tagsDoPjs(html).length, 0);
    assert.doesNotMatch(html, /p\.js\?w=/);
    assert.doesNotMatch(html, /fbq\(|connect\.facebook\.net/);
  });
});
