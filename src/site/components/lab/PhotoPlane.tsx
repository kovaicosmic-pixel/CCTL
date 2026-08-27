type PhotoPlaneProps = {
  /** Real CCTL laboratory photograph. */
  src: string;
  alt: string;
  /** Short technical caption overlaid near the corner. */
  code?: string;
  className?: string;
  imgClassName?: string;
  /** Depth tint used only while an image is loading/absent — deeper planes read darker. */
  depth?: "near" | "mid" | "far";
};

const depthClass: Record<NonNullable<PhotoPlaneProps["depth"]>, string> = {
  near: "bg-space-700",
  mid: "bg-space-800-solid",
  far: "bg-space-900",
};

/** A photographic surface used as a spatial plane across the reworked Home scenes — ported from
 *  the reference's PhotoPlane, wired to real CCTL photography instead of the placeholder
 *  technical-surface fallback it originally rendered when no photo was supplied. */
export function PhotoPlane({
  src,
  alt,
  code,
  className = "",
  imgClassName = "",
  depth = "mid",
}: PhotoPlaneProps) {
  return (
    <figure
      className={`relative isolate overflow-hidden ${depthClass[depth]} ${className}`}
      data-photo-slot={code ?? alt}
    >
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className={`h-full w-full object-cover ${imgClassName}`}
      />
      {code && (
        <>
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-space-950/70 via-transparent to-transparent" />
          <div className="pointer-events-none absolute left-4 top-4 h-px w-8 bg-cyan-glow/70 sm:left-6 sm:top-6" />
        </>
      )}
    </figure>
  );
}
