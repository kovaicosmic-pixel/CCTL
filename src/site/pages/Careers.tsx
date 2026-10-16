import { useQuery } from "@tanstack/react-query";
import { Mail, ArrowRight } from "lucide-react";
import CareersHero from "@/site/components/careers/CareersHero";
import WhyJoinUs from "@/site/components/careers/WhyJoinUs";
import JobListings from "@/site/components/careers/JobListings";
import { GradientOrbs } from "@/site/components/bg";
import { listActiveJobs } from "@/site/lib/careersAdmin";

export default function Careers() {
  const { data, isLoading } = useQuery({
    queryKey: ["active-jobs"],
    queryFn: () => listActiveJobs(),
    staleTime: 60_000,
  });

  const jobs = data?.jobs ?? [];

  return (
    <>
      {/* Dark → light → white → dark rhythm, matching the home page */}
      <CareersHero />
      <WhyJoinUs />
      <JobListings key={isLoading ? "loading" : "ready"} jobs={jobs} isLoading={isLoading} />

      {/* Footer CTA */}
      <section className="relative overflow-hidden bg-space-950 py-24">
        <GradientOrbs variant="subtle" />
        <div className="relative z-10 mx-auto max-w-4xl px-5 lg:px-8">
          <div className="rounded-3xl border border-white/[0.08] bg-gradient-to-br from-[#0f1a2e] to-[#0a1220] px-8 py-12 text-center shadow-[0_40px_100px_-40px_rgba(26,108,245,0.45)] sm:px-14">
            <span className="font-mono block text-[0.6875rem] font-bold uppercase tracking-[0.28em] text-cyan-glow">
              Stay Connected
            </span>
            <span aria-hidden className="accent-rule mx-auto mt-3" />
            <h2 className="font-display mt-5 text-3xl font-black text-white sm:text-4xl">
              Don't see the right role?
            </h2>
            <p className="mx-auto mt-4 max-w-xl leading-relaxed text-slate-300">
              We're always looking for talented EMC engineers. Send us your CV and tell us how
              you'd contribute — we'd love to hear from you.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a
                href="/careers/apply"
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-glow to-violet-glow px-7 py-3.5 text-sm font-bold text-white shadow-[0_8px_30px_-8px_rgba(26,108,245,0.7)] transition-all hover:brightness-110"
              >
                <Mail className="h-4 w-4" aria-hidden />
                Send your CV
                <ArrowRight className="h-4 w-4" aria-hidden />
              </a>
              <span className="text-sm text-slate-400">Choose your role &amp; preferred lab</span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
