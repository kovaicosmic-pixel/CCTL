import { useEffect, useRef, useState, type ReactNode } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useMotionValue, useMotionValueEvent, useReducedMotion, useSpring } from "framer-motion";
import { useIsDesktop } from "../hooks/useIsDesktop";
import Hero from "../components/Hero";
import { PhotoPlane } from "../components/lab/PhotoPlane";
import { FrequencyRings, SignalTrace, SignalBackdrop } from "../components/lab/graphics";
import { useSceneProgress } from "../hooks/useSceneProgress";
import CertificatePlate from "../components/CertificatePlate";
import CertificateGallery3D from "../components/CertificateGallery3D";
import Counter from "../components/Counter";
import Spotlight from "../components/motion/Spotlight";
import Magnetic from "../components/motion/Magnetic";
import StylishCarousel from "../components/StylishCarousel";
import ParticleField from "../components/bg/ParticleField";
import GradientOrbs from "../components/bg/GradientOrbs";
import GridBackground from "../components/bg/GridBackground";
import FloatingStandards from "../components/bg/FloatingStandards";
import ClipReveal from "../components/motion/ClipReveal";
import SplitLineReveal from "../components/motion/SplitLineReveal";
import PerspectiveTilt from "../components/motion/PerspectiveTilt";
import { SpringPopContainer, SpringPopItem } from "../components/motion/SpringPop";
import {
  company,
  pillars,
  aboutPillars,
  about,
  whyChooseUs,
  services,
  certifications,
  stats,
  gallery,
  testimonials,
  valueProps,
  clientLogos,
} from "../data/content";

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const range = (p: number, a: number, b: number) => clamp01((p - a) / (b - a));

/* ------------------------------------------------------------------ */
/* Why Choose Us — four photographic windows splitting apart on scroll  */
/* ------------------------------------------------------------------ */

const WINDOWS = [
  {
    code: "01",
    title: whyChooseUs[0].title.match(/\(([^)]+)\)/)?.[1] ?? "CSAC",
    note: whyChooseUs[0].body,
    image: "/images/chamber.webp",
  },
  {
    code: "02",
    title: "EMC Scanner",
    note: whyChooseUs[2].body,
    image: "/images/explore/emc_scanner.webp",
  },
  {
    code: "03",
    title: whyChooseUs[1].title.match(/\(([^)]+)\)/)?.[1] ?? "VSAC",
    note: whyChooseUs[1].body,
    image: "/images/auto.webp",
  },
  {
    code: "04",
    title: "Team of Expertise",
    note: whyChooseUs[3].body,
    image: "/images/about_us.webp",
  },
];

function WhyChooseUsScene() {
  const reducedMotion = useReducedMotion();
  const isDesktop = useIsDesktop();
  const reduced = reducedMotion;
  const { ref, progress } = useSceneProgress<HTMLDivElement>();
  const p = reduced ? 1 : progress;
  const split = range(p, 0.06, 0.5);
  const label = reduced ? 1 : range(p, 0.2, 0.6);
  const shutter = reduced ? 1 : range(p, 0.02, 0.3);

  return (
    <section
      ref={ref}
      className="seam relative"
      style={{ height: reduced ? undefined : isDesktop ? "220vh" : "135vh" }}
      aria-label="Why choose us"
    >
      <div
        className={`vignette z-50 ${reduced ? "relative py-24" : "sticky top-0 flex h-screen flex-col"}`}
      >
        <SignalBackdrop className="pointer-events-none absolute inset-0 z-0 h-full w-full text-cyan-glow/10" />
        {/* measurement ruler — a physical edge the panels are aligned against */}
        {!reduced && (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-24 left-0 hidden w-10 flex-col justify-between lg:flex"
          >
            {Array.from({ length: 13 }).map((_, i) => (
              <span
                key={i}
                className="block h-px bg-line-strong/10"
                style={{ width: i % 4 === 0 ? "2rem" : "1rem" }}
              />
            ))}
          </div>
        )}

        {/* Title lives in the sticky frame, clear of the navigation, and drifts
            up out of the way as the panels split apart. */}
        <div
          className={
            reduced
              ? "mb-10 px-6 sm:px-10 lg:px-16"
              : "scene-safe pointer-events-none relative z-30 px-6 sm:px-10 lg:px-16"
          }
          style={
            reduced
              ? undefined
              : {
                  transform: `translate3d(0, ${lerp(0, -3, split)}vh, 0)`,
                  opacity: 1 - label * 0.75,
                }
          }
        >
          <p className="section-eyebrow" style={{ color: "var(--color-cyan-glow)" }}>
            Why choose us
          </p>
          <span aria-hidden className="accent-rule mt-3" />
          <h2 className="display-xl mt-4 max-w-[16ch] text-[9vw] leading-none lg:text-[5.6vw]">
            A facility built for <span className="text-cyan">precision</span>
          </h2>
        </div>

        <div className={`stage relative w-full ${reduced ? "" : "flex-1 min-h-[48rem] sm:min-h-[56rem] lg:min-h-0"}`}>
          <div
            className={`grid grid-cols-2 grid-rows-2 lg:grid-cols-4 lg:grid-rows-1 ${reduced ? "gap-3" : "absolute inset-0"}`}
          >
            {WINDOWS.map((w, i) => {
              const dir = i % 2 === 0 ? -1 : 1;
              const open = reduced ? 1 : range(shutter, i * 0.12, 0.5 + i * 0.12);
              return (
                <div
                  key={w.title}
                  className="group chroma relative min-h-0 aspect-auto overflow-hidden"
                  style={
                    reduced
                      ? undefined
                      : {
                          transform: `translate3d(${dir * split * 1.6}%, ${(i - 1.5) * split * 2.2}%, 0) scale(${lerp(1.001, 0.94, split)})`,
                          clipPath: `inset(${lerp(50, 0, open)}% 0% ${lerp(50, 0, open)}% 0%)`,
                        }
                  }
                >
                  <div
                    className="h-full w-full transition-transform duration-[900ms] ease-out will-change-transform group-hover:scale-[1.04]"
                    style={reduced ? undefined : { transform: `scale(${lerp(1.14, 1, open)})` }}
                  >
                    <PhotoPlane
                      depth={i % 2 ? "mid" : "near"}
                      src={w.image}
                      alt={`${w.title} — laboratory environment`}
                      className="h-full w-full"
                    />
                  </div>
                  {/* interference field, only on the panel under the cursor */}
                  <span
                    aria-hidden
                    className="scanfield pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  />
                  <div
                    className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#0a1220]/90 via-[#0a1220]/50 to-transparent p-3 pt-14 sm:p-6 sm:pt-16 lg:p-8 lg:pt-20"
                    style={{ opacity: label }}
                  >
                    <h3 className="font-display text-xl font-extrabold uppercase leading-none tracking-[-0.03em] text-white transition-transform duration-500 ease-out group-hover:-translate-y-1 sm:text-2xl lg:text-3xl">
                      {w.title}
                    </h3>
                    <p className="mt-2 max-w-[32ch] text-[0.72rem] font-semibold leading-[1.45] text-white/85 sm:mt-3 sm:text-[0.78rem] sm:leading-[1.55] lg:text-[0.8125rem] lg:leading-[1.6]">
                      {w.note}
                    </p>
                    <span className="mt-3 block h-[2px] w-20 origin-left scale-x-0 bg-cyan-glow transition-transform duration-700 group-hover:scale-x-100 sm:mt-5" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* What we deliver — pinned horizontal rail, one panel per pillar       */
/* ------------------------------------------------------------------ */

function DeliverScene() {
  const reducedMotion = useReducedMotion();
  const isDesktop = useIsDesktop(1024);
  const reduced = reducedMotion || !isDesktop;
  const { ref, progress: rawProgress } = useSceneProgress<HTMLDivElement>();
  /* Raw scroll progress updates in discrete per-frame jumps, which is what made the
     label crossfade feel like a jump-cut instead of a blend. Spring-smooth it (same
     technique already used for the About page's scroll scenes) before anything below
     derives motion from it. useSpring only tracks a *MotionValue* source reactively,
     not a plain number that changes across renders, so the raw number is bridged into
     one first. */
  const rawProgressMV = useMotionValue(0);
  useEffect(() => {
    rawProgressMV.set(rawProgress);
  }, [rawProgress, rawProgressMV]);
  const smoothProgress = useSpring(rawProgressMV, { stiffness: 170, damping: 26, mass: 0.4 });
  const [progress, setProgress] = useState(0);
  useMotionValueEvent(smoothProgress, "change", (latest) => setProgress(latest));
  const p = reduced ? 0 : progress;

  /* The big centred "What we deliver" measures itself against the small blue label's
     real on-screen box, then morphs onto it — one element becoming the other, not two
     independent motions. Measured via refs (not guessed offsets) so it lands exactly,
     on any viewport. */
  const bigRef = useRef<HTMLSpanElement | null>(null);
  const labelRef = useRef<HTMLParagraphElement | null>(null);
  const [morph, setMorph] = useState({ dx: 0, dy: 0, sx: 1, sy: 1 });

  useEffect(() => {
    if (reduced) return;
    const measure = () => {
      const bigEl = bigRef.current;
      const labelEl = labelRef.current;
      if (!bigEl || !labelEl) return;
      const bigRect = bigEl.getBoundingClientRect();
      const labelRect = labelEl.getBoundingClientRect();
      if (bigRect.width === 0 || bigRect.height === 0) return;
      setMorph({
        dx: labelRect.left - bigRect.left,
        dy: labelRect.top - bigRect.top,
        sx: labelRect.width / bigRect.width,
        sy: labelRect.height / bigRect.height,
      });
    };
    measure();
    window.addEventListener("resize", measure);
    document.fonts?.ready?.then(measure).catch(() => {});
    return () => window.removeEventListener("resize", measure);
  }, [reduced]);

  /* Sequenced, not overlapping, so the big title visibly becomes the small label
     instead of the two existing side by side with no connection between them:
     1) morph (translate+scale) lands the big title exactly on the label's box
     2) only once it has landed does the crossfade swap opacity between them
     3) the rule draws in as that crossfade finishes
     4) the rail starts moving only once the handoff is fully done */
  const morphP = range(p, 0.01, 0.05);
  const swapP = range(p, 0.05, 0.065);
  const ruleP = range(p, 0.065, 0.08);

  const shift = lerp(100, -(pillars.length - 1) * 100, range(p, 0.08, 0.85));
  const activeIndex = Math.min(
    pillars.length - 1,
    Math.round(range(p, 0.08, 0.85) * (pillars.length - 1)),
  );

  if (reduced) {
    return (
      <section
        className="glow-field section-y relative overflow-hidden"
        aria-label="What we deliver"
      >
        <div className="container-x">
          <p className="section-eyebrow" style={{ color: "var(--color-cyan-glow)" }}>
            What we deliver
          </p>
          <span aria-hidden className="accent-rule mt-3" />
        </div>
        <div className="container-x grid-gutter mt-16 grid md:grid-cols-3">
          {pillars.map((w, i) => (
            <div key={w.title} className="group relative">
              {/* Animated gradient border wrapper */}
              <div className="absolute -inset-[1px] rounded-[1.25rem] bg-gradient-to-r from-cyan-glow/30 via-violet-glow/20 to-magenta-glow/10 opacity-0 blur-[2px] transition-opacity duration-500 group-hover:opacity-100" />
              <div className="glass-card relative p-8 beam-line hover-glow">
                {/* Top gradient accent bar */}
                <div className="absolute inset-x-0 top-0 h-[2px] rounded-t-[1.25rem] bg-gradient-to-r from-transparent via-cyan-glow/60 to-transparent opacity-60" />
                <div className="flex items-start gap-5">
                  <span className="icon-chip shrink-0">
                    <span className="num-chip">{String(i + 1).padStart(2, "0")}</span>
                  </span>
                  <div>
                    <h3 className="t-h3 text-xl uppercase tracking-tight">{w.title}</h3>
                    <p className="t-body mt-3 font-medium leading-relaxed text-ink-300">{w.body}</p>
                  </div>
                </div>
                {/* Bottom glow line on hover */}
                <div className="absolute inset-x-6 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-glow/40 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section
      ref={ref}
      className="seam relative"
      style={{ height: "560vh" }}
      aria-label="What we deliver"
    >
      <div className="sticky top-0 z-50 flex h-screen flex-col">
        {/* the grid itself drifts sideways against the rail — parallax floor */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-[-6%] bg-grid opacity-30"
          style={{ transform: `translate3d(${shift * 0.12}vw, 0, 0)` }}
        />
        <SignalTrace className="pointer-events-none absolute inset-x-0 top-[22%] h-24 w-full text-violet-glow/25" />

        {/* Pinned right below the nav-clearance padding, in normal flow, so the label
            can never end up under the navbar no matter how tall the rail below gets. */}
        <div className="scene-safe relative flex items-start justify-between px-6 sm:px-10 lg:px-16">
          <div>
            {/* Not .section-eyebrow: this is the morph's landing target, and its exact
                size is what the animation is tuned against — sharing the sitewide
                eyebrow size would resize the target and throw the whole motion off.
                The rule is a plain sibling, not part of the measured element, so it
                doesn't affect that measurement — it draws in once the label crossfade
                has settled, not during it. */}
            <p
              ref={labelRef}
              className="meta"
              style={{ color: "var(--color-cyan-glow)", opacity: swapP }}
            >
              What we deliver
            </p>
            <span aria-hidden className="accent-rule mt-3" style={{ opacity: ruleP }} />
          </div>
          <p
            className="meta"
            style={{ color: "var(--color-cyan-glow)" }}
          >{`0${activeIndex + 1} / 0${pillars.length}`}</p>
        </div>

        {/* Everything below the label centres within the remaining space, instead of
            the whole group (label included) centering as one block — that was what
            let an oversized rail push the label up above the nav-clearance padding. */}
        <div className="relative flex min-h-0 flex-1 flex-col justify-center">
          {/* The big centred title morphs onto the label above: translate + scale it
              exactly onto the label's measured box, then a near-instant crossfade at
              that matched position completes the swap — reads as one element becoming
              the other, not two things moving independently. */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center"
            style={{ opacity: 1 - swapP }}
          >
            <span
              ref={bigRef}
              className="display-xl block text-[13vw] leading-[0.85] text-ink-100 lg:text-[7vw]"
              style={{
                transformOrigin: "0 0",
                transform: `translate3d(${lerp(0, morph.dx, morphP)}px, ${lerp(0, morph.dy, morphP)}px, 0) scale(${lerp(1, morph.sx, morphP)}, ${lerp(1, morph.sy, morphP)})`,
              }}
            >
              What we deliver
            </span>
          </div>

          <div
            className="rail-3d relative mt-10 flex w-full will-change-transform"
            style={{
              transform: `translate3d(${shift}vw, 0, 0)`,
              transition: "transform 120ms linear",
            }}
          >
            {pillars.map((w, i) => {
              /* -1 → panel is off to the left, 0 → centred, 1 → off to the right */
              const offset = shift / 100 + i;
              const focus = clamp01(1 - Math.abs(offset) * 1.4);
              return (
                <article
                  key={w.title}
                  className="flex w-screen shrink-0 flex-col justify-center px-6 will-change-transform sm:px-10 lg:px-16"
                  style={{
                    opacity: lerp(0.18, 1, focus),
                    transform: `rotateY(${offset * -16}deg) translateZ(${lerp(-320, 0, focus)}px) scale(${lerp(0.9, 1, focus)})`,
                    filter: `blur(${lerp(5, 0, focus)}px)`,
                  }}
                >
                  <span
                    className="block text-[22vw] font-extrabold leading-[0.75] lg:text-[14vw]"
                    style={{
                      transform: `translate3d(${offset * -6}vw, 0, 0)`,
                      color: "rgba(26, 108, 245, 0.12)",
                      fontFamily: "var(--font-display)",
                      letterSpacing: "-0.05em",
                    }}
                  >
                    {`0${i + 1}`}
                  </span>
                  <h3
                    className="font-display mt-8 max-w-[18ch] text-3xl font-extrabold uppercase leading-[0.92] tracking-[-0.04em] text-ink-100 sm:text-5xl lg:text-[4rem]"
                    style={{ transform: `translate3d(${offset * 3}vw, 0, 0)` }}
                  >
                    {w.title}
                  </h3>
                  <p
                    className="t-lead mt-8 max-w-xl font-semibold text-ink-300"
                    style={{ transform: `translate3d(${offset * 6}vw, 0, 0)` }}
                  >
                    {w.body}
                  </p>
                </article>
              );
            })}
          </div>

          <div className="relative mt-14 flex items-center gap-3 px-6 sm:px-10 lg:px-16">
            {pillars.map((w, i) => (
              <span
                key={w.title}
                className="h-[2px] flex-1 origin-left rounded-full"
                style={{
                  transform: `scaleY(${i === activeIndex ? 1.5 : 1})`,
                  backgroundColor:
                    i === activeIndex ? "var(--color-cyan-glow)" : "rgba(255, 255, 255, 0.12)",
                  boxShadow: i === activeIndex ? "0 0 8px rgba(26, 108, 245, 0.4)" : "none",
                  transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* About CCTL — background plane + staggered pillar reveal              */
/* ------------------------------------------------------------------ */

function AboutBlurbScene() {
  const reducedMotion = useReducedMotion();
  const isDesktop = useIsDesktop(1024);
  const reduced = reducedMotion || !isDesktop;
  const { ref, progress } = useSceneProgress<HTMLDivElement>();
  const p = reduced ? 0.5 : progress;

  return (
    <section
      ref={ref}
      className="seam relative"
      style={{ height: reduced ? undefined : "170vh" }}
      aria-label="About CCTL"
    >
      <div       className={`vignette z-50 ${reduced ? "relative py-28" : "sticky top-0 min-h-screen"}`}>
        {!reduced && (
          <div
            className="absolute inset-0"
            style={{ transform: `translate3d(0, ${lerp(-6, 6, p)}%, 0) scale(1.16)` }}
          >
            <PhotoPlane
              depth="far"
              src="/images/gallery1.webp"
              alt="Broadband amplifier rack and antenna mast"
              code="INSTRUMENTATION / RACK 04"
              className="h-full w-full"
            />
          </div>
        )}
        {!reduced && <div className="pointer-events-none absolute inset-0 bg-space-950/80" />}
        {/* the backdrop reads as a live capture, not a still: a faint raster plus
            one slow interference beam crossing it. */}
        {!reduced && (
          <div
            aria-hidden
            className="scanfield pointer-events-none absolute inset-0 overflow-hidden opacity-70"
          >
            <span className="scanbeam" />
          </div>
        )}

        {/* signal field sits behind the copy, low in the frame */}
        {!reduced && (
          <SignalTrace className="pointer-events-none absolute inset-x-0 bottom-[8%] z-0 h-40 w-[120%] -translate-x-[10%] text-violet-glow/25" />
        )}

        {/* Not justify-center: the whole block (eyebrow included) was being centered
            as one tall group, which — same bug as Trusted by — could push the eyebrow
            up under the navbar while leaving unused space below the pillars. scene-safe
            gives the eyebrow guaranteed top clearance instead. Top-anchoring (rather
            than centering) means this stack can now run long on short viewports and
            land the pillars inside the section's own bottom "seam" fade (z-40) —
            pb-[14vh] alone assumed the content would always fit above it, which broke
            here. z-50 makes that geometry-proof: content simply paints above the fade
            no matter how tall the stack gets. */}
        <div
          className={`${reduced ? "relative" : "scene-safe relative z-50 flex min-h-screen flex-col justify-start pb-10"} px-6 sm:px-10 lg:px-16`}
        >
          <p
            className="section-eyebrow"
            style={{
              color: "var(--color-cyan-glow)",
              textShadow:
                "0 1px 14px rgba(7, 13, 24, 0.95), 0 1px 3px rgba(7, 13, 24, 0.95)",
            }}
          >
            About CCTL
          </p>
          <span aria-hidden className="accent-rule mt-2" />
          <h2 className="display-xl mt-4 text-[9vw] leading-[0.84] text-ink-100 lg:text-[5.8vw]">
            <span
              className="block"
              style={
                reduced
                  ? undefined
                  : { transform: `translate3d(${lerp(-3, 0, range(p, 0, 0.5))}vw, 0, 0)` }
              }
            >
              Where cosmic meets quality,
            </span>
            <span
              className="text-outline block pl-[8vw]"
              style={
                reduced
                  ? undefined
                  : { transform: `translate3d(${lerp(5, 0, range(p, 0.02, 0.5))}vw, 0, 0)` }
              }
            >
              pioneering EMC testing
            </span>
          </h2>
          <p className="t-lead mt-6 max-w-5xl font-semibold leading-[1.85] text-ink-300">
            {about.intro}
          </p>

          <dl className="mt-10 grid max-w-none grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-2 lg:grid-cols-4">
            {aboutPillars.map((s, i) => (
              <div
                key={s.title}
                className="group relative rounded-xl border border-white/[0.06] bg-white/[0.03] p-5 backdrop-blur-sm transition-all duration-500 hover:border-cyan-glow/30 hover:bg-white/[0.06]"
                style={
                  reduced
                    ? undefined
                    : {
                        transform: `translate3d(0, ${lerp(28, 0, range(p, 0.02 + i * 0.04, 0.45 + i * 0.04))}px, 0)`,
                        opacity: range(p, 0.02 + i * 0.04, 0.4 + i * 0.04),
                      }
                }
              >
                {/* Top gradient accent */}
                <div className="absolute inset-x-0 top-0 h-[1px] rounded-t-xl bg-gradient-to-r from-transparent via-cyan-glow/40 to-transparent opacity-60 transition-opacity duration-500 group-hover:opacity-100" />
                <span className="glow-dot mb-4 block" />
                <dt className="font-display text-base font-extrabold uppercase tracking-[-0.02em] text-ink-100">
                  {s.title}
                </dt>
                <dd className="t-small mt-3 font-medium text-ink-300">{s.body}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Trusted by — continuous auto-scrolling logo marquee + vision / mission / values */
/* ------------------------------------------------------------------ */

function TrustScene() {
  const reducedMotion = useReducedMotion();
  const isDesktop = useIsDesktop(1024);
  const reduced = reducedMotion || !isDesktop;
  const { ref, progress } = useSceneProgress<HTMLDivElement>();
  const p = reduced ? 0.5 : progress;

  const principles = [
    { label: "Vision", body: about.vision },
    { label: "Mission", body: about.mission },
    ...about.values.map((v) => ({ label: v.title, body: v.body })),
  ];
  const principlesOpacity = reduced ? 1 : clamp01(range(p, 0.05, 0.45));

  return (
    <section
      ref={ref}
      className="relative"
      style={{ height: reduced ? undefined : "180vh" }}
      aria-label="Trusted by"
    >
      <div
        className={`overflow-clip z-50 ${reduced ? "relative py-24" : "sticky top-0 flex min-h-screen flex-col"}`}
      >
        <FrequencyRings className="pointer-events-none absolute left-1/2 top-1/2 z-0 h-[110vh] w-[110vh] -translate-x-1/2 -translate-y-1/2 text-cyan-glow/10" />
        {/* Pinned right below the nav-clearance padding, in normal flow — same fix as
            the About CCTL pillars: the label was previously part of a `justify-center`
            group with the marquees + principles grid, and that tall content pushed the
            whole block (label included) up under the navbar on shorter viewports. */}
        <div className="scene-safe relative px-6 sm:px-10 lg:px-16">
          <p className="section-eyebrow" style={{ color: "var(--color-cyan-glow)" }}>
            Trusted by
          </p>
          <span aria-hidden className="accent-rule mt-2" />
          <h2 className="t-h1 mt-5 max-w-3xl uppercase">
            We&rsquo;re Grateful To Work With{" "}
            <span className="text-cyan">Incredible Clients</span>
          </h2>
        </div>

        {/* Everything below stacks in the remaining space instead of being crushed
            into the same centered group as the label above. Not vertically centered
            here on purpose: the marquees + principles grid together are taller than
            the space left once the (up to 3-line) heading is accounted for, and
            centering oversized content overflows both directions — which is exactly
            what pushed the marquees up into the heading. z-50 (same fix as About
            CCTL's pillars): now that this stack is top-anchored instead of centered,
            it can run long enough on short viewports to land inside the section's own
            bottom "seam" fade (z-40) — sitting above it keeps the grid legible either
            way. */}
        {/* Tighter rhythm than a typical section on purpose: this whole block (rails +
            principles) has to fit in whatever space is left below the (up to 3-line)
            heading, inside a pinned viewport with no scroll fallback — a normal
            section's spacing runs taller than short viewports can hold. */}
        <div
          className={
            reduced
              ? undefined
              : "relative z-50 flex min-h-0 flex-1 flex-col justify-start gap-8 pt-4"
          }
        >
          {/* One continuous auto-scrolling logo rail — still cycles through every
              client, just in the height of one row instead of two, since two rows
              was what pushed the principles grid past short viewports. */}
          <div className="relative mt-2">
            <div className="edge-fade overflow-hidden">
              <div className="marquee-track">
                {[...clientLogos, ...clientLogos].map((src, i) => (
                  <img
                    key={`logo-${i}`}
                    src={src}
                    alt={`Client ${(i % clientLogos.length) + 1}`}
                    className="mx-4 h-14 w-24 shrink-0 rounded-xl border border-white/10 bg-white/[0.06] object-contain p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_1px_2px_rgba(0,0,0,0.2),0_8px_20px_-14px_rgba(0,0,0,0.4)] sm:h-16 sm:w-32"
                    loading="lazy"
                    decoding="async"
                    width={128}
                    height={64}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="relative mt-10 grid gap-x-10 gap-y-8 px-6 sm:grid-cols-2 sm:px-10 lg:grid-cols-4 lg:px-16">
            {principles.map((v, i) => (
              <div
                key={v.label}
                className="group relative rounded-xl border border-white/[0.05] bg-white/[0.02] p-5 backdrop-blur-sm transition-all duration-500 hover:border-cyan-glow/30 hover:bg-white/[0.05]"
                style={
                  reduced
                    ? undefined
                    : {
                        transform: `translate3d(0, ${lerp(40, 0, range(p, 0.05 + i * 0.04, 0.5 + i * 0.04))}px, 0)`,
                        opacity: principlesOpacity,
                      }
                }
              >
                <div className="absolute inset-x-0 top-0 h-[1px] rounded-t-xl bg-gradient-to-r from-transparent via-cyan-glow/30 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <span className="glow-dot mb-3 block" />
                <p className="font-mono text-[0.7rem] font-bold uppercase tracking-[0.2em] text-cyan-glow">{v.label}</p>
                <p className="t-body mt-3 font-medium text-ink-300">{v.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Services — five domain photographs on a z-depth stack                */
/* ------------------------------------------------------------------ */

function DomainStack() {
  const reducedMotion = useReducedMotion();
  const isDesktop = useIsDesktop(1024);
  const reduced = reducedMotion || !isDesktop;
  const navigate = useNavigate();
  const activeCardRef = useRef<HTMLAnchorElement | null>(null);
  const { ref, progress } = useSceneProgress<HTMLDivElement>();
  const n = services.length;
  /* Planes overlap rather than hand off cleanly: STEP < 1 means the next plane
     is already climbing out of the depth while the current one clears the lens,
     so the frame is never empty. BIAS holds plane 01 on screen at scene entry. */
  const STEP = 0.72;
  const BIAS = 0.42;
  /* the tail is short on purpose: the last plane must come to rest in the lens
     rather than fly past it, otherwise the scene ends on an empty frame. */
  const P = (reduced ? 1 : progress) * (STEP * (n - 1) + 0.38);
  const active = Math.min(n - 1, Math.max(0, Math.round((P + BIAS - 0.5) / STEP)));

  return (
    <section
      id="services-teaser"
      ref={ref}
      className="seam relative"
      style={{ height: reduced ? undefined : "300vh" }}
      aria-label="Services"
    >
      <div
        className={`stage vignette z-50 ${reduced ? "relative py-28" : "sticky top-0 h-screen"}`}
      >
        <div
          className="pointer-events-none absolute inset-0 bg-grid opacity-40"
          aria-hidden="true"
        />

        {/* the active domain name, oversized and hollow, sliding behind the stack */}
        {!reduced && (
          <span
            aria-hidden
            className="display-xl text-outline pointer-events-none absolute left-1/2 top-1/2 z-0 -translate-y-1/2 whitespace-nowrap text-[18vw] leading-none opacity-25"
            style={{ transform: `translate3d(-${20 + P * 14}%, -50%, 0)` }}
          >
            {services[active].name.replace(" Domain", "")}
          </span>
        )}

        <div
          className={`z-30 max-w-md ${reduced ? "relative mb-16 px-6 sm:px-10 lg:px-16" : "scene-safe absolute left-6 top-0 sm:left-10 lg:left-16"}`}
        >
          <p className="section-eyebrow" style={{ color: "var(--color-cyan-glow)" }}>
            Services
          </p>
          <span aria-hidden className="accent-rule mt-3" />
          <h2 className="display-xl mt-4 text-[10vw] leading-[0.82] text-ink-100 lg:text-[5.8vw]">
            Five domains,
            <br />
            <span className="text-outline">one facility</span>
          </h2>
          <p className="t-body mt-6 max-w-xs font-semibold text-ink-300">
            Cosmic Compliance Test Lab offers advanced EMC testing solutions tailored to every
            sector we serve.
          </p>
        </div>

        {/* right-hand index readout — a physical channel selector for the stack */}
        {!reduced && (
          <div className="absolute right-6 top-1/2 z-30 hidden -translate-y-1/2 flex-col items-end gap-4 sm:right-10 lg:right-16 lg:flex">
            {services.map((d, i) => (
              <div
                key={d.slug}
                className="flex items-center gap-3 transition-opacity duration-500"
                style={{ opacity: i === active ? 1 : 0.3 }}
              >
                <span
                  className="meta"
                  style={{ color: i === active ? "var(--color-cyan-glow)" : undefined }}
                >
                  {d.name.replace(" Domain", "")}
                </span>
                <span
                  className="block h-px w-[0.75rem] origin-left bg-cyan-glow transition-transform duration-500"
                  style={{ transform: i === active ? "scaleX(3.3333)" : "scaleX(1)" }}
                />
              </div>
            ))}
          </div>
        )}

        <div
          className={
            reduced ? "grid gap-6 px-6 sm:grid-cols-2 sm:px-10 lg:px-16" : "absolute inset-0"
          }
          style={reduced ? undefined : { transformStyle: "preserve-3d", perspective: "1400px" }}
          onClick={
            reduced
              ? undefined
              : (e) => {
                  /* Chromium's real hit-testing for a click inside this nested preserve-3d/
                     perspective stack resolves to this wrapping div rather than the visually
                     topmost card — a genuine browser quirk, not just an artifact of automated
                     testing, so `<a>` alone never receives the click. Routing the click here
                     and checking it against the focused card's own on-screen rect (which is
                     still accurate) sidesteps that entirely. */
                  const rect = activeCardRef.current?.getBoundingClientRect();
                  if (!rect) return;
                  if (
                    e.clientX >= rect.left &&
                    e.clientX <= rect.right &&
                    e.clientY >= rect.top &&
                    e.clientY <= rect.bottom
                  ) {
                    navigate({ to: "/services/$slug", params: { slug: services[active].slug } });
                  }
                }
          }
        >
          {services.map((d, i) => {
            const local = reduced ? 1 : clamp01(BIAS + P - i * STEP);
            const z = lerp(-1500, 300, local);
            const opacity = reduced ? 1 : range(local, 0, 0.1) * (1 - range(local, 0.84, 1));
            return (
              <a
                key={d.slug}
                ref={i === active ? activeCardRef : undefined}
                href={`/services/${d.slug}`}
                className={`group chroma ${reduced ? "relative block aspect-[4/3]" : "absolute left-1/2 top-1/2 h-[56vh] w-[86vw] lg:h-[62vh] lg:w-[54vw]"}`}
                style={
                  reduced
                    ? undefined
                    : {
                        transform: `translate3d(-50%, -50%, 0) translateZ(${z}px) rotateY(${lerp(16, -3, local)}deg) rotateX(${lerp(7, 0, local)}deg)`,
                        opacity,
                        filter: `blur(${lerp(8, 0, range(local, 0, 0.5))}px)`,
                        zIndex: 10 + i,
                        pointerEvents: opacity > 0.7 ? "auto" : "none",
                      }
                }
              >
                <PhotoPlane
                  depth={i % 2 ? "mid" : "near"}
                  src={d.image}
                  alt={`${d.name} test setup`}
                  code={`0${i + 1} / ${d.name}`}
                  className="h-full w-full shadow-[0_60px_120px_-40px_rgba(0,0,0,0.5)]"
                />
                {/* signal ring-in on the plane closest to the lens */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 border border-cyan-glow/0 transition-colors duration-500 group-hover:border-cyan-glow/40"
                />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between bg-gradient-to-t from-[#0a1220]/90 via-[#0a1220]/40 to-transparent p-6 pt-32 sm:p-10 sm:pt-36">
                  <div>
                    <h3 className="font-display text-3xl font-extrabold uppercase leading-none tracking-[-0.03em] text-white sm:text-5xl">
                      {d.name}
                    </h3>
                    <p className="mt-3 max-w-sm text-[0.8125rem] font-semibold leading-[1.6] text-white/85">
                      {d.tagline}
                    </p>
                  </div>
                  <p className="meta hidden translate-x-0 text-white/60 transition-all duration-500 group-hover:translate-x-2 group-hover:text-cyan-glow sm:block">
                    View &rarr;
                  </p>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Accreditations + counters + standards ticker                        */
/* ------------------------------------------------------------------ */

const STANDARDS = ["CISPR 25", "MIL-STD-461", "EN 50121", "ISO/IEC 17025"];

function AccreditationScene() {
  const reducedMotion = useReducedMotion();
  const isDesktop = useIsDesktop(1024);
  const reduced = reducedMotion || !isDesktop;
  const { ref, progress } = useSceneProgress<HTMLDivElement>();
  const p = reduced ? 0 : progress;

  return (
    <section
      ref={ref}
      className="glow-field section-y relative overflow-hidden"
      aria-label="Accreditations"
    >
      <SignalBackdrop className="pointer-events-none absolute inset-0 z-0 h-full w-full text-cyan-glow/10" />
      <div className="container-x relative flex flex-wrap items-end justify-between gap-8">
        <div>
          <p className="section-eyebrow" style={{ color: "var(--color-cyan-glow)" }}>
            Accreditations
          </p>
          <span aria-hidden className="accent-rule mt-3" />
          <h2 className="t-h1 mt-6 max-w-3xl uppercase">
            Certified credentials you can <span className="text-cyan">trust</span>
          </h2>
        </div>
      </div>

      {/* 3D hover gallery for certificates */}
      <div className="container-x mt-16">
        <CertificateGallery3D
          items={certifications}
          itemHeight={400}
          gap={10}
          perspective={1000}
          hoverScale={1.04}
          transitionDuration={0.5}
        />
      </div>

      <div className="container-x mt-28 grid gap-8 sm:grid-cols-3">
        {stats.map((s, i) => (
          <ClipReveal key={s.label} direction={i === 0 ? "left" : i === 1 ? "bottom" : "right"} delay={i * 0.15} duration={0.8}>
            <div className="group relative rounded-2xl border border-white/[0.06] bg-white/[0.03] p-8 text-center backdrop-blur-sm transition-all duration-500 hover:border-cyan-glow/25 hover:bg-white/[0.05]">
              {/* Glow accent at top */}
              <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-glow/50 to-transparent opacity-50 transition-opacity group-hover:opacity-100" />
              <span className="display-xl text-outline pointer-events-none absolute -right-2 -top-4 text-[5rem] leading-none opacity-[0.06] sm:text-[7rem]">
                {`0${i + 1}`}
              </span>
              <p className="figure-accent relative text-5xl leading-none sm:text-7xl">
                <Counter to={s.value} />
              </p>
              <p className="relative mt-5 text-[0.75rem] font-bold uppercase tracking-[0.2em] text-ink-500">{s.label}</p>
              <span className="glow-dot mx-auto mt-5" />
            </div>
          </ClipReveal>
        ))}
      </div>

      <div className="edge-fade mt-24 overflow-hidden border-y border-line-strong/8 py-7">
        <div
          className="flex gap-10 whitespace-nowrap"
          style={{ transform: `translate3d(${lerp(0, -30, p)}%, 0, 0)` }}
        >
          {[...STANDARDS, ...STANDARDS, ...STANDARDS].map((s, i) => (
            <span key={i} className="meta">
              {s} &middot;
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Gallery — Stylish fan-out carousel                                   */
/* ------------------------------------------------------------------ */

const EXPLORE_ITEMS = [
  { src: encodeURI("/images/explore/RE102 setup.webp"), title: "RE102 Setup", width: 960, height: 540 },
  { src: encodeURI("/images/explore/RE102 setup (2).webp"), title: "Functional Setup", width: 960, height: 540 },
  { src: encodeURI("/images/explore/Commercialtesting.webp"), title: "Commercial Testing", width: 960, height: 540 },
  { src: encodeURI("/images/explore/Picture1.jpg"), title: "CSAC Chamber", width: 1386, height: 780 },
  { src: encodeURI("/images/explore/media.webp"), title: "Mil-Aero setup", width: 1448, height: 1086 },
  { src: encodeURI("/images/explore/Labcivil.webp"), title: "Lab Overview", width: 1536, height: 1024 },
  { src: encodeURI("/images/explore/RE102.webp"), title: "RE102 Test setup", width: 960, height: 540 },
  { src: encodeURI("/images/explore/emc_scanner.webp"), title: "EMC Scanner", width: 960, height: 540 },
  { src: encodeURI("/images/explore/control_room.webp"), title: "Control Room", width: 2000, height: 1125 },
  { src: encodeURI("/images/explore/civilLab.webp"), title: "Civil Lab", width: 1537, height: 1023 },
  { src: encodeURI("/images/explore/BCI_test_setup.webp"), title: "BCI Test Setup", width: 960, height: 540 },
  { src: encodeURI("/images/explore/RF_testing.webp"), title: "RF Testing", width: 960, height: 720 },
  { src: encodeURI("/images/explore/BCI-setup.webp"), title: "BCI Setup", width: 960, height: 540 },
];

function FacilityScene() {
  return (
    <section className="relative pb-16 pt-12 lg:pb-24 lg:pt-16" aria-label="Gallery">
      <SignalBackdrop className="pointer-events-none absolute inset-0 z-0 h-full w-full text-cyan-glow/10" />
      <div className="container-x relative text-center">
        <p className="section-eyebrow" style={{ color: "var(--color-cyan-glow)" }}>
          Gallery
        </p>
        <span aria-hidden className="accent-rule mx-auto mt-3" />
        <SplitLineReveal
          lines={["Explore our", "laboratory"]}
          className="display-xl mt-5 text-[9vw] leading-[0.88] lg:text-[5.2vw]"
          stagger={0.18}
          duration={0.9}
        />
        <p className="t-lead mx-auto mt-7 max-w-xl">
          From our anechoic chambers to our engineering team, every part of CCTL is built around
          getting your product certified right, the first time.
        </p>
      </div>
      <div className="mt-14">
        <StylishCarousel
          items={EXPLORE_ITEMS}
          initialIndex={2}
          showArrows
          showDots
          clickToNavigate
          autoPlay={4000}
          slideSize="clamp(240px, 80vmin, 480px)"
          rotationDegrees={22}
          inactiveScale={0.55}
          yOffsetPercent={42}
          borderRadius="1.25rem"
        />
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Testimonials — pinned cinematic crossfade over chamber photography   */
/* ------------------------------------------------------------------ */

function TestimonialScene() {
  const reduced = useReducedMotion();
  const { ref, progress } = useSceneProgress<HTMLDivElement>();
  const p = reduced ? 0 : progress;

  if (reduced) {
    return (
      <section className="section-y container-x relative" aria-label="Testimonials">
        <p className="section-eyebrow" style={{ color: "var(--color-cyan-glow)" }}>
          Testimonials
        </p>
        <span aria-hidden className="accent-rule mt-3" />
        <h2 className="t-h1 mt-6 uppercase">What our clients say</h2>
        <div className="grid-gutter mt-16 grid md:grid-cols-2">
          {testimonials.map((t) => (
            <blockquote key={t.org} className="border-t border-line-strong/8 pt-10">
              <p className="font-display text-xl font-bold leading-[1.4] tracking-[-0.02em] text-ink-100 sm:text-[1.7rem]">
                &ldquo;{t.quote}&rdquo;
              </p>
              <footer className="meta mt-7">
                {t.author} &middot; {t.org}
              </footer>
            </blockquote>
          ))}
        </div>
      </section>
    );
  }

  const active = p < 0.5 ? 0 : 1;

  return (
    <section
      ref={ref}
      className="relative"
      style={{ height: "160vh" }}
      aria-label="Testimonials"
    >
      <div className="vignette sticky top-0 z-20 flex h-screen flex-col">
        <div
          className="absolute inset-0"
          style={{
            transform: `scale(${lerp(1.18, 1.03, p)}) translate3d(0, ${lerp(-2, 2, p)}%, 0)`,
          }}
        >
          <PhotoPlane
            depth="far"
            src={gallery[6]}
            alt="Engineers reviewing an emissions scan"
            code=""
            className="h-full w-full"
            imgClassName="opacity-40"
          />
        </div>
        <div className="pointer-events-none absolute inset-0 bg-space-950/70" />
        {/* an oversized punctuation plate, drifting counter to the backdrop */}
        <span
          aria-hidden
          className="display-xl text-outline pointer-events-none absolute -top-[10vh] right-[4vw] select-none text-[36vw] leading-none opacity-[0.07]"
          style={{ transform: `translate3d(0, ${lerp(4, -4, p)}vh, 0)` }}
        >
          &rdquo;
        </span>

        {/* Content — vertically centered with constrained padding */}
        <div className="relative flex flex-1 flex-col justify-center px-6 pt-24 pb-20 sm:px-10 lg:px-16">
          <p className="section-eyebrow" style={{ color: "var(--color-cyan-glow)" }}>
            Testimonials
          </p>
          <span aria-hidden className="accent-rule mt-3" />

          <div className="relative mt-6">
            {testimonials.map((t, i) => {
              const on = i === active;
              return (
                <blockquote
                  key={t.org}
                  className={`${i === 0 ? "relative" : "absolute inset-x-0 top-0"} max-w-4xl`}
                  style={{
                    opacity: on ? 1 : 0,
                    transform: `translate3d(${on ? 0 : i < active ? -6 : 6}vw, 0, 0)`,
                    filter: on ? "none" : "blur(6px)",
                    transition:
                      "opacity 0.7s ease, transform 0.9s cubic-bezier(0.16,1,0.3,1), filter 0.7s ease",
                  }}
                  aria-hidden={!on}
                >
                  <p className="text-[0.95rem] font-semibold leading-[1.7] tracking-normal text-white sm:text-[1.05rem] lg:text-[1.15rem]">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <footer className="meta mt-8 text-white/70 font-bold">
                    {t.author} &middot; {t.org}
                  </footer>
                </blockquote>
              );
            })}
          </div>
        </div>

        {/* Progress indicators — pinned at bottom */}
        <div className="absolute bottom-8 left-0 flex items-center gap-4 px-6 sm:px-10 lg:px-16">
          {testimonials.map((t, i) => (
            <span
              key={t.org}
              className="h-[2px] w-16 rounded-full transition-all duration-500"
              style={{
                backgroundColor: i === active ? "var(--color-cyan-glow)" : "rgba(255, 255, 255, 0.12)",
                boxShadow: i === active ? "0 0 8px rgba(26, 108, 245, 0.35)" : "none",
              }}
            />
          ))}
          <span className="meta ml-4">{`0${active + 1} / 0${testimonials.length}`}</span>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Closing CTA                                                          */
/* ------------------------------------------------------------------ */

function FinalScene() {
  const reducedMotion = useReducedMotion();
  const isDesktop = useIsDesktop(1024);
  const reduced = reducedMotion || !isDesktop;
  const { ref, progress } = useSceneProgress<HTMLDivElement>();
  const p = reduced ? 1.02 : progress;

  const traits = [
    { label: "Client-oriented", icon: "user" },
    { label: "Results-driven", icon: "chart" },
    { label: "Independent", icon: "shield" },
    { label: "Problem-solving", icon: "lightbulb" },
    { label: "Competent", icon: "medal" },
    { label: "Transparent", icon: "search" },
  ];

  const iconMap: Record<string, ReactNode> = {
    user: (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-7 w-7 text-cyan-glow">
        <path
          d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Zm-7 7a7 7 0 0 1 14 0"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    chart: (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-7 w-7 text-cyan-glow">
        <path
          d="M4 19V5M8 19V9M12 19V7M16 19v-5M20 19V3"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    shield: (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-7 w-7 text-cyan-glow">
        <path
          d="M12 3 5 6v6c0 4.2 2.9 8.1 7 9 4.1-.9 7-4.8 7-9V6l-7-3Zm0 5v4m-2-2h4"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    lightbulb: (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-7 w-7 text-cyan-glow">
        <path
          d="M9 18h6M10 21h4M12 3a7 7 0 0 0-4.5 12c.8.7 1.5 1.7 1.5 3v1h6v-1c0-1.3.7-2.3 1.5-3A7 7 0 0 0 12 3Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    medal: (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-7 w-7 text-cyan-glow">
        <path
          d="M8 3h8v5a4 4 0 0 1-8 0V3Zm0 4h8M10 14l-2 7 4-3 4 3-2-7"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    search: (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-7 w-7 text-cyan-glow">
        <circle cx="11" cy="11" r="5.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
        <path
          d="M16 16l4 4"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    ),
  };

  return (
    <section
      ref={ref}
      id="contact"
      className="relative z-30 overflow-hidden bg-[#020d1d] text-white"
      aria-label="Contact the lab"
    >
      <div className="absolute inset-0">
        <img
          src="/images/get_in_touch.webp"
          alt="Global network illustration"
          loading="lazy"
          className="h-full w-full object-cover object-center opacity-100"
        />
      </div>
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(2,13,29,0.94)_0%,rgba(2,13,29,0.90)_32%,rgba(2,13,29,0.78)_54%,rgba(2,13,29,0.34)_100%)]" />

      <div className="container-x relative px-6 py-20 sm:px-10 lg:px-16 lg:py-24">
        <div className="grid items-center gap-6 lg:grid-cols-[1.05fr_1.2fr] lg:gap-0">
          <div className="relative z-10 max-w-[700px]">
            <p className="font-mono text-[0.8rem] font-bold uppercase tracking-[0.28em] text-cyan-glow">
              Get in touch
            </p>

            <PerspectiveTilt delay={0.2} tiltDegrees={25} translateY={40}>
              <h2 className="mt-7 max-w-[620px] font-display text-[clamp(2.6rem,4.5vw,5.2rem)] font-black leading-[0.94] tracking-[-0.06em] text-white">
                <span className="block">Partner with us</span>
                <span className="block">for comprehensive</span>
                <span className="block text-cyan-glow">EMC testing</span>
              </h2>
            </PerspectiveTilt>

            <div className="mt-8 h-px w-[100%] max-w-[520px] bg-gradient-to-r from-cyan-glow/80 via-cyan-glow/40 to-transparent" />

            <SpringPopContainer className="mt-10 grid w-full max-w-[560px] grid-cols-2 gap-x-6 gap-y-7 sm:grid-cols-3" stagger={0.1}>
              {traits.map((trait) => (
                <SpringPopItem key={trait.label}>
                  <div className="flex items-center gap-3 text-white/90">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full border border-cyan-glow/30 bg-white/[0.06] shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_4px_12px_-4px_rgba(26,108,245,0.3)]">
                      {iconMap[trait.icon]}
                    </div>
                    <span className="font-mono text-[0.72rem] font-bold uppercase tracking-[0.14em] text-white/90">
                      {trait.label}
                    </span>
                  </div>
                </SpringPopItem>
              ))}
            </SpringPopContainer>

            <div className="mt-10 flex items-center gap-6">
              <Magnetic strength={0.25} className="inline-block">
                <a
                  href={`tel:${company.phone.replace(/\s/g, "")}`}
                  className="group inline-flex items-center gap-3 rounded-full border border-cyan-glow/50 bg-[linear-gradient(90deg,#1c5cff,#1878ff_42%,#3b82f6)] px-6 py-3 lg:min-w-[340px] font-mono text-base font-bold uppercase tracking-[0.12em] text-white shadow-[0_0_30px_rgba(59,130,246,0.5)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_28px_rgba(59,130,246,0.9)]"
                >
                  <svg className="h-5 w-5 flex-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.86 19.86 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.86 19.86 0 0 1-3.07-8.63A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.99.37 1.95.73 2.85a2 2 0 0 1-.45 2.11L8.09 10.91a16 16 0 0 0 6 6l1.23-1.23a2 2 0 0 1 2.11-.45c.9.36 1.86.61 2.85.73A2 2 0 0 1 22 16.92z" strokeLinejoin="round" strokeLinecap="round" />
                  </svg>
                  <span className="whitespace-nowrap">Call +91 94442 72009</span>
                </a>
              </Magnetic>

              <Magnetic strength={0.25} className="inline-block">
                <a
                  href={`tel:+919790901184`}
                  className="group inline-flex items-center gap-3 rounded-full border border-cyan-glow/50 bg-[linear-gradient(90deg,#1c5cff,#1878ff_42%,#3b82f6)] px-6 py-3 lg:min-w-[340px] font-mono text-base font-bold uppercase tracking-[0.12em] text-white shadow-[0_0_30px_rgba(59,130,246,0.5)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_28px_rgba(59,130,246,0.9)]"
                >
                  <svg className="h-5 w-5 flex-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.86 19.86 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.86 19.86 0 0 1-3.07-8.63A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.99.37 1.95.73 2.85a2 2 0 0 1-.45 2.11L8.09 10.91a16 16 0 0 0 6 6l1.23-1.23a2 2 0 0 1 2.11-.45c.9.36 1.86.61 2.85.73A2 2 0 0 1 22 16.92z" strokeLinejoin="round" strokeLinecap="round" />
                  </svg>
                  <span className="whitespace-nowrap">Call +91 97909 01184</span>
                </a>
              </Magnetic>
            </div>
          </div>

          <div
            className="pointer-events-none relative hidden min-h-[420px] w-full max-w-[760px] lg:block"
            aria-hidden="true"
          />
        </div>

        <div className="relative z-10 mt-20 border-t border-cyan-glow/25 pt-10">
          <p className="font-mono text-[0.8rem] font-bold uppercase tracking-[0.3em] text-cyan-glow">
            Let&rsquo;s do high performance lab testing
          </p>
          <a href="/contact" className="group mt-7 block w-fit">
            <h3 className="font-display text-[clamp(2.4rem,4.2vw,4.8rem)] font-black leading-[0.9] tracking-[-0.06em] text-white transition-colors group-hover:text-cyan-glow">
              Contact us today
            </h3>
          </a>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Trust bar — the accreditation facts Hero used to carry as pills,       */
/* now a single quiet strip right under the fold instead of competing     */
/* with the headline for attention.                                       */
/* ------------------------------------------------------------------ */

function TrustBar() {
  const items = [
    { value: "NABL", label: "Accredited" },
    { value: "500+", label: "Clients Served" },
    { value: "10 kHz–40 GHz", label: "Range" },
    { value: "120+", label: "Projects Completed" },
    { value: "5+", label: "Years of Excellence" },
  ];

  return (
    <div className="relative overflow-hidden py-6 sm:py-8">
      {/* Animated gradient border lines at top and bottom */}
      <div className="divider-beam absolute inset-x-0 top-0" />
      <div className="divider-beam absolute inset-x-0 bottom-0" />

      <div className="container-x">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5 lg:gap-0">
          {items.map((t, i) => (
            <div
              key={t.value + t.label}
              className={`group flex flex-col items-center gap-2 py-3 transition-all duration-300 hover:scale-105 ${
                i > 0 ? "lg:border-l lg:border-white/[0.06]" : ""
              }`}
            >
              <span className="glow-dot mb-1" />
              <span className="font-display text-lg font-extrabold tracking-tight text-ink-100 sm:text-xl">
                {t.value}
              </span>
              <span className="text-[0.7rem] font-semibold uppercase tracking-[0.15em] text-ink-500">
                {t.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <div className="relative">
      <div className="relative z-10">
        {/* Hero (DARK) — with particle field + floating standards + icons */}
        <div className="relative">
          <ParticleField
            className="z-0 opacity-60"
            particleCount={50}
            connectionDistance={120}
            speed={0.2}
          />
          <FloatingStandards count={10} opacity={0.5} className="hidden lg:block" />
          <Hero />
        </div>

        {/* Trust Bar (LIGHT) */}
        <div className="section-light relative">
          <FloatingStandards count={6} opacity={0.7} theme="light" className="hidden lg:block" />
          <TrustBar />
        </div>

        {/* Why Choose Us (DARK) */}
        <div className="relative">
          <GradientOrbs variant="subtle" />
          <FloatingStandards count={8} opacity={0.35} theme="dark" className="hidden lg:block" />
          <WhyChooseUsScene />
        </div>

        {/* Deliver (LIGHT) */}
        <div className="section-light relative">
          <FloatingStandards count={8} opacity={0.7} theme="light" className="hidden lg:block" />
          <DeliverScene />
        </div>

        {/* About CCTL (DARK) */}
        <div className="relative">
          <GradientOrbs variant="default" />
          <FloatingStandards count={8} opacity={0.35} theme="dark" className="hidden lg:block" />
          <AboutBlurbScene />
        </div>

        {/* Trusted By (LIGHT) */}
        <div className="section-light relative">
          <FloatingStandards count={6} opacity={0.7} theme="light" className="hidden lg:block" />
          <TrustScene />
        </div>

        {/* Services Stack (DARK) */}
        <div className="relative">
          <GridBackground variant="default" />
          <FloatingStandards count={8} opacity={0.3} theme="dark" className="hidden lg:block" />
          <DomainStack />
        </div>

        {/* Accreditations (LIGHT) */}
        <div className="section-light relative">
          <FloatingStandards count={8} opacity={0.7} theme="light" className="hidden lg:block" />
          <AccreditationScene />
        </div>

        {/* Gallery (DARK) */}
        <div className="relative">
          <FloatingStandards count={6} opacity={0.3} theme="dark" className="hidden lg:block" />
          <FacilityScene />
        </div>

        {/* Testimonials (DARK) */}
        <div className="relative">
          <FloatingStandards count={6} opacity={0.3} theme="dark" className="hidden lg:block" />
          <TestimonialScene />
        </div>

        {/* CTA (DARK) */}
        <div className="relative">
          <GradientOrbs variant="intense" className="opacity-70" />
          <ParticleField
            className="z-0 opacity-40"
            particleCount={40}
            connectionDistance={100}
            speed={0.15}
            particleColor="rgba(109, 78, 240, 0.5)"
            lineColor="rgba(109, 78, 240, 0.1)"
          />
          <FinalScene />
        </div>
      </div>
    </div>
  );
}
