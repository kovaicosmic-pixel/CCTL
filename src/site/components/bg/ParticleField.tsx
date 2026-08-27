import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import { useIsDesktop } from "../../hooks/useIsDesktop";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  opacity: number;
}

/**
 * Canvas-based constellation particle field.
 * Renders floating dots connected by lines when close enough — like a neural
 * network or signal constellation. Performant via requestAnimationFrame + canvas.
 *
 * Respects prefers-reduced-motion (renders static dots, no animation).
 * Only renders on desktop (>1024px) to save mobile battery.
 */
export default function ParticleField({
  className = "",
  particleCount = 60,
  connectionDistance = 140,
  particleColor = "rgba(26, 108, 245, 0.6)",
  lineColor = "rgba(26, 108, 245, 0.12)",
  speed = 0.3,
}: {
  className?: string;
  particleCount?: number;
  connectionDistance?: number;
  particleColor?: string;
  lineColor?: string;
  speed?: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reducedMotion = useReducedMotion();
  const isDesktop = useIsDesktop(1024);
  const animRef = useRef<number>(0);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: -1000, y: -1000 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !isDesktop) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener("resize", resize);

    // Initialize particles
    const rect = canvas.getBoundingClientRect();
    particlesRef.current = Array.from({ length: particleCount }, () => ({
      x: Math.random() * rect.width,
      y: Math.random() * rect.height,
      vx: (Math.random() - 0.5) * speed,
      vy: (Math.random() - 0.5) * speed,
      radius: Math.random() * 1.5 + 0.5,
      opacity: Math.random() * 0.5 + 0.3,
    }));

    // Mouse tracking for interactive glow
    const onMouseMove = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - r.left, y: e.clientY - r.top };
    };
    const onMouseLeave = () => {
      mouseRef.current = { x: -1000, y: -1000 };
    };
    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mouseleave", onMouseLeave);

    const draw = () => {
      const { width, height } = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, width, height);

      const particles = particlesRef.current;
      const mouse = mouseRef.current;

      // Update positions
      if (!reducedMotion) {
        for (const p of particles) {
          p.x += p.vx;
          p.y += p.vy;

          // Bounce off edges
          if (p.x < 0 || p.x > width) p.vx *= -1;
          if (p.y < 0 || p.y > height) p.vy *= -1;

          // Clamp
          p.x = Math.max(0, Math.min(width, p.x));
          p.y = Math.max(0, Math.min(height, p.y));
        }
      }

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < connectionDistance) {
            const opacity = 1 - dist / connectionDistance;
            ctx.beginPath();
            ctx.strokeStyle = lineColor.replace(/[\d.]+\)$/, `${opacity * 0.4})`);
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw connections to mouse (interactive radius)
      const mouseRadius = 200;
      for (const p of particles) {
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouseRadius) {
          const opacity = 1 - dist / mouseRadius;
          ctx.beginPath();
          ctx.strokeStyle = `rgba(26, 108, 245, ${opacity * 0.35})`;
          ctx.lineWidth = 0.8;
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
        }
      }

      // Draw particles
      for (const p of particles) {
        // Glow near mouse
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const distToMouse = Math.sqrt(dx * dx + dy * dy);
        const glowBoost = distToMouse < 200 ? (1 - distToMouse / 200) * 0.6 : 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius + glowBoost * 2, 0, Math.PI * 2);
        ctx.fillStyle = particleColor.replace(/[\d.]+\)$/, `${p.opacity + glowBoost})`);
        ctx.fill();

        // Add subtle glow halo to brighter particles
        if (p.opacity > 0.5 || glowBoost > 0.2) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius * 3 + glowBoost * 4, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(26, 108, 245, ${(p.opacity * 0.15 + glowBoost * 0.2)})`;
          ctx.fill();
        }
      }

      animRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("mousemove", onMouseMove);
      canvas.removeEventListener("mouseleave", onMouseLeave);
    };
  }, [isDesktop, reducedMotion, particleCount, connectionDistance, particleColor, lineColor, speed]);

  if (!isDesktop) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-auto absolute inset-0 ${className}`}
      style={{ width: "100%", height: "100%" }}
    />
  );
}
