"use client";

import { motion, useInView, type Variants } from "motion/react";
import { useRef, type ReactNode } from "react";
import clsx from "clsx";
import { User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useImageOk } from "@/lib/use-image-ok";
import { AntiMetalBlock } from "./anti-metal-button";

/* ---------- Layout ---------- */

export function Container({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={clsx("mx-auto w-full max-w-[1200px] px-5 sm:px-8 min-[1921px]:max-w-[1600px] min-[1921px]:px-12", className)}>{children}</div>;
}

export function Section({
  id,
  className,
  children,
}: {
  id?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className={clsx("relative py-24 sm:py-32 lg:py-40", className)}>
      {children}
    </section>
  );
}

/* ---------- Motion ---------- */

const EASE = [0.16, 1, 0.3, 1] as const;

export function Reveal({
  children,
  delay = 0,
  y = 28,
  className,
  once = true,
  amount = 0.3,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  once?: boolean;
  amount?: number;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y, filter: "blur(6px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once, amount }}
      transition={{ duration: 0.9, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

const wordVariants: Variants = {
  hidden: { y: "110%", opacity: 0, rotateX: -40 },
  show: (i: number) => ({
    y: "0%",
    opacity: 1,
    rotateX: 0,
    transition: { duration: 0.9, delay: 0.05 * i, ease: EASE },
  }),
};

const MOTION_TAGS = { h1: motion.h1, h2: motion.h2, h3: motion.h3, p: motion.p } as const;

/**
 * Revela o texto palavra por palavra. Prefixe uma palavra com * para deixá-la
 * vermelha; use // para quebrar a linha só no desktop e /// para quebrar em
 * qualquer largura.
 */
export function SplitWords({
  text,
  className,
  delay = 0,
  as: Tag = "h2",
}: {
  text: string;
  className?: string;
  delay?: number;
  as?: "h1" | "h2" | "h3" | "p";
}) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const words = text.split(" ");
  const MotionTag = MOTION_TAGS[Tag];
  return (
    <MotionTag ref={ref as never} className={clsx("[perspective:800px]", className)} aria-label={text}>
      {words.map((w, i) => {
        const red = w.startsWith("*");
        const clean = w.replace(/\*/g, "");
        if (clean === "///") return <br key={i} />;
        if (clean === "//") return <br key={i} className="hidden sm:block" />;
        return (
          <span key={i} className="inline-block overflow-hidden pb-[0.08em] -mb-[0.08em] align-bottom">
            <motion.span
              className={clsx("inline-block will-change-transform", red && "text-red")}
              custom={i + delay * 10}
              variants={wordVariants}
              initial="hidden"
              animate={inView ? "show" : "hidden"}
            >
              {clean}
              {i < words.length - 1 ? " " : ""}
            </motion.span>
          </span>
        );
      })}
    </MotionTag>
  );
}

/* ---------- Typography ---------- */

export function Eyebrow({
  children,
  className,
  dot = true,
}: {
  children: ReactNode;
  className?: string;
  /** Sem o ponto o texto vira um bloco simples, então ele pode ser balanceado. */
  dot?: boolean;
}) {
  if (!dot) return <div className={clsx("eyebrow text-balance", className)}>{children}</div>;
  return (
    <div className={clsx("eyebrow flex items-center gap-2", className)}>
      <span className="relative inline-flex h-1.5 w-1.5">
        <span className="absolute inset-0 rounded-full bg-red animate-pulse-dot" />
        <span className="relative h-1.5 w-1.5 rounded-full bg-red" />
      </span>
      {children}
    </div>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  lead,
  align = "center",
  className,
}: {
  eyebrow?: string;
  title: string;
  lead?: string;
  align?: "center" | "left";
  className?: string;
}) {
  return (
    <div className={clsx("max-w-3xl min-[1921px]:max-w-4xl", align === "center" && "mx-auto text-center", className)}>
      {eyebrow && (
        <Reveal>
          <Eyebrow className={align === "center" ? "justify-center" : undefined}>{eyebrow}</Eyebrow>
        </Reveal>
      )}
      <SplitWords
        text={title}
        className={clsx(
          "display text-balance text-4xl sm:text-5xl lg:text-6xl min-[1921px]:text-7xl",
          eyebrow && "mt-5",
        )}
      />
      {lead && (
        <Reveal delay={0.15}>
          <p className="mt-6 text-balance text-base text-fg-2 sm:text-lg leading-relaxed min-[1921px]:text-xl">{lead}</p>
        </Reveal>
      )}
    </div>
  );
}

/* ---------- Button ---------- */

const SIZES = {
  sm: { h: 44, block: 36, text: "text-sm" },
  md: { h: 52, block: 44, text: "text-[15px]" },
  lg: { h: 60, block: 52, text: "text-base" },
} as const;

export function Button({
  href,
  children,
  variant = "primary",
  size = "md",
  className,
}: {
  href: string;
  children: ReactNode;
  variant?: "primary" | "ghost" | "white";
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const external = href.startsWith("http");
  const { h, block, text } = SIZES[size];

  return (
    <Link
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      style={{ height: h, paddingLeft: block + 18, paddingRight: 20 }}
      className={clsx(
        "group/btn relative inline-flex items-center overflow-hidden rounded-xl border font-medium tracking-tight",
        "transition-transform duration-200 active:scale-[0.98]",
        text,
        variant === "primary" &&
          "border-red/60 bg-[linear-gradient(180deg,#8A060D_0%,#570004_100%)] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.22),0_10px_30px_-10px_rgba(212,5,16,0.75)]",
        variant === "ghost" &&
          "border-line-2 bg-[linear-gradient(180deg,rgba(255,255,255,0.06)_0%,rgba(255,255,255,0.02)_100%)] text-fg shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]",
        variant === "white" && "border-black/10 bg-[linear-gradient(180deg,#ffffff_0%,#ededed_100%)] text-[#0a0a0a]",
        className,
      )}
    >
      <span className="relative z-0">{children}</span>
      <AntiMetalBlock
        width={block}
        accentFrom={variant === "ghost" ? "#3a3a3e" : "#FF3B44"}
        accentTo={variant === "ghost" ? "#232326" : "#D40510"}
        dotColor={variant === "ghost" ? "#ffffff" : "#120003"}
      />
    </Link>
  );
}

/* ---------- Social proof ---------- */

/**
 * Overlapping avatars beside a short line. Hovering one slides it aside so the
 * face underneath shows. Missing files fall back to a neutral placeholder —
 * drop real photos in /public/avatars before publishing a recommendation claim.
 */
export function SocialProof({
  text,
  avatars = [],
  align = "center",
  className,
}: {
  text: string;
  avatars?: string[];
  align?: "center" | "left";
  className?: string;
}) {
  const list = avatars.length ? avatars : [null, null, null];
  const left = align === "left";
  return (
    <div
      className={clsx(
        "flex flex-row items-center gap-3 sm:gap-3.5",
        left ? "justify-center sm:justify-start" : "justify-center",
        className
      )}
    >
      <div className="flex pl-3">
        {list.map((src, i) => (
          <Avatar key={i} src={src} z={list.length - i} />
        ))}
      </div>
      <p
        className={clsx(
          "max-w-[17rem] text-sm leading-snug text-fg-2 sm:max-w-[15rem]",
          left ? "text-center sm:text-left" : "text-center"
        )}
      >
        {text}
      </p>
    </div>
  );
}

function Avatar({ src, z }: { src: string | null; z: number }) {
  const ok = useImageOk(src);
  return (
    <span
      style={{ zIndex: z }}
      className="relative -ml-3 flex h-[35px] w-[35px] shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-white/[0.18] to-white/[0.05] ring-2 ring-white/15 transition-transform duration-500 ease-out-expo hover:-translate-x-3"
    >
      {ok && src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt="" className="h-full w-full object-cover" draggable={false} />
      ) : (
        <User className="h-5 w-5 text-white/45" />
      )}
    </span>
  );
}

/* ---------- Brand ---------- */

export function Logo({ className, icon = false }: { className?: string; icon?: boolean }) {
  return icon ? (
    <Image src="/brand/logo-icon.svg" alt="Cashflow" width={40} height={40} className={className} priority />
  ) : (
    <Image
      src="/brand/logo-full.svg"
      alt="Cashflow"
      width={160}
      height={40}
      className={clsx("h-8 w-auto", className)}
      priority
    />
  );
}
