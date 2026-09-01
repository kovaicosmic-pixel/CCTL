import { useRef, type ReactNode } from "react";
import { Link, Navigate, useParams } from "@tanstack/react-router";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import GhostWatermark from "../components/motion/GhostWatermark";
import GrainOverlay from "../components/motion/GrainOverlay";
import Magnetic from "../components/motion/Magnetic";
import TiltPlane from "../components/motion/TiltPlane";
import { blogPlaceholders } from "../data/content";

/**
 * Renders blog body blocks with rich formatting:
 * - "## " prefix → h2 heading
 * - "### " prefix → h3 heading
 * - "- " prefix → bullet list item (consecutive items grouped)
 * - "| " prefix → table row (first row = header, pipe-separated)
 * - Anything else → paragraph (first paragraph gets drop-cap)
 */
function renderBlogBody(body: string[], reduced: boolean | null) {
  const elements: ReactNode[] = [];
  let paraIndex = 0;

  for (let i = 0; i < body.length; i++) {
    const line = body[i];

    // Image block: ![alt](src)
    if (line.startsWith("![")) {
      const match = line.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
      if (match) {
        elements.push(
          <motion.figure
            key={i}
            initial={reduced ? undefined : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="plate my-12 overflow-hidden rounded-2xl"
          >
            <img
              src={match[2]}
              alt={match[1]}
              className="nav-logo w-full object-cover"
              loading="lazy"
            />
            {match[1] && (
              <figcaption className="bg-space-900 px-5 py-3 text-center text-xs text-ink-500">
                {match[1]}
              </figcaption>
            )}
          </motion.figure>,
        );
      }
    }
    // H2 heading
    else if (line.startsWith("## ")) {
      elements.push(
        <motion.h2
          key={i}
          initial={reduced ? undefined : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="font-display mt-12 text-[1.6rem] font-extrabold leading-[1.1] tracking-[-0.028em] text-ink-100 sm:text-[2rem]"
        >
          {line.slice(3)}
        </motion.h2>,
      );
    }
    // H3 heading
    else if (line.startsWith("### ")) {
      elements.push(
        <motion.h3
          key={i}
          initial={reduced ? undefined : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="font-display mt-8 text-[1.15rem] font-bold tracking-[-0.02em] text-cyan-glow"
        >
          {line.slice(4)}
        </motion.h3>,
      );
    }
    // Table rows (collect consecutive | lines)
    else if (line.startsWith("| ")) {
      const tableRows: string[] = [line];
      while (i + 1 < body.length && body[i + 1].startsWith("| ")) {
        i++;
        tableRows.push(body[i]);
      }
      const parsedRows = tableRows.map((r) =>
        r
          .split("|")
          .slice(1)
          .map((c) => c.trim()),
      );
      elements.push(
        <motion.div
          key={i}
          initial={reduced ? undefined : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="surface mt-8 overflow-x-auto"
        >
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-line-strong/10 bg-space-900">
                {parsedRows[0].map((cell, ci) => (
                  <th key={ci} className="meta px-5 py-4 text-cyan-glow">
                    {cell}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {parsedRows.slice(1).map((row, ri) => (
                <tr
                  key={ri}
                  className="border-b border-line-strong/5 transition-colors hover:bg-space-900/50"
                >
                  {row.map((cell, ci) => (
                    <td
                      key={ci}
                      className={`px-5 py-3.5 text-[0.875rem] ${ci === 0 ? "font-semibold text-ink-100" : "text-ink-300"}`}
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>,
      );
    }
    // Bullet list (collect consecutive - lines)
    else if (line.startsWith("- ")) {
      const listItems: string[] = [line.slice(2)];
      while (i + 1 < body.length && body[i + 1].startsWith("- ")) {
        i++;
        listItems.push(body[i].slice(2));
      }
      elements.push(
        <motion.ul
          key={i}
          initial={reduced ? undefined : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mt-4 space-y-3 pl-1"
        >
          {listItems.map((item, li) => (
            <li key={li} className="t-body flex items-start gap-3">
              <span className="mt-2 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-cyan-glow/10">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-glow shadow-[0_0_6px_1px_rgba(26,108,245,0.4)]" />
              </span>
              <span>{item}</span>
            </li>
          ))}
        </motion.ul>,
      );
    }
    // Regular paragraph
    else {
      const isFirst = paraIndex === 0;
      paraIndex++;
      elements.push(
        <motion.p
          key={i}
          initial={reduced ? undefined : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className={
            isFirst
              ? "text-[1.0625rem] leading-[1.8] tracking-[0.004em] text-ink-100 first-letter:float-left first-letter:mr-3 first-letter:font-display first-letter:text-6xl first-letter:font-extrabold first-letter:leading-[0.78] first-letter:text-cyan-glow"
              : "t-body"
          }
        >
          {line}
        </motion.p>,
      );
    }
  }

  return elements;
}

export default function BlogDetail() {
  const { slug } = useParams({ from: "/blog/$slug" });
  const post = blogPlaceholders.find((p) => p.slug === slug);
  const reduced = useReducedMotion();

  const heroRef = useRef<HTMLElement>(null);
  const articleRef = useRef<HTMLElement>(null);

  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const imgY = useTransform(heroProgress, [0, 1], reduced ? ["0%", "0%"] : ["0%", "28%"]);
  const imgScale = useTransform(heroProgress, [0, 1], reduced ? [1, 1] : [1.1, 1.24]);
  const typeY = useTransform(heroProgress, [0, 1], reduced ? ["0%", "0%"] : ["0%", "-24%"]);
  const veil = useTransform(heroProgress, [0, 1], [0.55, 0.95]);

  const { scrollYProgress: readProgress } = useScroll({
    target: articleRef,
    offset: ["start center", "end end"],
  });
  const bar = useSpring(readProgress, { stiffness: 120, damping: 28, mass: 0.3 });

  if (!post) return <Navigate to="/blog" replace />;

  const related = blogPlaceholders.filter((p) => p.slug !== post.slug).slice(0, 3);

  return (
    <>
      {/* Cinematic hero — photograph drifts and darkens behind separating typography */}
      <section ref={heroRef} className="relative flex min-h-[86vh] items-end overflow-hidden pt-24">
        <motion.img
          src={post.image}
          alt=""
          style={{ y: imgY, scale: imgScale }}
          initial={reduced ? undefined : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <motion.div className="absolute inset-0 bg-space-950" style={{ opacity: veil }} />
        <div className="absolute inset-0 bg-gradient-to-b from-space-950/40 via-transparent to-space-950" />
        <GrainOverlay opacity={0.045} />
        <GhostWatermark text={post.ghostWord} />

        <motion.div
          style={{ y: typeY }}
          className="relative mx-auto w-full max-w-4xl px-5 pb-20 lg:px-8"
        >
          <motion.span
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="font-mono inline-block rounded-full border border-white/30 px-4 py-1.5 text-[0.65rem] font-bold uppercase tracking-[0.25em] text-white"
            style={{ mixBlendMode: "exclusion" }}
          >
            EMC Insights
          </motion.span>
          <h1 className="font-display mt-8 text-[clamp(2.1rem,5vw,3.9rem)] font-extrabold leading-[1.02] tracking-[-0.036em] text-ink-100">
            {post.title.split(" ").map((word, i) => (
              <span
                key={`${word}-${i}`}
                className="mr-[0.3em] inline-block overflow-hidden align-bottom"
              >
                <motion.span
                  initial={reduced ? undefined : { y: "110%", opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.85, delay: 0.15 + i * 0.06, ease: [0.76, 0, 0.24, 1] }}
                  className="inline-block"
                >
                  {word}
                </motion.span>
              </span>
            ))}
          </h1>
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.7 }}
            className="t-lead mt-6 max-w-2xl"
          >
            {post.subtitle}
          </motion.p>
        </motion.div>
      </section>

      {/* Calm reading area, with a thin progress rule as the only motion */}
      <article ref={articleRef} className="section-y-sm container-x relative bg-space-950">
        <div className="mx-auto max-w-[68ch]">
          <div className="flex items-center gap-5">
            <Link to="/blog" className="text-sm font-semibold text-cyan-glow hover:text-ink-100">
              &larr; Back to Blog
            </Link>
            <div className="h-px flex-1 bg-line-strong/10">
              <motion.div className="h-px origin-left bg-cyan-glow" style={{ scaleX: bar }} />
            </div>
          </div>

          <div className="mt-10 space-y-6">{renderBlogBody(post.body, reduced)}</div>
        </div>
      </article>

      {/* Interactive related content */}
      <section className="container-x bg-space-900 pb-24 pt-12 lg:pb-32 lg:pt-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="t-h2 border-b border-line-strong/10 pb-7">Keep reading</h2>
          <div className="grid-gutter mt-12 grid md:grid-cols-3">
            {related.map((r, i) => (
              <motion.div
                key={r.slug}
                initial={reduced ? undefined : { opacity: 0, y: 40, rotateX: 20 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.7, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              >
                <Link to="/blog/$slug" params={{ slug: r.slug }} className="group block h-full">
                  <TiltPlane max={8} lift={22} className="h-full">
                    <div className="surface surface-hover h-full overflow-hidden">
                      <div className="relative overflow-hidden">
                        <img
                          src={r.image}
                          alt=""
                          loading="lazy"
                          className="aspect-[16/10] w-full object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-space-950/30 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                      </div>
                      <div className="p-6" style={{ transform: "translateZ(30px)" }}>
                        <span className="font-mono text-[0.65rem] font-bold uppercase tracking-[0.25em] text-cyan-glow">
                          {r.ghostWord}
                        </span>
                        <h3 className="t-h3 mt-4">{r.title}</h3>
                        <span className="mt-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-ink-500 transition-colors group-hover:text-cyan-glow">
                          Read
                          <span className="h-px w-14 origin-left scale-x-[0.428571] bg-current transition-transform duration-500 group-hover:scale-x-100" />
                        </span>
                      </div>
                    </div>
                  </TiltPlane>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-x bg-space-950 pb-24 pt-12 lg:pb-32 lg:pt-16">
        <div className="surface glow-border mx-auto flex max-w-4xl flex-col items-center gap-8 rounded-[1.75rem] p-10 text-center sm:p-14">
          <h2 className="t-h2 max-w-2xl">Ready to put your product through the same test plan?</h2>
          <Magnetic strength={0.35}>
            <Link to="/contact" className="btn-base btn-primary">
              Contact Our Team
            </Link>
          </Magnetic>
        </div>
      </section>
    </>
  );
}
