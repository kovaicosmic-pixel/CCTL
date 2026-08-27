/**
 * An accreditation plate that displays the actual certificate image as the
 * full card background, with a subtle overlay for legibility of the metadata.
 */
export default function CertificatePlate({
  title,
  code,
  issuer,
  image,
  index = 0,
}: {
  title: string;
  code: string;
  issuer?: string;
  image?: string;
  index?: number;
}) {
  return (
    <div className="group/cert relative flex h-full flex-col overflow-hidden rounded-[1.25rem] border border-white/8 bg-space-800-solid shadow-[inset_0_1px_0_rgba(255,255,255,0.04),0_1px_2px_rgba(0,0,0,0.2),0_22px_46px_-32px_rgba(0,0,0,0.5)] transition-[transform,box-shadow] duration-500 hover:-translate-y-1 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_2px_4px_rgba(0,0,0,0.25),0_34px_64px_-34px_rgba(26,108,245,0.3)]">
      {/* Certificate image */}
      {image && (
        <img
          src={image}
          alt={title}
          className="nav-logo w-full object-contain transition-transform duration-700 group-hover/cert:scale-[1.03]"
        />
      )}

      {/* Fallback gradient if no image */}
      {!image && (
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(120% 90% at 50% -10%, color-mix(in oklab, var(--color-cyan-glow, #1a6cf5) 18%, transparent), transparent 60%)",
          }}
        />
      )}

      {/* Top corner index */}
      <div className="absolute left-4 top-4 z-10">
        <span className="meta rounded-full bg-space-950/70 px-2 py-0.5 backdrop-blur-sm">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>

      {/* Title below image */}
      <div className="border-t border-line-strong/8 p-5">
        <h3 className="font-display text-[0.8rem] font-extrabold uppercase leading-[1.25] tracking-[-0.01em] text-ink-100">
          {title}
        </h3>
        <p className="meta mt-2 text-ink-500">{code}</p>
      </div>
    </div>
  );
}
