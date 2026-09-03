import { useRef } from "react";
import { Link } from "@tanstack/react-router";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import HorizontalRail from "../components/motion/HorizontalRail";
import MaskedImage from "../components/motion/MaskedImage";
import TiltPlane from "../components/motion/TiltPlane";
import GrainOverlay from "../components/motion/GrainOverlay";
import { blogPlaceholders } from "../data/content";

/* Editorial masthead — the title type separates in depth as the cover plate scales away. */
function Masthead() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], reduced ? ["0%", "0%"] : ["0%", "24%"]);
  const imgScale = useTransform(scrollYProgress, [0, 1], reduced ? [1, 1] : [1.12, 1.28]);
  const typeY = useTransform(scrollYProgress, [0, 1], reduced ? ["0%", "0%"] : ["0%", "-38%"]);
  const fade = useTransform(scrollYProgress, [0, 0.9], [1, 0]);

  return (
    <div ref={ref} className="relative h-[92vh] overflow-hidden">
      <motion.img
        src="/images/blog.webp"
        alt=""
        style={{ y: imgY, scale: imgScale }}
        className="absolute inset-0 h-full w-full object-cover opacity-80"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-space-950/45 via-space-950/40 to-space-950" />
      <GrainOverlay opacity={0.05} />

      <motion.div
        style={{ y: typeY, opacity: fade }}
        className="relative mx-auto flex h-full max-w-7xl flex-col justify-end px-5 pb-20 lg:px-8"
      >
        <motion.span
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="font-mono text-xs font-bold uppercase tracking-[0.3em] text-cyan-glow"
        >
          The CCTL Journal — Issue 01
        </motion.span>
        <h1 className="t-display mt-6 text-[clamp(2.6rem,9vw,7rem)]">
          {["Field", "Notes"].map((w, i) => (
            <span key={w} className="block overflow-hidden">
              <motion.span
                initial={{ y: "110%", rotate: 4 }}
                animate={{ y: 0, rotate: 0 }}
                transition={{ duration: 1, delay: 0.1 + i * 0.12, ease: [0.76, 0, 0.24, 1] }}
                className={`block ${i % 2 ? "text-outline-heading" : "text-ink-100"}`}
              >
                {w}
              </motion.span>
            </span>
          ))}
        </h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="t-lead mt-7 max-w-xl"
        >
          EMC testing knowledge, standards guidance, and dispatches from the chamber floor.
        </motion.p>
      </motion.div>
    </div>
  );
}

function RailCard({ post, index }: { post: (typeof blogPlaceholders)[number]; index: number }) {
  return (
    <Link
      to="/blog/$slug"
      params={{ slug: post.slug }}
      className="group relative block w-[78vw] shrink-0 sm:w-[52vw] lg:w-[34vw]"
    >
      <TiltPlane max={7} lift={20}>
        <div className="surface relative overflow-hidden rounded-[1.5rem] p-0">
          <img
            src={post.image}
            alt=""
            loading="lazy"
            className="aspect-[4/3] w-full object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.07]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-space-950 via-space-950/20 to-transparent" />
          <div
            className="absolute inset-x-0 bottom-0 p-7"
            style={{ transform: "translateZ(40px)" }}
          >
            <span className="font-mono text-[0.65rem] font-bold uppercase tracking-[0.25em] text-cyan-glow">
              {String(index + 1).padStart(2, "0")} — EMC Insights
            </span>
            <h3 className="t-h3 mt-4 text-[1.35rem]">{post.title}</h3>
            <span className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-ink-300 transition-colors group-hover:text-cyan-glow">
              Read article
              <span className="inline-block transition-transform duration-300 group-hover:translate-x-1.5">
                &rarr;
              </span>
            </span>
          </div>
        </div>
      </TiltPlane>
    </Link>
  );
}

const bento = [
  "lg:col-span-7 lg:row-span-2",
  "lg:col-span-5",
  "lg:col-span-5",
  "lg:col-span-6",
  "lg:col-span-6",
];
const bentoAspect = [
  "aspect-[16/11]",
  "aspect-[16/9]",
  "aspect-[16/9]",
  "aspect-[16/10]",
  "aspect-[16/10]",
];

export default function Blog() {
  return (
    <>
      <Masthead />

      {/* Horizontal reading rail — vertical scroll becomes lateral travel */}
      <section className="relative bg-space-950">
        <div className="container-x pt-24 lg:pt-32">
          <div className="flex items-end justify-between gap-6 border-b border-line-strong/10 pb-6">
            <h2 className="t-h2">Latest dispatches</h2>
            <span className="font-mono hidden text-xs uppercase tracking-[0.25em] text-ink-500 sm:block">
              Scroll &rarr;
            </span>
          </div>
        </div>
        <HorizontalRail heightVh={280} mobileHeightVh={190} travel="-58%">
          {blogPlaceholders.map((post, i) => (
            <RailCard key={post.slug} post={post} index={i} />
          ))}
        </HorizontalRail>
      </section>

      {/* Asymmetric bento archive with masked reveals */}
      <section className="bg-space-950 pb-28 lg:pb-36">
        <div className="container-x">
          <h2 className="t-h2 mb-12 border-b border-line-strong/10 pb-7">The full archive</h2>
          <div className="grid-gutter grid grid-cols-1 lg:grid-cols-12">
            {blogPlaceholders.map((post, i) => (
              <Link
                key={post.slug}
                to="/blog/$slug"
                params={{ slug: post.slug }}
                className={`group relative block ${bento[i] ?? "lg:col-span-6"}`}
              >
                <div className="surface surface-hover h-full overflow-hidden rounded-[1.5rem]">
                  <MaskedImage
                    src={post.image}
                    direction={i % 2 ? "right" : "up"}
                    delay={(i % 3) * 0.06}
                    className={`relative ${bentoAspect[i] ?? "aspect-[16/10]"}`}
                    imgClassName="h-full w-full object-cover transition-transform duration-[1100ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
                    alt=""
                  />
                  <div className="pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-space-950/60 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  <div className="p-7">
                    <span className="font-mono text-[0.65rem] font-bold uppercase tracking-[0.25em] text-cyan-glow">
                      EMC Insights
                    </span>
                    <h3 className="t-h3 mt-4">{post.title}</h3>
                    <p className="t-small mt-3">{post.subtitle}</p>
                    <span className="mt-5 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-ink-500 transition-colors group-hover:text-cyan-glow">
                      Read
                      <span className="h-px w-16 origin-left scale-x-[0.5] bg-current transition-transform duration-500 group-hover:scale-x-100" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
