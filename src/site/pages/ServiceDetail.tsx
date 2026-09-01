import { useRef } from "react";
import { Link, Navigate, useParams } from "@tanstack/react-router";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import Magnetic from "../components/motion/Magnetic";
import { services, company } from "../data/content";

/* Spring-like easing */
const ease = [0.22, 1, 0.36, 1] as const;

/* Real dimensions of the 5 domain images (service.image), used to reserve
   layout space ahead of load — aspect ratios differ per domain so a single
   shared CSS aspect-ratio would crop some of them differently than today. */
const SERVICE_IMAGE_DIMENSIONS: Record<string, { width: number; height: number }> = {
  "/images/chamber.webp": { width: 1447, height: 1087 },
  "/images/civilianDomain.webp": { width: 1672, height: 941 },
  "/images/automotive.webp": { width: 1672, height: 941 },
  "/images/domain-railways.webp": { width: 1448, height: 1086 },
  "/images/domain-telecom.webp": { width: 1510, height: 1042 },
};

export default function ServiceDetail() {
  const { slug } = useParams({ from: "/services/$slug" });
  const service = services.find((s) => s.slug === slug);
  const reduced = useReducedMotion();

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroImgY = useTransform(scrollYProgress, [0, 1], reduced ? ["0%", "0%"] : ["0%", "12%"]);
  const heroImgScale = useTransform(scrollYProgress, [0, 1], reduced ? [1, 1] : [1.05, 1.15]);

  if (!service) return <Navigate to="/services" replace />;

  return (
    <div className="bg-space-950">
      {/* ═══════════════════════════════════════════════════════════════════
          HERO — Full-bleed parallax photo + editorial overlay
      ═══════════════════════════════════════════════════════════════════ */}
      <section
        ref={heroRef}
        className="relative isolate overflow-hidden rounded-b-[2rem] bg-ink-100"
        style={{ minHeight: "calc(100svh - 4.5rem)" }}
      >
        {/* Parallax photo plate */}
        <div className="absolute inset-0 -z-10">
          <motion.div
            className="absolute inset-x-0 -top-[16%] h-[132%]"
            style={{ y: heroImgY, scale: heroImgScale }}
          >
            <img
              src={service.image}
              alt=""
              className="nav-logo h-full w-full object-cover"
              fetchPriority="high"
              decoding="async"
            />
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-b from-[rgba(7,13,24,0.8)] via-[rgba(7,13,24,0.6)] to-[rgba(7,13,24,0.85)]" />
        </div>

        {/* Hero content */}
        <div className="relative flex min-h-[inherit] flex-col justify-end px-6 pb-16 pt-32 sm:px-10 lg:px-16">
          {/* Ghost watermark */}
          <span
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none font-heading text-[18vw] font-black uppercase leading-none text-white/[0.04]"
          >
            {service.spec}
          </span>

          {/* Eyebrow */}
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease }}
            className="meta inline-flex items-center gap-2 text-white/70"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-glow" />
            {service.name}
          </motion.span>

          {/* Stacked title */}
          <h1 className="font-display mt-6 max-w-4xl text-[clamp(2.35rem,6vw,4.6rem)] font-extrabold uppercase leading-[0.92] tracking-[-0.04em] text-white">
            {service.tagline
              .split(" ")
              .reduce((acc: string[][], word, i) => {
                const lineIdx = Math.floor(i / 3);
                if (!acc[lineIdx]) acc[lineIdx] = [];
                acc[lineIdx].push(word);
                return acc;
              }, [])
              .map((line, i) => (
                <span key={i} className="block overflow-hidden">
                  <motion.span
                    initial={{ y: "115%", opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.95, delay: 0.1 + i * 0.12, ease: [0.16, 1, 0.3, 1] }}
                    className="block"
                  >
                    {line.join(" ")}
                  </motion.span>
                </span>
              ))}
          </h1>

          {/* Body + CTA */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.7, ease }}
            className="mt-7 max-w-xl text-base leading-[1.75] tracking-[0.006em] text-white/80"
          >
            {service.body}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6, ease }}
            className="mt-8 flex flex-wrap gap-4"
          >
            <Magnetic strength={0.35}>
              <Link
                to="/contact"
                className="btn-base group bg-cyan-glow px-7 py-4 text-[0.8125rem] font-bold uppercase tracking-[0.14em] text-white shadow-[0_10px_30px_-10px_rgba(26,108,245,0.5)] hover:-translate-y-px hover:bg-violet-glow"
              >
                Request a Quote
                <svg
                  className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </Link>
            </Magnetic>
          </motion.div>

          {/* Stat pills at bottom */}
          <div className="mt-12 flex flex-wrap gap-3">
            {service.stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + i * 0.1, duration: 0.6, ease }}
                className="rounded-full border border-white/20 bg-white/10 px-4 py-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.25)] backdrop-blur-sm"
              >
                <span className="text-xs font-medium text-white">{stat.value}</span>
                <span className="ml-2 text-xs text-white/60">{stat.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          GALLERY — Tilted photo cards with glass captions
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="section-y container-x bg-space-950">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="meta inline-flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-glow" />
                Facility
              </span>
              <h2 className="t-h2 mt-5">Inside the {service.name.replace(" Domain", "")}</h2>
            </div>
            <p className="t-body max-w-xs">
              Our chambers, instrumentation, and test setups for this domain.
            </p>
          </div>

          <div className="grid-gutter mt-16 grid grid-cols-2 lg:grid-cols-4">
            {service.gallery.map((src, i) => (
              <motion.figure
                key={i}
                initial={reduced ? undefined : { opacity: 0, y: 48 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.7, delay: i * 0.14, ease }}
                whileHover={reduced ? undefined : { scale: 1.03 }}
                className="plate group relative aspect-[4/3] overflow-hidden rounded-[1.5rem]"
              >
                <img
                  src={src}
                  alt={`${service.name} facility ${i + 1}`}
                  className="h-full w-full rounded-[inherit] object-cover object-center"
                  loading="lazy"
                />
              </motion.figure>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          TEST METHODOLOGY — Numbered program rows with hover arrows
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="container-x bg-space-900 pb-24 pt-12 lg:pb-32 lg:pt-16">
        <div className="mx-auto max-w-5xl">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="meta inline-flex items-center gap-2"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-glow" />
            Our process
          </motion.span>
          <h2 className="t-h2 mt-5">Test methodology</h2>

          <ul className="mt-14">
            {["Test plan & pre-scan", "Chamber measurement", "Report & certification"].map(
              (step, i) => (
                <motion.li
                  key={step}
                  initial={reduced ? undefined : { opacity: 0, y: 26 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ duration: 0.6, delay: i * 0.09, ease }}
                  className="group flex items-center gap-6 border-t border-line-strong/10 py-7 last:border-b"
                >
                  <span className="num-chip w-12">{String(i + 1).padStart(2, "0")}</span>
                  <span className="t-h3 flex-1 text-xl sm:text-[1.6rem]">{step}</span>
                  <span className="grid h-11 w-11 place-items-center rounded-full border border-line-strong/10 transition-colors group-hover:border-ink-100">
                    <svg
                      className="h-5 w-5 text-ink-500 transition-all duration-300 group-hover:translate-x-1 group-hover:text-ink-100"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    >
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  </span>
                </motion.li>
              ),
            )}
          </ul>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          DETAILED DESCRIPTION — Editorial text block
      ═══════════════════════════════════════════════════════════════════ */}
      {service.detailedDescription && (
        <section className="container-x bg-space-950 pb-24 pt-12 lg:pb-32 lg:pt-16">
          <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1fr_1fr] lg:items-center">
            {/* Left: text */}
            <div>
              <motion.span
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="meta inline-flex items-center gap-2"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-glow" />
                About this domain
              </motion.span>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, ease }}
                className="t-h2 mt-5"
              >
                EMC Testing For {service.name.replace(" Domain", "")}
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.8, delay: 0.15, ease }}
                className="t-body mt-6 max-w-xl"
              >
                {service.detailedDescription}
              </motion.p>
            </div>

            {/* Right: one large image */}
            <motion.div
              initial={reduced ? undefined : { opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7, delay: 0.14, ease }}
              className="plate overflow-hidden rounded-[1.5rem]"
            >
              <img
                src={service.image}
                alt={`${service.name} testing facility`}
                className="nav-logo w-full object-cover"
                loading="lazy"
                decoding="async"
                width={SERVICE_IMAGE_DIMENSIONS[service.image]?.width}
                height={SERVICE_IMAGE_DIMENSIONS[service.image]?.height}
              />
            </motion.div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          VALUE PROPS — 4-up stats band style
      ═══════════════════════════════════════════════════════════════════ */}
      {service.valueProps && service.valueProps.length > 0 && (
        <section className="container-x rounded-[2rem] bg-ink-100 pb-24 pt-12 lg:pb-32 lg:pt-16">
          <div className="mx-auto max-w-6xl">
            <span className="meta inline-flex items-center gap-2 text-ink-500">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-glow" />
              Key benefits
            </span>
            <h2 className="font-display mt-5 text-[clamp(1.85rem,3.4vw,2.9rem)] font-extrabold leading-[1.02] tracking-[-0.032em] text-[#0f172a]">
              Why {service.name.replace(" Domain", "")} Testing Matters
            </h2>
            <dl className="mt-14 grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
              {service.valueProps.map((vp, i) => (
                <motion.div
                  key={vp.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ duration: 0.6, delay: i * 0.11, ease }}
                  className="border-t border-[#0f172a]/10 pt-6"
                >
                  <dt className="figure-accent text-3xl">{String(i + 1).padStart(2, "0")}</dt>
                  <dd className="mt-3">
                    <p className="font-display text-[1.05rem] font-bold leading-snug tracking-[-0.02em] text-[#0f172a]">
                      {vp.title}
                    </p>
                    <p className="mt-3 text-[0.9125rem] leading-[1.75] tracking-[0.008em] text-[#475569]">
                      {vp.body}
                    </p>
                  </dd>
                </motion.div>
              ))}
            </dl>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          SERVICE OFFERINGS — Card grid with hover lift
      ═══════════════════════════════════════════════════════════════════ */}
      {service.serviceOfferings && service.serviceOfferings.length > 0 && (
        <section className="container-x bg-space-950 pb-24 pt-12 lg:pb-32 lg:pt-16">
          <div className="mx-auto max-w-6xl">
            <span className="meta inline-flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-glow" />
              Our services
            </span>
            <h2 className="t-h2 mt-5">Advanced {service.name.replace(" Domain", "")} Solutions</h2>
            <div className="grid-gutter mt-16 grid md:grid-cols-3">
              {service.serviceOfferings.map((so, i) => (
                <motion.article
                  key={so.title}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.7, delay: i * 0.12, ease }}
                  whileHover={reduced ? undefined : { y: -8 }}
                  className="surface surface-hover group flex flex-col justify-between p-8"
                >
                  <div>
                    <span className="num-chip inline-block">#{String(i + 1).padStart(2, "0")}</span>
                    <h3 className="t-h3 mt-5">{so.title}</h3>
                    <p className="t-body mt-3">{so.body}</p>
                  </div>
                  <span className="mt-6 block h-px w-20 origin-left scale-x-[0.5] bg-cyan-glow/40 transition-transform duration-500 group-hover:scale-x-100" />
                </motion.article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          LAB TESTING TABLE — Clean editorial table
      ═══════════════════════════════════════════════════════════════════ */}
      {service.labTesting && (
        <section className="container-x bg-space-900 pb-24 pt-12 lg:pb-32 lg:pt-16">
          <div className="mx-auto max-w-5xl">
            <span className="meta inline-flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-glow" />
              Standards covered
            </span>
            <h2 className="t-h2 mt-5">Laboratory Testing</h2>
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.7, ease }}
              className="surface mt-10 overflow-hidden p-0"
            >
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-line-strong/10">
                    <th className="meta px-6 py-5 text-cyan-glow">
                      {service.labTesting.col1Header}
                    </th>
                    <th className="meta px-6 py-5 text-cyan-glow">
                      {service.labTesting.col2Header}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {service.labTesting.col1.map((item, i) => (
                    <tr
                      key={i}
                      className="border-b border-line-strong/5 transition-colors hover:bg-space-900/40"
                    >
                      <td className="px-6 py-4 font-mono text-[0.8125rem] font-semibold text-ink-100">
                        {item}
                      </td>
                      <td className="px-6 py-4 text-[0.875rem] leading-relaxed text-ink-300">
                        {service.labTesting!.col2[i] || ""}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          ADDITIONAL SERVICES — Pill list
      ═══════════════════════════════════════════════════════════════════ */}
      {service.additionalServices && service.additionalServices.length > 0 && (
        <section className="container-x bg-space-950 pb-24 pt-12 lg:pb-32 lg:pt-16">
          <div className="mx-auto max-w-5xl">
            <span className="meta inline-flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-glow" />
              Also available
            </span>
            <h2 className="t-h2 mt-5">Additional Services</h2>
            <p className="t-lead mt-6 max-w-2xl">
              CCTL offers a variety of on-site and off-site EMI/EMC engineering services to meet the
              diverse needs of our clients.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              {service.additionalServices.map((svc, i) => (
                <motion.span
                  key={svc}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.08, ease }}
                  className="rounded-full border border-white/10 bg-white/[0.06] px-5 py-3 text-[0.875rem] font-semibold text-ink-100 shadow-[0_1px_2px_rgba(0,0,0,0.2)] transition-all duration-300 hover:-translate-y-px hover:border-cyan-glow/45 hover:shadow-[0_14px_28px_-16px_rgba(26,108,245,0.5)]"
                >
                  {svc}
                </motion.span>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          CTA FOOTER BAND — Dark rounded card
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="container-x mx-3 mb-3 overflow-hidden rounded-[2rem] bg-ink-100 pb-24 pt-12 lg:pb-32 lg:pt-16">
        <div className="mx-auto flex max-w-5xl flex-col items-start gap-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="meta inline-flex items-center gap-2 text-ink-500">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-glow" />
              Get started
            </span>
            <h2 className="font-display mt-5 text-[clamp(2.35rem,5.2vw,4.1rem)] font-extrabold leading-[0.95] tracking-[-0.038em] text-[#0f172a]">
              Ready to
              <br />
              test?
            </h2>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15, duration: 0.6, ease }}
          >
            <Magnetic strength={0.35}>
              <Link
                to="/contact"
                className="btn-base group bg-cyan-glow px-8 py-[1.15rem] text-[0.8125rem] font-bold uppercase tracking-[0.14em] text-white shadow-[0_10px_30px_-10px_rgba(26,108,245,0.5)] hover:-translate-y-px hover:bg-violet-glow"
              >
                Request a Quote
                <svg
                  className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </Link>
            </Magnetic>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
