/**
 * Breadcrumb — visible navigation trail rendered as a semantic <nav> element.
 *
 * Usage:
 *   <Breadcrumb items={[{ name: "Home", path: "/" }, { name: "Services", path: "/services" }, { name: "EMC Testing" }]} />
 *
 * The last item should omit `path` (it represents the current page).
 * Renders both the HTML landmark and matches the JSON-LD BreadcrumbList schema
 * already injected via the route's head() function.
 */

import { Link } from "@tanstack/react-router";

export interface BreadcrumbItem {
  name: string;
  /** Omit for the current (last) page — it renders as plain text, not a link. */
  path?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export default function Breadcrumb({ items, className = "" }: BreadcrumbProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={`flex items-center flex-wrap gap-x-2 gap-y-1 text-[0.72rem] font-semibold uppercase tracking-[0.12em] ${className}`}
    >
      <ol className="flex items-center flex-wrap gap-x-2 gap-y-1 list-none p-0 m-0">
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return (
            <li key={`${item.name}-${i}`} className="flex items-center gap-x-2">
              {isLast || !item.path ? (
                <span
                  aria-current={isLast ? "page" : undefined}
                  className="text-ink-300"
                >
                  {item.name}
                </span>
              ) : (
                <Link
                  to={item.path}
                  className="text-ink-500 transition-colors hover:text-cyan-glow"
                >
                  {item.name}
                </Link>
              )}
              {!isLast && (
                <span aria-hidden="true" className="text-ink-500/40 select-none">
                  /
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
