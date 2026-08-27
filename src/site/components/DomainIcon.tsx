import { Car, Cpu, Radio, ShieldCheck, TrainFront } from "lucide-react";
import type { ServiceDomain } from "../data/content";

const MAP = {
  shield: ShieldCheck,
  cpu: Cpu,
  car: Car,
  train: TrainFront,
  radio: Radio,
} as const;

export default function DomainIcon({
  name,
  className = "h-6 w-6",
}: {
  name: ServiceDomain["icon"];
  className?: string;
}) {
  const Icon = MAP[name] ?? Cpu;
  return <Icon className={className} strokeWidth={1.5} aria-hidden="true" />;
}
