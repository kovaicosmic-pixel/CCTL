import { useRef, useState, type KeyboardEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";

/**
 * Faithful port of the reference "3D Hover Gallery" mechanics — flex-grow +
 * rotateY tilt on neighbours, grayscale/brightness silhouette at rest,
 * full-colour reveal on hover/focus/tap — onto CCTL's own certificate
 * images and a single accent glow instead of per-item neon hues (the site
 * stays one accent colour throughout, per the existing design system).
 */
export type CertificateItem = {
  title: string;
  code: string;
  issuer?: string;
  image?: string;
};

export default function CertificateHoverGallery({ items }: { items: CertificateItem[] }) {
  const [active, setActive] = useState<number | null>(null);
  const [focused, setFocused] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const focusItem = (index: number) => {
    const el = containerRef.current?.children[index] as HTMLElement | undefined;
    el?.focus();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>, i: number) => {
    switch (e.key) {
      case "Enter":
      case " ":
        e.preventDefault();
        setActive((cur) => (cur === i ? null : i));
        break;
      case "Escape":
        setActive(null);
        break;
      case "ArrowLeft":
        e.preventDefault();
        focusItem(Math.max(0, i - 1));
        break;
      case "ArrowRight":
        e.preventDefault();
        focusItem(Math.min(items.length - 1, i + 1));
        break;
    }
  };

  return (
    <div
      className="flex w-full items-center justify-center overflow-x-auto py-2"
      onMouseLeave={() => setActive(null)}
    >
      <div ref={containerRef} className="flex w-full items-center" style={{ gap: "10px" }}>
        {items.map((c, i) => {
          const isActive = active === i;
          const isFocused = focused === i;
          return (
            <motion.div
              key={c.title}
              role="button"
              tabIndex={0}
              aria-label={`${c.title} — view full certificate`}
              aria-pressed={isActive}
              onClick={() => setActive(i)}
              onMouseEnter={() => setActive(i)}
              onFocus={() => setFocused(i)}
              onBlur={() => setFocused(null)}
              onKeyDown={(e) => handleKeyDown(e, i)}
              layout
              transition={{ layout: { type: "spring", stiffness: 100, damping: 17 } }}
              style={{
                zIndex: isActive ? 20 : 10,
                flex: isActive ? 5.8 : 1,
                minWidth: isActive ? "17rem" : "3.75rem",
              }}
              className={`relative h-72 cursor-pointer select-none overflow-hidden rounded-2xl border shrink-0 bg-space-900 shadow-sm transition-all duration-300 sm:h-80 ${
                isActive
                  ? "border-line-strong/20"
                  : "border-line-strong/10 hover:border-line-strong/20"
              } ${isFocused ? "ring-2 ring-cyan-glow ring-offset-2" : ""}`}
            >
              {/* Image and caption are separate flex children — never stacked —
                  so the caption can never land on top of (and obscure) the
                  certificate's own text, however tall or oddly-shaped the
                  scanned document is. Certificate stays normally visible at
                  rest (this is a real document, not decorative art) —
                  hovering only enlarges it for a clearer read, it doesn't
                  reveal something that was hidden. */}
              <div className="flex h-full flex-col">
                <div className="relative min-h-0 flex-1 bg-space-800-solid">
                  {c.image && (
                    <motion.img
                      src={c.image}
                      alt={c.title}
                      animate={{ scale: isActive ? 1.03 : 1 }}
                      transition={{ duration: 0.5, ease: [0.1, 0.7, 0, 1] }}
                      className="h-full w-full object-contain p-3"
                    />
                  )}
                </div>

                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      className="shrink-0 overflow-hidden bg-ink-100"
                    >
                      <div className="p-4 sm:p-5">
                        {c.issuer && (
                          <p className="mb-1 font-mono text-[0.6rem] font-black uppercase tracking-widest text-cyan-glow">
                            {c.issuer}
                          </p>
                        )}
                        <h4 className="mb-1 text-base font-bold leading-tight tracking-tight text-white md:text-lg">
                          {c.title}
                        </h4>
                        <p className="meta mb-3 text-white/50">{c.code}</p>
                        <div className="group/btn flex items-center gap-1 font-mono text-[0.6rem] font-bold uppercase tracking-widest text-white hover:text-cyan-glow">
                          <span>View certificate</span>
                          <ArrowRight className="h-3 w-3 transition-transform duration-200 group-hover/btn:translate-x-1" />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
