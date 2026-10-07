/**
 * O script do CashFlow da oferta "Assinatura CashFlow" — o mesmo snippet que
 * o guia de instalação do app entrega, na forma de endereço COMPLETO (a forma
 * relativa `/t/p.js` só funciona dentro do Hub e falha calada fora dele).
 *
 * O que ele faz nesta página, sem mais nenhum código nosso:
 * - registra a visita da oferta (`data-offer` é o que liga a visita à oferta;
 *   sem ele a visita existe mas não pertence a nada);
 * - instala o Pixel da Meta (o mesmo 1963955624447587) e manda PageView e
 *   ViewContent com `event_id`, deduplicados com o CAPI;
 * - conta o InitiateCheckout no clique dos planos, pelo gatilho por URL da
 *   oferta;
 * - decora os links marcados com `data-cashflow` com `sck`/`utm_*`/`fbclid`.
 *
 * Fica SÓ na página inicial, de propósito: o `/dashboard` é um mock e não
 * pode contar visita da oferta. Por isso não vai no `layout.tsx`.
 *
 * `<script async>` puro e não `next/script`: o React o eleva ao `<head>` e
 * ele sai no HTML estático, com todos os `data-*`. Nada de outro Pixel na
 * página: se `window.fbq` já existisse, o script respeitaria o que está lá e
 * a Meta receberia PageView e IC em dobro, metade sem `event_id`.
 */
const WORKSPACE = "b3e3617c-e6d1-4dca-924e-0f6248442b66";
const OFERTA = "2e9f0d87-c735-4c32-b610-9e057dd231da";

export function ScriptDoCashflow() {
  return (
    <script
      src={`https://cashflow.mentoriaprocesso.com/t/p.js?w=${WORKSPACE}&o=${OFERTA}`}
      data-offer={OFERTA}
      data-nowprocket=""
      data-no-minify="1"
      data-no-optimize="1"
      data-cfasync="false"
      async
    />
  );
}
