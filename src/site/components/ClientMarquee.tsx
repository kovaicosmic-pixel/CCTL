import { clientLogos } from "../data/content";

/** Client logo marquee — continuous auto-scrolling rows of client logos. */
export default function ClientMarquee() {
  const rowA = clientLogos.filter((_, i) => i % 2 === 0);
  const rowB = clientLogos.filter((_, i) => i % 2 === 1);

  return (
    <div className="relative space-y-4 overflow-hidden py-2">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-space-900 to-transparent sm:w-28" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-space-900 to-transparent sm:w-28" />

      <div className="overflow-hidden">
        <div className="marquee-track">
          {[...rowA, ...rowA].map((src, i) => (
            <img
              key={`a-${i}`}
              src={src}
              alt={`Client ${(i % rowA.length) + 1}`}
              className="nav-logo mx-3 h-16 w-28 shrink-0 rounded-lg border border-white/8 bg-white/[0.06] object-contain p-2 shadow-sm sm:h-20 sm:w-36"
              loading="lazy"
              decoding="async"
              width={144}
              height={80}
            />
          ))}
        </div>
      </div>

      <div className="overflow-hidden">
        <div className="marquee-track marquee-track-reverse">
          {[...rowB, ...rowB].map((src, i) => (
            <img
              key={`b-${i}`}
              src={src}
              alt={`Client ${(i % rowB.length) + 1}`}
              className="nav-logo mx-3 h-16 w-28 shrink-0 rounded-lg border border-white/8 bg-white/[0.06] object-contain p-2 shadow-sm sm:h-20 sm:w-36"
              loading="lazy"
              decoding="async"
              width={144}
              height={80}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
