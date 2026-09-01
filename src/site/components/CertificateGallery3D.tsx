import { useRef, useState } from "react";
import { motion } from "framer-motion";

interface CertificateItem {
  title: string;
  code: string;
  issuer: string;
  image: string;
}

interface CertificateGallery3DProps {
  items: CertificateItem[];
  itemHeight?: number;
  gap?: number;
  perspective?: number;
  hoverScale?: number;
  transitionDuration?: number;
  className?: string;
}

export default function CertificateGallery3D({
  items,
  itemHeight = 520,
  gap = 10,
  perspective = 1000,
  hoverScale = 1,
  transitionDuration = 0.35,
  className,
}: CertificateGallery3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const handleHover = (index: number) => {
    setActiveIndex(index);
  };

  const handleLeave = () => {
    setActiveIndex(null);
  };

  const handleKeyDown = (event: React.KeyboardEvent, index: number) => {
    switch (event.key) {
      case "ArrowLeft": {
        event.preventDefault();
        const prevIndex = index > 0 ? index - 1 : items.length - 1;
        (containerRef.current?.children[prevIndex] as HTMLElement)?.focus();
        break;
      }
      case "ArrowRight": {
        event.preventDefault();
        const nextIndex = index < items.length - 1 ? index + 1 : 0;
        (containerRef.current?.children[nextIndex] as HTMLElement)?.focus();
        break;
      }
      case "Escape":
        setActiveIndex(null);
        break;
    }
  };

  return (
    <div className={`w-full overflow-hidden py-4 ${className ?? ""}`} onMouseLeave={handleLeave}>
      <div
        ref={containerRef}
        className="flex w-full"
        style={{
          perspective: `${perspective}px`,
          transformStyle: "preserve-3d",
          gap: `${gap}px`,
        }}
      >
        {items.map((item, index) => {
          const isActive = activeIndex === index;
          const hasActive = activeIndex !== null;

          return (
            <motion.div
              key={index}
              role="button"
              tabIndex={0}
              onMouseEnter={() => handleHover(index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              aria-label={item.title}
              layout
              animate={{
                rotateY: !hasActive
                  ? 0
                  : index < activeIndex!
                    ? 18
                    : index > activeIndex!
                      ? -18
                      : 0,
              }}
              transition={{
                layout: { type: "spring", stiffness: 120, damping: 20 },
                rotateY: { type: "spring", stiffness: 100, damping: 18 },
              }}
              style={{
                height: `${itemHeight}px`,
                zIndex: isActive ? 20 : 10,
                flex: isActive ? 3.5 : 1,
                minWidth: isActive ? "300px" : "80px",
                maxWidth: isActive ? "380px" : undefined,
                transformStyle: "preserve-3d",
              }}
              className={[
                "relative cursor-pointer select-none overflow-hidden rounded-2xl border transition-all duration-300",
                isActive
                  ? "border-cyan-glow/50 shadow-[0_12px_40px_-10px_rgba(26,108,245,0.3)]"
                  : hasActive
                    ? "border-line-strong/8 brightness-[0.85] grayscale-[0.4]"
                    : "border-line-strong/10 hover:border-cyan-glow/30",
                "bg-space-800-solid",
              ].join(" ")}
            >
              {/* === DEFAULT STATE: Blurred image bg + Title & Issuer text === */}
              {!isActive && (
                <>
                  <img
                    src={item.image}
                    alt=""
                    aria-hidden
                    className="nav-logo absolute inset-0 w-full h-full opacity-30"
                    style={{ objectFit: "cover", filter: "blur(3px)" }}
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="absolute inset-0 bg-[rgba(7,13,24,0.6)] z-[2]" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center z-[3]">
                    <span className="font-mono text-[0.55rem] font-bold tracking-[0.2em] text-cyan-glow uppercase">
                      {item.code}
                    </span>
                    <h4 className="font-display text-[0.7rem] font-extrabold uppercase leading-tight tracking-[-0.01em] text-white mt-2 max-w-[90%]">
                      {item.title}
                    </h4>
                    <p className="text-[0.55rem] text-white/80 font-semibold mt-1.5 max-w-[90%] leading-relaxed">
                      {item.issuer}
                    </p>
                    <span className="block h-[2px] w-6 rounded-full bg-cyan-glow/40 mt-3" />
                  </div>
                </>
              )}

              {/* === HOVER STATE: Full certificate image (clear) === */}
              {isActive && (
                <motion.img
                  src={item.image}
                  alt={item.title}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: hoverScale }}
                  transition={{ duration: transitionDuration, ease: [0.2, 0.8, 0.2, 1] }}
                  className="nav-logo absolute inset-0 w-full h-full"
                  style={{ objectFit: "contain" }}
                />
              )}

              {/* Index badge — always visible */}
              <div className="absolute left-3 top-3 z-[5]">
                <span
                  className={[
                    "font-mono text-[0.55rem] font-bold tracking-[0.18em] rounded-full px-2 py-0.5",
                    isActive
                      ? "bg-cyan-glow text-white shadow-[0_2px_8px_rgba(26,108,245,0.4)]"
                      : "bg-space-950/80 text-ink-500",
                  ].join(" ")}
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
