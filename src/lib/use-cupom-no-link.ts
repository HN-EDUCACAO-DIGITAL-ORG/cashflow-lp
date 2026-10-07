"use client";

import { useEffect, type RefObject } from "react";
import { comCupom, cupomDaVisita, type Armazem } from "./cupom";

function armazemDaAba(): Armazem | null {
  try {
    return window.sessionStorage;
  } catch {
    return null;
  }
}

/**
 * Acrescenta o cupom da visita ao `href` ATUAL do link, depois da montagem.
 *
 * Por que pelo DOM e não pelo estado do React: o script do CashFlow (p.js)
 * decora o link com `sck`/`utm_*`/`fbclid` na carga, uma vez só. Se o React
 * reescrevesse o `href` a partir da prop, a decoração sumiria do atributo, e
 * o botão do meio, o "abrir em nova aba" e o toque longo levariam o link sem
 * ela. Aqui o cupom é ACRESCENTADO ao que já está lá, e o p.js, quando chega
 * depois, só acrescenta também: nas duas ordens o link termina com as duas
 * coisas antes de qualquer gesto. A prop `href` continua estável (igual no
 * servidor e no cliente), então o React nunca mais toca o atributo.
 */
export function useCupomNoLink(ref: RefObject<HTMLAnchorElement | null>) {
  useEffect(() => {
    const link = ref.current;
    if (!link) return;
    const cupom = cupomDaVisita(window.location.search, armazemDaAba());
    if (!cupom) return;
    const novo = comCupom(link.href, cupom);
    if (novo !== link.href) link.href = novo;
  }, [ref]);
}
