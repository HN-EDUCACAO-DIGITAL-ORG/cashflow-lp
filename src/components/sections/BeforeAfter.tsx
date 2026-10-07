"use client";

/**
 * Comparativo direto: como a operação funciona nas outras ferramentas e como
 * ela passa a funcionar na Cashflow. Duas colunas espelhadas, vermelha e verde.
 */

import clsx from "clsx";
import { motion } from "motion/react";
import { Check, X } from "lucide-react";
import { Button, Container, Reveal, Section, SplitWords } from "../ui/primitives";
import { CTA_PRIMARY_HREF } from "@/lib/data";

const EASE = [0.16, 1, 0.3, 1] as const;

const BEFORE = [
  "A venda aparece no checkout, mas não está atribuída corretamente no Meta e você não tem confiança para tomar decisão.",
  "Campanhas de várias ofertas ficam misturadas e você não sabe quanto cada uma realmente vendeu.",
  "Você precisa atualizar planilhas manualmente para calcular investimento, faturamento e lucro.",
  "Você demora para perceber que o CPA subiu, o ROAS caiu ou uma oferta começou a perder dinheiro.",
  "Na hora de investir mais, fica a dúvida: “qual oferta eu escalo e qual eu deveria pausar?”",
  "O faturamento aumenta, mas você não consegue enxergar quanto realmente sobrou no caixa.",
];

const AFTER = [
  "Cada venda fica vinculada à oferta, campanha, anúncio e criativo que a gerou.",
  "Cada oferta tem seus próprios números e padrões, sem misturar campanhas e resultados.",
  "Investimento, vendas, faturamento e lucro são atualizados sem depender de planilhas manuais.",
  "Fica fácil identificar quais ofertas sustentam o lucro e quais estão consumindo o resultado.",
  "Mais estabilidade e previsibilidade nas campanhas de anúncio no Meta Ads.",
  "Você sabe onde aumentar o investimento, onde fazer ajustes e onde parar de gastar.",
];

export function BeforeAfter() {
  return (
    <Section>
      <Container>
        <div className="text-center">
          <SplitWords
            text="O que muda na sua operação // a partir da *Cashflow."
            className="display mx-auto max-w-4xl text-balance text-4xl sm:text-5xl lg:text-6xl min-[1921px]:max-w-5xl min-[1921px]:text-7xl"
          />
        </div>

        <div className="mt-14 grid gap-4 lg:grid-cols-2 lg:gap-5">
          <ComparisonColumn
            variant="before"
            tag="Antes"
            title="Outras ferramentas"
            items={BEFORE}
          />
          <ComparisonColumn
            variant="after"
            tag="Agora"
            title="Usando a Cashflow"
            items={AFTER}
          />
        </div>

        <Reveal delay={0.2}>
          <div className="mt-12 flex justify-center">
            <Button href={CTA_PRIMARY_HREF} size="lg">
              QUERO GARANTIR MEU ACESSO
            </Button>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}

function ComparisonColumn({
  variant,
  tag,
  title,
  items,
}: {
  variant: "before" | "after";
  tag: string;
  title: string;
  items: string[];
}) {
  const after = variant === "after";
  const Icon = after ? Check : X;

  return (
    <Reveal amount={0.15} delay={after ? 0.12 : 0} className="h-full">
      <div
        className={clsx(
          "relative flex h-full flex-col overflow-hidden rounded-3xl border p-5 sm:p-7",
          after
            ? "border-green/25 bg-[linear-gradient(180deg,rgba(34,197,94,.09),rgba(34,197,94,.02))]"
            : "border-white/[0.08] bg-[linear-gradient(180deg,rgba(255,255,255,.04),rgba(255,255,255,.01))]",
        )}
      >
        <div
          aria-hidden
          className={clsx(
            "pointer-events-none absolute -top-24 left-1/2 h-48 w-[70%] -translate-x-1/2 rounded-full blur-3xl",
            after ? "bg-green/20" : "bg-red/15",
          )}
        />

        <div className="relative flex items-center justify-between gap-3 border-b border-white/[0.08] pb-4">
          <span
            className={clsx(
              "rounded-full border px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.18em]",
              after ? "border-green/35 bg-green/10 text-green" : "border-white/15 bg-white/[0.04] text-fg-3",
            )}
          >
            {tag}
          </span>
          <span
            className={clsx(
              "display text-right text-lg uppercase leading-none sm:text-2xl",
              after ? "text-green" : "text-fg-2",
            )}
          >
            {title}
          </span>
        </div>

        <ul className="relative mt-5 flex flex-1 flex-col gap-3.5">
          {items.map((t, i) => (
            <motion.li
              key={t}
              className="flex gap-3"
              initial={{ opacity: 0, x: after ? 14 : -14 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.55, delay: 0.06 * i, ease: EASE }}
            >
              <span
                className={clsx(
                  "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border",
                  after ? "border-green/40 bg-green/15 text-green" : "border-red/40 bg-red/15 text-red",
                )}
              >
                <Icon className="h-3 w-3" strokeWidth={3} />
              </span>
              <span className={clsx("text-sm leading-relaxed sm:text-[15px]", after ? "text-fg" : "text-fg-2")}>{t}</span>
            </motion.li>
          ))}
        </ul>
      </div>
    </Reveal>
  );
}
