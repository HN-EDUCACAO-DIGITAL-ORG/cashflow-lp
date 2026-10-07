"use client";

import { AnimatePresence, motion } from "motion/react";
import { useRef, useState } from "react";
import clsx from "clsx";
import { SlidersHorizontal, GitCompare, Wallet, Bell, SunMoon, Sun, Moon, ArrowUpRight, Search, Filter } from "lucide-react";
import { Button, Container, Reveal, Section, SectionHeader } from "../ui/primitives";
import { BentoCard, EASE, Rolling, useLiveBeat, useLiveInterval } from "../mock/bento";
import { FilterChip, Label, Money, SelectBox, StatusPill } from "../mock/product";
import { CTA_PRIMARY_HREF, OFFER } from "@/lib/data";

/* =====================================================================
   Section
   ===================================================================== */

export function Features() {
  return (
    <Section className="!pt-[176px] sm:!pt-32 lg:!pt-40">
      <div className="pointer-events-none absolute inset-x-0 top-[18%] -z-10 h-[640px] bg-[radial-gradient(ellipse_65%_55%_at_50%_50%,rgba(131,0,6,.34),transparent_72%)]" />
      <Container>
        <SectionHeader
          title="Uma visão completa da sua *operação."
          lead="Vendas, ofertas, tráfego e financeiro trabalhando juntos para você entender o que está acontecendo e decidir o que fazer em seguida."
        />

        {/* Duas fileiras de 12 colunas: 4+4+4 e 7+5. */}
        <div className="mt-16 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-12">
          <BentoCard
            index={0}
            accent
            icon={Bell}
            title="Notificações"
            text="Tenha seus principais alertas organizados."
            className="lg:col-span-4"
            mediaClassName="min-h-[168px]"
          >
            <LiveNotifications />
          </BentoCard>

          <BentoCard
            index={1}
            icon={Wallet}
            title="Gestão financeira"
            text="Controle entradas, saídas e resultado mensal."
            className="lg:col-span-4"
            mediaClassName="min-h-[168px]"
          >
            <LiveFinance />
          </BentoCard>

          <BentoCard
            index={2}
            icon={SlidersHorizontal}
            title="Filtros avançados"
            text="Encontre rapidamente os dados que precisa."
            className="sm:col-span-2 lg:col-span-4"
            mediaClassName="min-h-[168px]"
          >
            <LiveFilters />
          </BentoCard>

          <BentoCard
            index={3}
            icon={GitCompare}
            title="Comparação de ofertas"
            text="Compare períodos e ofertas lado a lado."
            className="sm:col-span-2 lg:col-span-7"
            mediaClassName="min-h-[168px]"
          >
            <LiveCompare />
          </BentoCard>

          <BentoCard
            index={4}
            icon={SunMoon}
            title="Modo claro e escuro"
            text="Use o Cashflow do jeito que preferir."
            className="sm:col-span-2 lg:col-span-5"
            mediaClassName="min-h-[168px]"
          >
            <LiveTheme />
          </BentoCard>
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

/* =====================================================================
   Card 2 — notificações: a pré-visualização que chega no celular
   ===================================================================== */

const NOTIF_ROW = 58;

const NOTIFS = [
  { emoji: "💰", title: "Nova venda!", body: `${OFFER.violao.name} — R$ 92,15` },
  { emoji: "⏳", title: "Venda pendente", body: `${OFFER.desafio.name} — R$ 44,65` },
  { emoji: "🏆", title: "Meta batida!", body: "Você passou de R$ 1.000 hoje" },
  { emoji: "💰", title: "Nova venda!", body: `${OFFER.planner.name} — R$ 63,65` },
  { emoji: "⚠️", title: "ROAS caindo", body: `${OFFER.churrasco.name} · 0,82x nos últimos 3 dias` },
  { emoji: "💰", title: "Nova venda!", body: `${OFFER.rotina.name} — R$ 35,15` },
];

function LiveNotifications() {
  const [items, setItems] = useState<{ id: number; n: (typeof NOTIFS)[number] }[]>([
    { id: 0, n: NOTIFS[0] },
    { id: -1, n: NOTIFS[1] },
    { id: -2, n: NOTIFS[2] },
  ]);
  const beat = useRef(0);

  const ref = useLiveInterval(2800, () => {
    beat.current += 1;
    const id = beat.current;
    setItems((prev) => [{ id, n: NOTIFS[id % NOTIFS.length] }, ...prev].slice(0, 3));
  });

  return (
    <div ref={ref}>
      <Label className="mb-2">Pré-visualização</Label>
      {/* Altura fixa com linhas posicionadas: chegadas nunca mudam o tamanho do card. */}
      <div className="relative overflow-hidden" style={{ height: 3 * NOTIF_ROW }}>
        <AnimatePresence initial={false}>
          {items.map(({ id, n }, i) => (
            <motion.div
              key={id}
              className="absolute inset-x-0 top-0 flex items-center gap-3 overflow-hidden rounded-xl border border-white/[0.08] bg-card px-3"
              style={{ height: NOTIF_ROW - 8 }}
              initial={{ opacity: 0, x: 36, filter: "blur(4px)" }}
              animate={{ opacity: 1 - i * 0.28, x: 0, y: i * NOTIF_ROW, filter: "blur(0px)" }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: EASE }}
            >
              {i === 0 && (
                <motion.span
                  className="absolute inset-0 bg-green/15"
                  initial={{ opacity: 1 }}
                  animate={{ opacity: 0 }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              )}
              <span className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/[0.05] text-[15px]">
                {n.emoji}
              </span>
              <span className="relative min-w-0 flex-1 leading-tight">
                <span className="block truncate text-[12px] font-bold">{n.title}</span>
                <span className="block truncate text-[10px] text-fg-2">{n.body}</span>
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* =====================================================================
   Card 3 — profit climbing
   ===================================================================== */

function LiveFinance() {
  const [inflow, setInflow] = useState(16760);
  const [outflow, setOutflow] = useState(12112);
  const beat = useRef(0);

  const ref = useLiveInterval(2600, () => {
    beat.current += 1;
    setInflow((v) => v + Math.round(120 + Math.random() * 380));
    if (beat.current % 3 === 0) setOutflow((v) => v + Math.round(40 + Math.random() * 120));
  });

  const result = inflow - outflow;
  const margin = Math.min(60, (result / inflow) * 100);

  return (
    <div ref={ref} className="flex h-full flex-col justify-between gap-3">
      <div className="relative overflow-hidden rounded-xl border border-green/30 bg-green/[0.07] p-3">
        <motion.div
          className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-green/40 blur-2xl"
          animate={{ opacity: [0.4, 0.75, 0.4] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="relative flex items-baseline justify-between">
          <span className="text-[10px] text-fg-3">Resultado do mês</span>
          <span className="flex items-center gap-0.5 font-mono text-[9px] text-green">
            <ArrowUpRight className="h-2.5 w-2.5" />
            subindo
          </span>
        </div>
        <div className="relative mt-1 text-2xl font-bold tracking-tight text-green">
          <Rolling value={result} prefix="R$ " />
        </div>
        <div className="relative mt-3 h-1.5 overflow-hidden rounded-full bg-white/[0.08]">
          <motion.div className="h-full rounded-full bg-green" animate={{ width: `${margin}%` }} transition={{ duration: 1.1, ease: EASE }} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-lg border border-white/[0.07] bg-white/[0.03] px-3 py-2">
          <div className="text-[10px] text-fg-3">Entradas</div>
          <div className="font-mono text-xs text-green">
            <Rolling value={inflow} prefix="+R$ " />
          </div>
        </div>
        <div className="rounded-lg border border-white/[0.07] bg-white/[0.03] px-3 py-2">
          <div className="text-[10px] text-fg-3">Saídas</div>
          <div className="font-mono text-xs text-fg">
            <Rolling value={outflow} prefix="−R$ " />
          </div>
        </div>
      </div>
    </div>
  );
}

/* =====================================================================
   Card 4 — comparação: Lado A × Lado B, período a período
   ===================================================================== */

const PERIODS = [
  { label: "Últimos 7 dias", a: 466.9, b: 55.24 },
  { label: "Últimos 30 dias", a: 1842.3, b: 612.75 },
  { label: "Hoje", a: 489.6, b: 66.3 },
];

function LiveCompare() {
  const { ref, tick } = useLiveBeat(2800);
  const p = PERIODS[tick % PERIODS.length];
  const diff = ((p.a - p.b) / p.b) * 100;
  const aWins = p.a >= p.b;

  return (
    <div ref={ref} className="flex h-full flex-col gap-2.5">
      <div className="flex items-center justify-between">
        <SelectBox className="h-7 text-[10px]">{p.label}</SelectBox>
        <StatusPill tone="green">Lado A vence</StatusPill>
      </div>

      <div className="grid flex-1 grid-cols-[1fr_auto_1fr] items-stretch gap-2">
        {(["a", "b"] as const).map((side, idx) => {
          const win = side === "a" ? aWins : !aWins;
          const v = side === "a" ? p.a : p.b;
          const pct = side === "a" ? diff : ((p.b - p.a) / p.a) * 100;
          return (
            <div
              key={side}
              className={clsx(
                "relative flex flex-col rounded-xl border border-white/[0.06] border-t-2 bg-card p-3",
                side === "a" ? "border-t-blue" : "border-t-orange",
              )}
              style={{ order: idx * 2 }}
            >
              <div className="flex items-start justify-between gap-1">
                <span className="min-w-0">
                  <span className="block truncate text-[10.5px] font-bold">{side === "a" ? OFFER.desafio.name : OFFER.churrasco.name}</span>
                  <span className="block text-[8px] text-fg-3">{p.label}</span>
                </span>
                {win && <StatusPill tone="green" className="shrink-0">🏆 Vence</StatusPill>}
              </div>
              <Label className="mt-2">Lucro</Label>
              <div className="mt-0.5 flex flex-wrap items-center gap-1.5">
                <span className="text-[17px] font-bold tracking-tight text-green">
                  <Rolling value={v} prefix="R$ " digits={2} />
                </span>
                <span className={clsx("rounded-full px-1.5 py-[1px] font-mono text-[8px]", pct >= 0 ? "bg-green/15 text-green" : "bg-red/15 text-red")}>
                  {pct >= 0 ? "↑" : "↓"} {Math.abs(pct).toFixed(1)}%
                </span>
              </div>
            </div>
          );
        })}
        <span className="self-center rounded-md border border-white/10 bg-white/[0.04] px-1.5 py-1 font-mono text-[8px] uppercase tracking-wider text-fg-3" style={{ order: 1 }}>
          Versus
        </span>
      </div>

      <div>
        <div className="mb-1 flex justify-between text-[9px]">
          <span className="text-fg-3">De onde veio a diferença</span>
          <span className="font-mono text-green">+<Money v={p.a - p.b} /></span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
          <motion.div
            className="h-full rounded-full bg-green"
            animate={{ width: `${Math.min(100, (Math.abs(p.a - p.b) / Math.max(p.a, p.b)) * 100)}%` }}
            transition={{ duration: 1.1, ease: EASE }}
          />
        </div>
      </div>
    </div>
  );
}

/* =====================================================================
   Card 5 — filtros: chips de status e busca, como na Gestão de Ofertas
   ===================================================================== */

const STATUS = [
  { l: "Todas", n: 6 },
  { l: "Ativa", n: 5 },
  { l: "Em pausa", n: 1 },
  { l: "Sem status", n: 0 },
];
const FILTER_STEPS = [
  { status: 0, period: "Hoje", sort: "Maior Lucro", results: 6 },
  { status: 1, period: "Últimos 7 dias", sort: "Maior Lucro", results: 5 },
  { status: 1, period: "Últimos 7 dias", sort: "Maior ROAS", results: 5 },
  { status: 2, period: "Últimos 30 dias", sort: "Maior Faturamento", results: 1 },
];

function LiveFilters() {
  const { ref, tick } = useLiveBeat(2500);
  const step = FILTER_STEPS[tick % FILTER_STEPS.length];

  return (
    <div ref={ref} className="flex h-full flex-col justify-between gap-3">
      <div className="flex flex-wrap gap-1.5">
        {STATUS.map((s, i) => (
          <FilterChip key={s.l} active={i === step.status} count={s.n}>
            {s.l}
          </FilterChip>
        ))}
      </div>
      <div className="flex h-8 items-center gap-2 rounded-lg border border-white/[0.08] bg-[#0d0d0d] px-2.5 text-[10px] text-fg-3">
        <Search className="h-3 w-3" /> Buscar oferta pelo nome…
        <Filter className="ml-auto h-3 w-3" />
      </div>
      <div className="grid grid-cols-2 gap-1.5">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div key={step.period} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
            <SelectBox className="h-7 w-full text-[10px]">{step.period}</SelectBox>
          </motion.div>
          <motion.div key={step.sort} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
            <SelectBox className="h-7 w-full text-[10px]">{step.sort}</SelectBox>
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="flex items-baseline gap-1.5 border-t border-white/[0.07] pt-3 text-[11px] text-fg-3">
        <Rolling value={step.results} className="font-mono text-base font-semibold text-fg" duration={500} />
        ofertas encontradas
      </div>
    </div>
  );
}

/* =====================================================================
   Card 6 — theme switching on a loop (still clickable)
   ===================================================================== */

function LiveTheme() {
  const { ref, tick } = useLiveBeat(3200);
  const [manual, setManual] = useState<boolean | null>(null);
  const dark = manual ?? tick % 2 === 0;

  return (
    <div ref={ref} className="h-full">
      <motion.button
        onClick={() => setManual(!dark)}
        aria-label="Alternar tema"
        animate={{
          backgroundColor: dark ? "rgba(0,0,0,0.45)" : "rgba(244,244,245,0.95)",
          color: dark ? "#ffffff" : "#0a0a0b",
          borderColor: dark ? "rgba(255,255,255,0.09)" : "rgba(0,0,0,0.1)",
        }}
        transition={{ duration: 0.6, ease: EASE }}
        className="flex h-full w-full flex-col rounded-xl border p-3 text-left"
      >
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold">Dashboard</span>
          <motion.span
            animate={{ backgroundColor: dark ? "rgba(255,255,255,0.14)" : "#FA0A15" }}
            transition={{ duration: 0.6 }}
            className="relative flex h-5 w-9 items-center rounded-full p-0.5"
          >
            <motion.span
              layout
              transition={{ type: "spring", stiffness: 420, damping: 30 }}
              className={clsx("flex h-4 w-4 items-center justify-center rounded-full bg-white text-black", dark ? "ml-0" : "ml-auto")}
            >
              {dark ? <Moon className="h-2.5 w-2.5" /> : <Sun className="h-2.5 w-2.5" />}
            </motion.span>
          </motion.span>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-1.5">
          {["R$ 5.9k", "127"].map((v) => (
            <motion.div
              key={v}
              animate={{ backgroundColor: dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)" }}
              transition={{ duration: 0.6 }}
              className="rounded-md p-2 font-mono text-[10px] tabular"
            >
              {v}
            </motion.div>
          ))}
        </div>
        <motion.div
          animate={{ backgroundColor: dark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)" }}
          transition={{ duration: 0.6 }}
          className="mt-1.5 flex flex-1 items-end overflow-hidden rounded-md p-1.5"
        >
          <div className="flex h-full w-full items-end gap-1">
            {[3, 5, 4, 7, 6, 9, 11].map((h, i) => (
              <motion.span
                key={i}
                className="flex-1 rounded-sm bg-red"
                animate={{ height: `${(h / 11) * 100}%` }}
                transition={{ duration: 0.8, delay: i * 0.04, ease: EASE }}
              />
            ))}
          </div>
        </motion.div>
      </motion.button>
    </div>
  );
}
