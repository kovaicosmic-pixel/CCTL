export default function SectionHeading({
  eyebrow,
  title,
  body,
  center = true,
  as: Heading = "h2",
}: {
  eyebrow?: string;
  title: string;
  body?: string;
  center?: boolean;
  as?: "h1" | "h2";
}) {
  return (
    <div className={center ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      {eyebrow && (
        <>
          <span className="font-mono block text-[0.6875rem] font-bold uppercase tracking-[0.28em] text-cyan-glow">
            {eyebrow}
          </span>
          <span aria-hidden className={`accent-rule mt-3 ${center ? "mx-auto" : ""}`} />
        </>
      )}
      <Heading className="t-h2 mt-5">{title}</Heading>
      {body && <p className="t-lead mt-5">{body}</p>}
    </div>
  );
}
