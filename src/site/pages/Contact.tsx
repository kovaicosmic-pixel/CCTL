import { useState } from "react";
import { motion } from "framer-motion";
import ConsultationForm from "../components/ConsultationForm";
import Magnetic from "../components/motion/Magnetic";
import ParticleField from "../components/bg/ParticleField";
import GradientOrbs from "../components/bg/GradientOrbs";
import { company } from "../data/content";

const details = [
  { label: "Email", values: company.emails, hrefs: company.emails.map((email) => `mailto:${email}`) },
  { label: "Phone", values: company.phones, hrefs: company.phones.map((phone) => `tel:${phone.replace(/\s/g, "")}`) },
  { label: "Hours", values: [company.hours] },
  { label: "Address", values: company.locations.map((location) => location.address) },
];

export default function Contact() {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <div className="overflow-x-hidden bg-space-950 text-ink-100">
      {/* Particle field + orbs behind the hero heading */}
      <section className="relative overflow-hidden bg-space-950 px-6 pb-0 pt-20 sm:px-10 lg:px-16 lg:pt-28">
        <ParticleField className="z-0 opacity-50" particleCount={35} speed={0.15} />
        <GradientOrbs variant="subtle" />
        <div className="mx-auto max-w-[1500px]">
          <div className="relative pt-8 text-center lg:pt-10">
            <h1 className="font-display text-[clamp(4rem,11vw,18rem)] font-extrabold leading-[0.8] tracking-[-0.06em] text-ink-100">
              <span className="block">Don&rsquo;t Hesitate</span>
              <span className="block">
                to Talk <span className="text-outline-heading text-outline-heading">EMC</span>
              </span>
            </h1>
            <p className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-ink-300 sm:text-2xl">
              Reach out and our team will get back to you with a tailored test plan and quote.
            </p>
          </div>
        </div>
      </section>

      <section className="relative bg-space-950 pb-14 pt-12 sm:pt-16 lg:pb-20 lg:pt-20">
        <div className="mx-auto max-w-[1400px] px-6 sm:px-10 lg:px-16">
          <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div className="lg:pr-6">
              <h2 className="font-display text-[clamp(2.5rem,5vw,5rem)] font-extrabold leading-[0.9] tracking-[-0.06em] text-ink-100">
                Get in touch
              </h2>

              <div className="mt-8 border-t border-line-strong/10">
                {details.map((d) => (
                  <div
                    key={d.label}
                    className="relative border-b border-line-strong/10 py-5"
                    onMouseEnter={() => setHovered(d.label)}
                    onMouseLeave={() => setHovered(null)}
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-8">
                      <span className="min-w-[110px] font-mono text-[0.7rem] font-bold uppercase tracking-[0.28em] text-ink-300 sm:pt-1">
                        {d.label}
                      </span>

                      <div className="flex-1 space-y-2 text-base leading-relaxed text-ink-100 sm:text-[1.1rem]">
                        {d.values.map((value, index) => {
                          const href = d.hrefs?.[index];

                          return href ? (
                            <a
                              key={`${d.label}-${value}`}
                              href={href}
                              className="block transition-colors hover:text-ink-100"
                            >
                              {value}
                            </a>
                          ) : (
                            <p key={`${d.label}-${value}`} className="leading-relaxed text-ink-100">
                              {value}
                            </p>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[2rem] bg-[#081d2f] p-6 shadow-[0_30px_80px_-32px_rgba(14,31,48,0.6)] sm:p-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
              >
                <ConsultationForm signature />
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-line-strong/10 bg-space-950 px-6 pb-20 pt-10 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-[1400px]">
          <div className="surface overflow-hidden rounded-[1.5rem] p-1.5">
            <div className="flex items-center justify-between border-b border-line-strong/10 px-4 py-3 sm:px-6">
              <span className="font-mono text-[0.7rem] font-bold uppercase tracking-[0.28em] text-ink-100">
                Our locations
              </span>
              <a
                href="https://maps.google.com/?q=Annamalai+Industrial+Park+Coimbatore"
                target="_blank"
                rel="noreferrer"
                className="font-mono text-[0.7rem] font-bold uppercase tracking-[0.24em] text-ink-300"
              >
                Open in Maps ↗
              </a>
            </div>

            <div className="p-4 sm:p-5">
              <div className="grid gap-5 lg:grid-cols-2">
                <div className="overflow-hidden rounded-[1.25rem] border border-[#101828]/10 bg-[#f8fafd]">
                  <div className="flex items-center justify-between border-b border-[#101828]/10 px-4 py-3">
                    <span className="font-mono text-[0.6rem] font-bold uppercase tracking-[0.18em] text-[#0f172a]">
                      Coimbatore Lab
                    </span>
                    <a
                      href="https://maps.google.com/?q=Cosmic+Compliance+Test+Lab+Coimbatore"
                      target="_blank"
                      rel="noreferrer"
                      className="font-mono text-[0.56rem] font-bold uppercase tracking-[0.18em] text-cyan-glow"
                    >
                      Open in Maps ↗
                    </a>
                  </div>

                  <iframe
                    title="Cosmic Compliance Test Lab Coimbatore"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3915.569600608087!2d77.0325545!3d11.0708602!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba8f90018e334e5%3A0xb45fb98558d47a7d!2sCosmic%20Compliance%20Test%20Lab!5e0!3m2!1sen!2sin!4v1787400856665!5m2!1sen!2sin"
                    className="block h-[260px] w-full border-0"
                    loading="lazy"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                  />

                  <div className="space-y-2 p-4 text-sm text-[#1e293b]">
                    <p className="font-bold text-[#0f172a]">CCTL Coimbatore</p>
                    <p className="leading-relaxed font-medium">Annamalai Industrial Park, SF219, Sharp Nagar, Nehru Nagar West, Kalapatti, Coimbatore, Tamil Nadu 641048</p>
                  </div>
                </div>

                <div className="overflow-hidden rounded-[1.25rem] border border-[#101828]/10 bg-[#f8fafd]">
                  <div className="flex items-center justify-between border-b border-[#101828]/10 px-4 py-3">
                    <span className="font-mono text-[0.6rem] font-bold uppercase tracking-[0.18em] text-[#0f172a]">
                      Bangalore Lab
                    </span>
                    <a
                      href="https://maps.google.com/?q=Cosmic+Compliance+Test+Lab+Bangalore"
                      target="_blank"
                      rel="noreferrer"
                      className="font-mono text-[0.56rem] font-bold uppercase tracking-[0.18em] text-cyan-glow"
                    >
                      Open in Maps ↗
                    </a>
                  </div>

                  <iframe
                    title="Cosmic Compliance Test Lab Bangalore"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3890.5225365777483!2d77.7017882!3d12.809474499999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae6d1297622b09%3A0xce2dcc254274ad3c!2sCosmic%20Compliance%20Test%20Lab!5e0!3m2!1sen!2sin!4v1787400916999!5m2!1sen!2sin"
                    className="block h-[260px] w-full border-0"
                    loading="lazy"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                  />

                  <div className="space-y-2 p-4 text-sm text-[#1e293b]">
                    <p className="font-bold text-[#0f172a]">CCTL Bangalore</p>
                    <p className="leading-relaxed font-medium">Sy No.192/1, A-1, Munireddy Industrial Estate, 3rd Phase, Bommasandra Village, Attibele Hobli, Anekal Taluk, Bangalore - 560099</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
