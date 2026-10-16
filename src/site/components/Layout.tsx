import { useRouterState } from "@tanstack/react-router";
import type { ReactNode } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import ScrollProgressBar from "./ScrollProgressBar";

export default function Layout({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isHome = pathname === "/";
  // The careers admin panel is a standalone app — no public navbar/footer around it
  if (pathname.startsWith("/careers/admin")) return <>{children}</>;
  return (
    <div className="flex min-h-screen flex-col">
      <ScrollProgressBar />
      <Navbar />
      <main className={`relative z-10 flex-1 ${isHome ? "" : "pt-[4.5rem]"}`}>{children}</main>
      <Footer />
      <div aria-hidden className="film-grain" />
    </div>
  );
}
