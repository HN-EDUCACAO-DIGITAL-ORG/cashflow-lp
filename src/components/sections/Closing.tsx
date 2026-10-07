"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import clsx from "clsx";
import { CheckCircle2, XCircle, ArrowUp, Plus, Sparkles, Gem, Flame, Crown, AtSign } from "lucide-react";
import * as PricingCard from "../ui/pricing-card";
import { InteractiveTiltCard } from "../ui/tilt-card";
import { Button, Container, Reveal, Section, SectionHeader, SplitWords } from "../ui/primitives";
import { CTA_PRIMARY_HREF, FAQ, PLANS } from "@/lib/data";

const EASE = [0.16, 1, 0.3, 1] as const;

const PLAN_ICONS = { gold: Sparkles, diamond: Gem, ruby: Flame, master: Crown } as const;

/* =====================================================================
   Manifesto
   ===================================================================== */

export function Manifesto() {
  return (
    <Section className="relative overflow-hidden !pt-12 sm:!pt-16 lg:!pt-20">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_60%_50%_at_50%_100%,rgba(131,0,6,.45),transparent_70%)]" />
      <Container className="text-center">
        <Reveal delay={0.1}>
          <p className="mx-auto max-w-2xl text-balance text-lg leading-relaxed text-fg-3 lg:max-w-3xl lg:text-2xl min-[1921px]:max-w-4xl min-[1921px]:text-3xl">
            Uma ferramenta construída para quem não quer apenas vender mais. Quer entender a operação, encontrar
            oportunidades e executar melhor.
          </p>
        </Reveal>
        <Reveal delay={0.25} amount={0.15}>
          <div className="relative mx-auto mt-20 w-full max-w-4xl [perspective:1200px] min-[1921px]:max-w-[1200px]">
            <a
              href="https://www.instagram.com/heitornogueirama/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Abrir o Instagram de Heitor Nogueira em uma nova aba"
              className="group relative block aspect-[16/10] w-full overflow-visible rounded-[10px] outline-none ring-red/50 focus-visible:ring-2"
            >
              <div className="pointer-events-none absolute -inset-10 -z-10 rounded-[3rem] bg-red-deep/40 blur-[80px]" />
              <InteractiveTiltCard
                image={{ src: "/manifesto.jpg", alt: "O ecossistema de Lowticket por trás do Cashflow" }}
                fallback={<ManifestoFallback />}
                borderRadius={20}
                tiltFactor={12}
                hoverScale={1.03}
                shadowIntensity={0.65}
                glareIntensity={0.18}
                glareSize={70}
              />
              <span className="pointer-events-none absolute bottom-4 right-4 z-10 flex items-center gap-2 rounded-full border border-white/15 bg-black/55 px-3.5 py-2 text-[11px] font-semibold text-fg opacity-0 backdrop-blur-md transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100 sm:bottom-6 sm:right-6">
                <AtSign className="h-3.5 w-3.5" />
                @heitornogueirama
              </span>
            </a>
            <a
              href="https://www.instagram.com/heitornogueirama/"
              target="_blank"
              rel="noopener noreferrer"
              className="absolute left-3 top-0 z-20 -translate-y-1/2 overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a0b] shadow-[0_12px_40px_-16px_rgba(0,0,0,.85)] outline-none ring-red/50 focus-visible:ring-2 sm:left-5"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/heitor/instagram-handle.png"
                alt="Perfil de Heitor Nogueira no Instagram, @heitornogueirama"
                className="h-auto w-[168px] object-cover sm:w-[210px] min-[1921px]:w-[240px]"
              />
            </a>
          </div>
        </Reveal>

        <Reveal delay={0.3}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/heitor/mentorados.jpg"
            alt="Mentorados de Heitor Nogueira"
            className="mx-auto mt-8 w-full max-w-4xl rounded-[20px] object-cover min-[1921px]:max-w-[1200px]"
          />
        </Reveal>

        <SplitWords
          text="Heitor Nogueira, criador da *Cashflow"
          className="display mx-auto mt-12 max-w-3xl text-balance text-3xl sm:text-4xl lg:text-5xl min-[1921px]:text-6xl"
        />
        <Reveal delay={0.12}>
          <blockquote className="mx-auto mt-6 max-w-[68ch] space-y-5 text-pretty text-left text-base leading-relaxed text-fg-2 sm:space-y-6 sm:text-lg min-[1921px]:text-xl">
            <p>
              Executor, a Cashflow nasceu dentro da minha própria operação, depois que cheguei a rodar mais de 50 ofertas
              simultaneamente e construí uma operação com mais de R$ 100 mil de lucro/mês.
            </p>
            <p>
              Conforme o volume aumentava, ficou cada vez mais difícil separar os resultados, confiar nas marcações do
              Meta Ads e entender quanto cada oferta realmente estava deixando no caixa.
            </p>
            <p>
              Eu cheguei a usar uma ferramenta conhecida do mercado, mas percebi que ela não resolvia o que eu
              precisava. Existia um furo na operação: eu conseguia acompanhar algumas métricas, mas não tinha uma visão
              completa das minhas ofertas, do tráfego e do financeiro.
            </p>
            <p>
              Foi a partir dessa necessidade que criei a Cashflow. Ela não é apenas mais uma ferramenta ou um dashboard
              com números. É uma metodologia própria de gestão, desenvolvida dentro de uma operação real, para mostrar
              com clareza onde você está ganhando, onde está perdendo e onde precisa agir.
            </p>
          </blockquote>
        </Reveal>
      </Container>
    </Section>
  );
}

/** Shown until a real photo is dropped at /public/manifesto.jpg. */
function ManifestoFallback() {
  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-[#0a0a0b]">
      <div className="absolute inset-0 grid-bg opacity-40" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_50%_50%,rgba(131,0,6,.65),transparent_70%)]" />
      <div className="relative flex flex-col items-center gap-5">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/brand/logo-icon.svg" alt="" className="h-20 w-20 opacity-90" />
        <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-fg-3">Ecossistema Lowticket</p>
      </div>
    </div>
  );
}

/* =====================================================================
   Planos
   ===================================================================== */

type Plan = (typeof PLANS)[number];

function salesJumpFor(p: Plan) {
  const idx = PLANS.indexOf(p);
  const prev = PLANS[idx - 1];
  return prev ? Math.round((p.salesLimit / prev.salesLimit - 1) * 100) : null;
}

function PlanFeatureItems({ p, salesJump }: { p: Plan; salesJump: number | null }) {
  return (
    <>
      <PricingCard.ListItem>
        <CheckCircle2 aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-green" />
        <span className="flex flex-wrap items-center gap-x-1.5">
          Até {p.salesLimit.toLocaleString("pt-BR")} vendas/mês
          {salesJump !== null && (
            <span className="inline-flex items-center gap-0.5 rounded-full bg-green/15 px-1.5 py-0.5 font-mono text-[10px] tabular text-green">
              <ArrowUp aria-hidden className="h-2.5 w-2.5" />
              {salesJump}%
            </span>
          )}
        </span>
      </PricingCard.ListItem>
      {p.features.map((f) => (
        <PricingCard.ListItem key={f}>
          <CheckCircle2 aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-green" />
          <span className={f.includes("VIP") ? "text-fg" : undefined}>{f}</span>
        </PricingCard.ListItem>
      ))}
      {p.lockedFeatures?.map((f) => (
        <PricingCard.ListItem key={f} className="opacity-45">
          <XCircle aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-fg-3" />
          <span className="line-through">{f}</span>
        </PricingCard.ListItem>
      ))}
    </>
  );
}

/**
 * CTA dos planos: fundo sólido, sem ícone. O Diamond usa o vermelho da marca
 * para se destacar entre os cartões brancos.
 *
 * O InitiateCheckout NÃO sai daqui: quem o conta é o script do CashFlow, pelo
 * gatilho por URL configurado na oferta (as 4 URLs de `/assinatura?plano=`),
 * com o mesmo `event_id` no navegador e no CAPI. Um `fbq('track')` aqui
 * somaria um segundo IC, sem `event_id`, que a Meta não deduplica.
 *
 * `data-cashflow` faz o script levar `sck`/`utm_*`/`fbclid` ao checkout.
 */
function PlanButton({ p }: { p: Plan }) {
  const external = p.href.startsWith("http");
  return (
    <a
      href={p.href}
      data-cashflow=""
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className={clsx(
        "flex h-12 w-full items-center justify-center rounded-xl px-4 text-center text-[13px] font-bold leading-tight",
        "transition-[transform,background-color,box-shadow] duration-300 ease-out-expo active:scale-[0.98]",
        p.highlight
          ? "bg-green text-[#052e16] shadow-[0_10px_30px_-10px_rgba(34,197,94,.85)] hover:bg-[#2ee36b] hover:shadow-[0_14px_38px_-10px_rgba(34,197,94,1)]"
          : "bg-white text-[#0a0a0b] hover:bg-white/90",
      )}
    >
      Quero ser membro {p.name}
    </a>
  );
}

function PlanCard({ p }: { p: Plan }) {
  const Icon = PLAN_ICONS[p.id];
  const salesJump = salesJumpFor(p);
  return (
    <PricingCard.Card
      className={clsx(
        "h-full transition-transform duration-500 ease-out-expo hover:-translate-y-1",
        // O Diamond ganha escala e sombra maiores — cresce sem empurrar os vizinhos.
        p.highlight &&
          "border-red/45 shadow-[0_0_0_1px_rgba(250,10,21,.3),0_40px_110px_-40px_rgba(250,10,21,.85)] lg:z-10 lg:scale-[1.05]",
      )}
    >
      {p.highlight && (
        <div className="pointer-events-none absolute -top-px left-1/2 h-px w-2/3 -translate-x-1/2 bg-gradient-to-r from-transparent via-red to-transparent" />
      )}

      <PricingCard.Header className={clsx(p.highlight && "border-red/25")}>
        <PricingCard.Plan>
          <PricingCard.PlanName className={clsx(p.highlight && "text-red")}>
            <Icon className={clsx("h-[18px] w-[18px]", p.highlight && "animate-diamond-glint")} />
            {p.highlight ? <span className="diamond-text">{p.name}</span> : p.name}
          </PricingCard.PlanName>
          {p.highlight && (
            <PricingCard.Badge className="border-green/50 bg-green/15 font-semibold text-green">Mais escolhido</PricingCard.Badge>
          )}
        </PricingCard.Plan>

        <PricingCard.Description className="mb-4 min-h-[32px]">{p.tagline}</PricingCard.Description>

        <PricingCard.Price className="mb-5">
          <span className="pb-1 font-mono text-base text-fg-3">R$</span>
          <PricingCard.MainPrice>{p.monthly}</PricingCard.MainPrice>
          <PricingCard.Period>/mês</PricingCard.Period>
        </PricingCard.Price>

        <PlanButton p={p} />
      </PricingCard.Header>

      <PricingCard.Body>
        <PricingCard.List>
          <PlanFeatureItems p={p} salesJump={salesJump} />
        </PricingCard.List>

        <PricingCard.Separator className="mt-auto" />

        <p className="-mt-1 font-mono text-[11px] text-fg-3">{p.extraSale}</p>
      </PricingCard.Body>
    </PricingCard.Card>
  );
}

function MasterCard({ p }: { p: Plan }) {
  const Icon = PLAN_ICONS[p.id];
  const salesJump = salesJumpFor(p);
  return (
    <PricingCard.Card className="transition-transform duration-500 ease-out-expo hover:-translate-y-1">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-stretch">
        <PricingCard.Header className="mb-0! flex flex-col lg:w-[340px] lg:shrink-0">
          <PricingCard.Plan>
            <PricingCard.PlanName>
              <Icon className="h-[18px] w-[18px]" />
              {p.name}
            </PricingCard.PlanName>
          </PricingCard.Plan>

          <PricingCard.Description className="mb-4 min-h-[32px]">{p.tagline}</PricingCard.Description>

          <PricingCard.Price className="mb-5">
            <span className="pb-1 font-mono text-base text-fg-3">R$</span>
            <PricingCard.MainPrice>{p.monthly}</PricingCard.MainPrice>
            <PricingCard.Period>/mês</PricingCard.Period>
          </PricingCard.Price>

          <div className="mt-auto">
            <PlanButton p={p} />
          </div>
        </PricingCard.Header>

        <PricingCard.Body className="lg:flex-1">
          <div className="flex flex-1 items-center">
            <ul className="grid w-full grid-cols-1 gap-x-6 gap-y-2.5 sm:grid-cols-2 lg:grid-cols-3">
              <PlanFeatureItems p={p} salesJump={salesJump} />
            </ul>
          </div>

          <PricingCard.Separator />

          <p className="-mt-1 font-mono text-[11px] text-fg-3">{p.extraSale}</p>
        </PricingCard.Body>
      </div>
    </PricingCard.Card>
  );
}

export function Pricing() {
  const top = PLANS.filter((p) => p.id !== "master");
  const master = PLANS.find((p) => p.id === "master");

  return (
    <Section id="planos" className="!pt-0">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          backgroundImage: "radial-gradient(rgba(255,255,255,0.08) 0.8px, transparent 0.8px)",
          backgroundSize: "14px 14px",
          maskImage: "radial-gradient(circle at 50% 20%, rgba(0,0,0,1), rgba(0,0,0,0.2) 45%, rgba(0,0,0,0) 72%)",
        }}
      />
      <Container>
        <SectionHeader title="Escolha o plano da sua *operação." lead="Escolha o plano que cabe na sua operação agora." />

        <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {top.map((p, i) => (
            <Reveal key={p.id} delay={i * 0.08} amount={0.15} className="h-full">
              <PlanCard p={p} />
            </Reveal>
          ))}
        </div>

        {master && (
          <Reveal delay={0.24} amount={0.15} className="mt-4 block">
            <MasterCard p={master} />
          </Reveal>
        )}
      </Container>
    </Section>
  );
}

/* =====================================================================
   FAQ
   ===================================================================== */

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <Section id="faq" className="!pt-0">
      <Container className="grid gap-10 lg:grid-cols-[1fr_1.4fr]">
        <div>
          <SplitWords text="Perguntas *frequentes." className="display text-4xl sm:text-5xl" />
          <Reveal delay={0.1}>
            <p className="mt-6 max-w-sm text-fg-2">O que quem está entrando agora costuma perguntar.</p>
          </Reveal>
        </div>
        <Reveal amount={0.1}>
          <div className="divide-y divide-line rounded-2xl border border-line">
            {FAQ.map((f, i) => {
              const isOpen = open === i;
              return (
                <div key={f.q}>
                  <button
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between gap-6 px-6 py-5 text-left transition-colors hover:bg-white/[0.02]"
                  >
                    <span className={clsx("text-base font-semibold transition-colors", isOpen ? "text-fg" : "text-fg-2")}>{f.q}</span>
                    <motion.span animate={{ rotate: isOpen ? 45 : 0 }} transition={{ duration: 0.3 }} className={clsx("flex h-7 w-7 shrink-0 items-center justify-center rounded-full border", isOpen ? "border-red bg-red text-white" : "border-line text-fg-3")}>
                      <Plus className="h-3.5 w-3.5" />
                    </motion.span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.45, ease: EASE }}
                        className="overflow-hidden"
                      >
                        <div className="space-y-3 px-6 pb-6 text-sm leading-relaxed text-fg-2">
                          {f.a.map((block) => (
                            <p key={block} className="whitespace-pre-line">
                              {block}
                            </p>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}

/* =====================================================================
   CTA final + Footer
   ===================================================================== */

export function FinalCta() {
  return (
    <Section className="!pt-0">
      <Container>
        <Reveal amount={0.2}>
          <div className="relative overflow-hidden rounded-[2rem] border border-red/30 px-6 py-20 text-center sm:px-12 sm:py-28">
            <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_70%_80%_at_50%_120%,rgba(250,10,21,.5),rgba(131,0,6,.25)_40%,transparent_75%)]" />
            <div className="pointer-events-none absolute inset-0 -z-10 grid-bg opacity-60 [mask-image:radial-gradient(ellipse_60%_70%_at_50%_100%,black,transparent)]" />
            <SplitWords
              text="Quanto mais sua operação cresce, mais dados você precisa *controlar."
              className="display mx-auto max-w-4xl text-balance text-4xl sm:text-5xl lg:text-6xl min-[1921px]:max-w-5xl min-[1921px]:text-7xl"
            />
            <Reveal delay={0.15}>
              <p className="mx-auto mt-6 max-w-2xl text-balance text-lg text-fg-2">
                Não deixe sua operação virar uma coleção de planilhas, abas e números espalhados.{" "}
                <span className="text-fg">Coloque tudo no Cashflow.</span>
              </p>
            </Reveal>
            <Reveal delay={0.25}>
              <div className="mt-10 flex flex-col items-center gap-4">
                <Button href={CTA_PRIMARY_HREF} size="lg">
                  Quero começar agora
                </Button>
              </div>
            </Reveal>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
