/**
 * O cupom da indicação na landing: a regra pura em src/lib/cupom.ts.
 *
 * Por que importa: o link de indicação (`/r/CODIGO` no app) passa a abrir esta
 * página com `?cupom=CODIGO`, e é daqui que o cupom segue para o checkout,
 * dentro dos 4 links de plano. Se a regra descartar um cupom válido, a pessoa
 * paga cheio sem aviso; se ela deixar um valor da URL virar parâmetro novo, um
 * `?cupom=A%26plano%3Dmaster` troca o plano do botão.
 *
 * Roda com `npm test` (node --test, Node >= 22.18, que lê TypeScript direto).
 */
import { test, describe } from "node:test";
import assert from "node:assert/strict";
import {
  CHAVE_DO_CUPOM,
  comCupom,
  cupomDaVisita,
  normalizarCupom,
  planoPedido,
} from "../src/lib/cupom.ts";

const GOLD = "https://cashflow.mentoriaprocesso.com/assinatura?plano=gold";

function armazemDeTeste(inicial = {}) {
  const dados = new Map(Object.entries(inicial));
  return {
    dados,
    getItem: (k) => (dados.has(k) ? dados.get(k) : null),
    setItem: (k, v) => void dados.set(k, String(v)),
    removeItem: (k) => void dados.delete(k),
  };
}

describe("normalizarCupom: a mesma régua do servidor (trim + maiúsculas)", () => {
  test("apara e põe em maiúsculas", () => {
    assert.equal(normalizarCupom("  lucas-nwwm "), "LUCAS-NWWM");
  });

  test("aceita o que o checkout aceita, inclusive cupom do admin com _ e %", () => {
    assert.equal(normalizarCupom("black_friday%10"), "BLACK_FRIDAY%10");
  });

  test("recusa vazio, só espaço, espaço no meio, caractere de controle e mais de 64", () => {
    for (const ruim of ["", "   ", "LUCAS NWWM", "A\tB", "A\u0000B", "A\u007fB", "A\u0085B", "X".repeat(65), null, undefined]) {
      assert.equal(normalizarCupom(ruim), null, JSON.stringify(ruim));
    }
    assert.equal(normalizarCupom("X".repeat(64)), "X".repeat(64));
  });
});

describe("comCupom: acrescenta o cupom sem tirar nada do link", () => {
  test("o link do plano ganha o cupom e mantém o plano", () => {
    const u = new URL(comCupom(GOLD, "lucas-nwwm"));
    assert.equal(u.origin + u.pathname, "https://cashflow.mentoriaprocesso.com/assinatura");
    assert.equal(u.searchParams.get("plano"), "gold");
    assert.equal(u.searchParams.get("cupom"), "LUCAS-NWWM");
  });

  test("preserva o que o script do CashFlow já pôs (sck, utm, fbclid)", () => {
    const decorado = `${GOLD}&sck=abc23xyz9pqr&utm_source=FB&utm_content=AD1&fbclid=F1`;
    const u = new URL(comCupom(decorado, "LUCAS-NWWM"));
    assert.deepEqual(
      [...u.searchParams.entries()],
      [["plano", "gold"], ["sck", "abc23xyz9pqr"], ["utm_source", "FB"], ["utm_content", "AD1"], ["fbclid", "F1"], ["cupom", "LUCAS-NWWM"]],
    );
  });

  test("sobrescreve só o próprio cupom", () => {
    const u = new URL(comCupom(`${GOLD}&cupom=VELHO`, "NOVO"));
    assert.deepEqual(u.searchParams.getAll("cupom"), ["NOVO"]);
    assert.equal(u.searchParams.get("plano"), "gold");
  });

  test("sem cupom, ou com cupom inválido, devolve o href igual", () => {
    for (const nada of ["", null, undefined, "   ", "A B"]) assert.equal(comCupom(GOLD, nada), GOLD);
  });

  test("com o mesmo cupom já no link, devolve o href igual (não re-serializa)", () => {
    const ja = `${GOLD}&utm_content=a%20b&cupom=X1`;
    assert.equal(comCupom(ja, "x1"), ja);
  });

  test("href que não é URL absoluta volta como veio", () => {
    assert.equal(comCupom("#planos", "X1"), "#planos");
  });

  test("valor hostil vira texto codificado, nunca parâmetro novo nem outro destino", () => {
    for (const hostil of ["A&plano=master", "JAVASCRIPT:ALERT(1)", "\"><svg/onload=alert(1)>", "X#frag", "../../evil"]) {
      const saida = comCupom(GOLD, hostil);
      const u = new URL(saida);
      assert.equal(u.origin + u.pathname, "https://cashflow.mentoriaprocesso.com/assinatura", hostil);
      assert.equal(u.hash, "", hostil);
      assert.deepEqual([...u.searchParams.keys()], ["plano", "cupom"], hostil);
      assert.equal(u.searchParams.get("plano"), "gold", hostil);
      assert.equal(u.searchParams.get("cupom"), hostil.toUpperCase(), hostil);
      assert.doesNotMatch(saida.split("?")[1], /[<>"#&]plano=master|[<>"]/, hostil);
    }
  });

});

describe("cupomDaVisita: a URL vence, a aba guarda", () => {
  test("?cupom= válido é o cupom e fica guardado na aba", () => {
    const a = armazemDeTeste();
    assert.equal(cupomDaVisita("?cupom=lucas-nwwm&utm_source=FB", a), "LUCAS-NWWM");
    assert.equal(a.dados.get(CHAVE_DO_CUPOM), "LUCAS-NWWM");
  });

  test("recarregar sem a query mantém o cupom guardado", () => {
    const a = armazemDeTeste({ [CHAVE_DO_CUPOM]: "LUCAS-NWWM" });
    assert.equal(cupomDaVisita("", a), "LUCAS-NWWM");
    assert.equal(cupomDaVisita("?utm_source=FB", a), "LUCAS-NWWM");
  });

  test("a URL vence o guardado", () => {
    const a = armazemDeTeste({ [CHAVE_DO_CUPOM]: "VELHO" });
    assert.equal(cupomDaVisita("?cupom=novo", a), "NOVO");
    assert.equal(a.dados.get(CHAVE_DO_CUPOM), "NOVO");
  });

  test("?cupom= inválido não é cupom e esquece o guardado", () => {
    const a = armazemDeTeste({ [CHAVE_DO_CUPOM]: "VELHO" });
    assert.equal(cupomDaVisita("?cupom=%22%3E%3Cimg%20src%3Dx%3E", a), null);
    assert.equal(a.dados.has(CHAVE_DO_CUPOM), false);
  });

  test("sessionStorage bloqueado (lança) não quebra: a URL continua valendo", () => {
    const quebrado = {
      getItem() { throw new Error("SecurityError"); },
      setItem() { throw new Error("SecurityError"); },
      removeItem() { throw new Error("SecurityError"); },
    };
    assert.equal(cupomDaVisita("?cupom=x1", quebrado), "X1");
    assert.equal(cupomDaVisita("", quebrado), null);
    assert.equal(cupomDaVisita("?cupom=x1", null), "X1");
  });

  test("um guardado adulterado também passa pela régua", () => {
    assert.equal(cupomDaVisita("", armazemDeTeste({ [CHAVE_DO_CUPOM]: "A B" })), null);
  });
});

describe("planoPedido: só os 4 planos da página", () => {
  test("reconhece os 4, sem diferença de caixa", () => {
    assert.equal(planoPedido("?cupom=X&plano=gold"), "gold");
    assert.equal(planoPedido("?plano=RUBY"), "ruby");
    assert.equal(planoPedido("?plano=diamond"), "diamond");
    assert.equal(planoPedido("?plano=master"), "master");
  });

  test("valor fora da lista, ou ausente, é ignorado", () => {
    for (const b of ["", "?plano=xyz", "?plano=", "?plano=platinum", "?plano=gold;master"]) {
      assert.equal(planoPedido(b), null, b);
    }
  });
});
