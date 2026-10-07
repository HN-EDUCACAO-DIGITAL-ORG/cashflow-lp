"use client";

import { useState } from "react";
import { Play } from "lucide-react";
import { Button, Container, Eyebrow, Reveal, Section, SplitWords } from "../ui/primitives";
import { CTA_PRIMARY_HREF } from "@/lib/data";

const DEMO_VIDEO_ID = "G7at_p0klTQ";

/**
 * Demonstração em vídeo — player do YouTube na moldura 16:9.
 */
export function VideoDemo() {
  const [playing, setPlaying] = useState(false);

  return (
    <Section className="!pt-0">
      <div className="pointer-events-none absolute inset-x-0 top-[12%] -z-10 h-[520px] bg-[radial-gradient(ellipse_55%_60%_at_50%_50%,rgba(131,0,6,.3),transparent_72%)]" />
      <Container className="text-center">
        <Reveal>
          <Eyebrow dot={false} className="mx-auto max-w-xs text-center sm:max-w-none">
            Veja todas as funcionalidades da Cashflow
          </Eyebrow>
        </Reveal>

        <SplitWords
          text="Transforme suas ofertas bagunçadas em uma operação organizada, rastreada e *lucrativa."
          className="display mx-auto mt-5 max-w-4xl text-balance text-3xl sm:text-4xl lg:text-5xl min-[1921px]:max-w-5xl min-[1921px]:text-6xl"
        />

        <Reveal delay={0.1}>
          <p className="mx-auto mt-6 max-w-2xl text-balance text-base text-fg-2 sm:text-lg">
            Assista à demonstração completa da Cashflow e veja como ela vai te ajudar a gerir múltiplas ofertas com
            eficiência e trackear +99% das suas vendas, garantindo estabilidade, escala e lucro.
          </p>
        </Reveal>

        <Reveal delay={0.18} amount={0.2}>
          <div className="mx-auto mt-12 w-full max-w-4xl min-[1921px]:max-w-5xl">
            <div className="glow-red relative aspect-video w-full overflow-hidden rounded-2xl border border-line-2 bg-[#08080a]">
              {playing ? (
                <iframe
                  className="absolute inset-0 h-full w-full"
                  src={`https://www.youtube-nocookie.com/embed/${DEMO_VIDEO_ID}?autoplay=1&rel=0`}
                  title="Demonstração da Cashflow"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  referrerPolicy="strict-origin-when-cross-origin"
                />
              ) : (
                <button
                  type="button"
                  onClick={() => setPlaying(true)}
                  className="group absolute inset-0 cursor-pointer"
                  aria-label="Reproduzir demonstração da Cashflow"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/video/demo-cover.png"
                    alt="Prévia da demonstração da Cashflow"
                    className="h-full w-full object-cover"
                  />
                  <span className="absolute inset-0 bg-black/25 transition-colors group-hover:bg-black/35" />
                  <span className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-red/50 bg-red/20 text-red backdrop-blur-sm transition-transform group-hover:scale-105 sm:h-20 sm:w-20">
                    <Play className="ml-0.5 h-6 w-6 fill-current sm:h-7 sm:w-7" />
                  </span>
                </button>
              )}
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.24}>
          <div className="mt-10 flex justify-center">
            <Button href={CTA_PRIMARY_HREF} size="lg">
              QUERO GARANTIR MEU ACESSO
            </Button>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
