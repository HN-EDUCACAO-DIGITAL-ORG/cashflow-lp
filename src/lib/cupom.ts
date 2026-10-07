/**
 * O cupom que chega pelo link de indicação (`/?cupom=CODIGO`) e segue para o
 * checkout dentro dos links dos planos.
 *
 * Regras, e por quê:
 * - A normalização é a MESMA do servidor (`billing-checkout`: trim +
 *   maiúsculas). Uma regra mais estreita aqui descartaria calada um cupom que
 *   o checkout aceitaria (o do admin pode ter `_` ou `%`).
 * - Recusa só o que nenhum cupom tem: vazio, espaço no meio, caractere de
 *   controle e mais de 64 caracteres. Quem decide se o cupom VALE é o
 *   checkout, que responde com o aviso de cupom inválido.
 * - O cupom entra no link só por `URLSearchParams.set`, codificado: um
 *   `A&plano=master` vira o valor `A%26PLANO%3DMASTER` e nunca um parâmetro
 *   novo, e a origem e o caminho do link não mudam.
 * - A página NUNCA mostra o cupom. Escrever "cupom X aplicado" sem validar
 *   faria de `?cupom=GRATIS100` uma isca; quem confirma é o checkout.
 *
 * Este arquivo não depende de React nem do navegador, para ser testado com
 * `node --test` (ver tests/cupom.test.mjs).
 */

/** A mesma chave que o app usa no próprio domínio para o cupom da indicação. */
export const CHAVE_DO_CUPOM = "cashflow:cupom-de-indicacao";

export const TAMANHO_MAXIMO_DO_CUPOM = 64;

/** Espaço de qualquer tipo, ou caractere de controle (C0, DEL e C1). */
const PROIBIDO = /[\s\u0000-\u001f\u007f-\u009f]/;

/** Devolve o cupom normalizado, ou `null` se ele não pode ser um cupom. */
export function normalizarCupom(bruto: string | null | undefined): string | null {
  if (typeof bruto !== "string") return null;
  const cupom = bruto.trim().toUpperCase();
  if (!cupom || cupom.length > TAMANHO_MAXIMO_DO_CUPOM || PROIBIDO.test(cupom)) return null;
  return cupom;
}

/**
 * O `href` com o cupom acrescentado. Preserva tudo o que já estiver no link
 * (`plano`, e o `sck`/`utm_*`/`fbclid` que o script do CashFlow põe) e só
 * sobrescreve o próprio `cupom`. Sem cupom, ou com um `href` que não é URL
 * absoluta, devolve o `href` como veio.
 */
export function comCupom(href: string, cupom: string | null | undefined): string {
  const valido = normalizarCupom(cupom);
  if (!valido) return href;
  let url: URL;
  try {
    url = new URL(href);
  } catch {
    return href;
  }
  if (url.searchParams.get("cupom") === valido) return href;
  url.searchParams.set("cupom", valido);
  return url.toString();
}

/** O pedaço do `sessionStorage` que esta regra usa (dublê fácil no teste). */
export type Armazem = Pick<Storage, "getItem" | "setItem" | "removeItem">;

/**
 * O cupom desta visita.
 *
 * A URL vence sempre: com `?cupom=` válido, ele é o cupom e fica guardado na
 * aba (recarregar sem a query o mantém); com `?cupom=` inválido, não há cupom
 * e o guardado é esquecido, porque o link novo pediu outra coisa. Sem
 * `?cupom=` na URL, vale o guardado. Armazenamento bloqueado não quebra nada:
 * a URL continua valendo.
 */
export function cupomDaVisita(busca: string, armazem: Armazem | null): string | null {
  const daUrl = new URLSearchParams(busca);
  if (daUrl.has("cupom")) {
    const cupom = normalizarCupom(daUrl.get("cupom"));
    try {
      if (cupom) armazem?.setItem(CHAVE_DO_CUPOM, cupom);
      else armazem?.removeItem(CHAVE_DO_CUPOM);
    } catch {
      /* sessionStorage bloqueado: segue só com a URL */
    }
    return cupom;
  }
  try {
    return normalizarCupom(armazem?.getItem(CHAVE_DO_CUPOM));
  } catch {
    return null;
  }
}

/** Os planos que a página vende; `?plano=` fora desta lista é ignorado. */
export const PLANOS_DA_PAGINA = ["gold", "diamond", "ruby", "master"] as const;

/** O plano pedido no link (`?plano=gold`), ou `null`. */
export function planoPedido(busca: string): (typeof PLANOS_DA_PAGINA)[number] | null {
  const plano = new URLSearchParams(busca).get("plano")?.trim().toLowerCase();
  return PLANOS_DA_PAGINA.find((p) => p === plano) ?? null;
}
