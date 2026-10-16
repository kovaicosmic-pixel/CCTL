import { motion } from "framer-motion";
import { GradientOrbs } from "@/site/components/bg";
import FloatingStandards from "@/site/components/bg/FloatingStandards";

export default function CareersHero() {
  return (
    <section className="relative flex min-h-[70vh] items-center overflow-hidden bg-space-950 pt-24 pb-20">
      <GradientOrbs variant="default" />
      <FloatingStandards count={8} opacity={0.3} />

      {/* Ghost watermark */}
      <span
        aria-hidden
        className="pointer-events-none absolute right-[-4rem] top-1/2 -translate-y-1/2 select-none font-display text-[clamp(6rem,18vw,16rem)] font-black uppercase leading-none tracking-tighter text-white/[0.025]"
      >
        CAREERS
      </span>

      <div className="relative z-10 mx-auto w-full max-w-7xl px-5 lg:px-8">
        <div className="max-w-3xl">
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="font-mono block text-[0.6875rem] font-bold uppercase tracking-[0.28em] text-cyan-glow">
              Join Our Team
            </span>
            <span aria-hidden className="accent-rule mt-3" />
          </motion.div>

          {/* Heading */}
          <motion.h1
            className="font-display mt-5 text-[clamp(2.5rem,6vw,4.5rem)] font-black leading-[1.05] tracking-tight text-ink-100"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Build the Future of{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-glow to-violet-glow">
              EMC Testing
            </span>
          </motion.h1>

          {/* Subtext */}
          <motion.p
            className="t-lead mt-6 max-w-2xl text-ink-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            At Cosmic Compliance Test Lab, we work at the intersection of precision
            engineering and global standards. Join a team of specialists pushing the
            boundaries of electromagnetic testing across automotive, defence, railway,
            and telecom industries.
          </motion.p>

          {/* CTA */}
          <motion.div
            className="mt-8 flex flex-wrap items-center gap-4"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <a
              href="#open-positions"
              className="btn-base btn-primary"
            >
              View Open Positions
            </a>
            <a
              href="/careers/apply"
              className="inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-slate-200 transition-colors hover:border-cyan-glow/60 hover:text-ink-100"
            >
              Send Speculative CV
            </a>
          </motion.div>
        </div>

        {/* Stats strip */}
        <motion.div
          className="mt-16 grid grid-cols-3 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 backdrop-blur"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
        >
          {[
            { value: "2", label: "Lab Locations" },
            { value: "25+", label: "Expert Engineers" },
            { value: "5+", label: "Years of Excellence" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col items-center justify-center gap-1 bg-space-950/90 px-4 py-6 text-center"
            >
              <span className="font-display text-3xl font-black text-cyan-glow">
                {stat.value}
              </span>
              <span className="text-xs font-medium uppercase tracking-widest text-slate-400">
                {stat.label}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
