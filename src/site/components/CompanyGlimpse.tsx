import { useState } from "react";
import ClipReveal from "./motion/ClipReveal";

/**
 * CompanyGlimpse — a "Company Glimpse" video section for the homepage.
 *
 * Shows a poster image with a play button. The actual <video> element is only
 * mounted once the visitor clicks play, so the (potentially large) video file
 * is never downloaded on initial page load — keeping the homepage fast.
 *
 * Videos stay unloaded until a visitor presses play, keeping the homepage fast.
 */

function GlimpseVideo({
  src,
  poster,
  label,
}: {
  src: string;
  poster: string;
  label: string;
}) {
  const [playing, setPlaying] = useState(false);

  return (
    <div className="group relative mx-auto max-w-5xl">
      <div className="pointer-events-none absolute -inset-[1px] rounded-[1.5rem] bg-gradient-to-r from-cyan-glow/40 via-violet-glow/25 to-magenta-glow/15 opacity-70 blur-[2px]" />

      <div className="relative aspect-video overflow-hidden rounded-[1.5rem] border border-white/[0.08] bg-space-950 shadow-[0_60px_120px_-40px_rgba(0,0,0,0.6)]">
        {playing ? (
          <video
            className="h-full w-full"
            src={src}
            poster={poster}
            controls
            autoPlay
            playsInline
            preload="metadata"
          >
            Your browser does not support the video tag.
          </video>
        ) : (
          <button
            type="button"
            onClick={() => setPlaying(true)}
            className="absolute inset-0 h-full w-full cursor-pointer"
            aria-label={`Play ${label}`}
          >
            <img
              src={poster}
              alt={label}
              className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
              loading="lazy"
              decoding="async"
            />
            <span
              aria-hidden
              className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,13,29,0.25)_0%,rgba(2,13,29,0.55)_100%)]"
            />
            <span
              aria-hidden
              className="absolute left-1/2 top-1/2 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-cyan-glow/50 bg-white/[0.08] shadow-[0_0_40px_rgba(26,108,245,0.5)] backdrop-blur-md transition-transform duration-300 ease-out group-hover:scale-110 sm:h-24 sm:w-24"
            >
              <svg
                viewBox="0 0 24 24"
                className="ml-1 h-9 w-9 text-white sm:h-10 sm:w-10"
                fill="currentColor"
                aria-hidden
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>
          </button>
        )}
      </div>
    </div>
  );
}

export default function CompanyGlimpse() {
  return (
    <section
      className="glow-field section-y relative overflow-hidden"
      aria-label="Company glimpse"
    >
      <div className="container-x relative">
        <div className="text-center">
          <p className="section-eyebrow" style={{ color: "var(--color-cyan-glow)" }}>
            Company Glimpse
          </p>
          <span aria-hidden className="accent-rule mx-auto mt-3" />
          <h2 className="t-h1 mt-6 uppercase">
            A look inside <span className="text-cyan">who we are</span>
          </h2>
          <p className="t-lead mx-auto mt-6 max-w-2xl font-semibold text-ink-300">
            Hear from our leadership and get an overview of how Cosmic Compliance Test Lab
            delivers precise, trusted EMC testing.
          </p>
        </div>

        <ClipReveal direction="bottom" duration={0.9} className="mt-14">
          <GlimpseVideo
            src="/videos/company-overview.mp4"
            poster="/images/about_us.webp"
            label="Cosmic Compliance Test Lab company overview"
          />
        </ClipReveal>
        <ClipReveal direction="bottom" duration={0.9} className="mt-8">
          <GlimpseVideo
            src="/videos/cosmic%20video.mp4"
            poster="/images/cosmic-video-poster.webp"
            label="Cosmic Compliance Test Lab video"
          />
        </ClipReveal>
      </div>
    </section>
  );
}
