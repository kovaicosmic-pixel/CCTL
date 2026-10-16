import * as SelectPrimitive from "@radix-ui/react-select";
import { Check, ChevronDown, ChevronUp } from "lucide-react";

/**
 * ThemedSelect — site-wide dropdown that matches the section it sits on.
 *
 * Native <select> menus are drawn by the OS (white list, blue highlight) and
 * ignore the page design, so every dropdown on the site uses this instead.
 * Built on Radix Select: keyboard + screen-reader support, and when `name` is
 * set it renders a hidden native select so FormData / form submit still work.
 */

export interface ThemedSelectOption {
  value: string;
  label: string;
}

interface Props {
  options: ThemedSelectOption[];
  placeholder: string;
  /** "dark" for navy sections/cards, "light" for white/grey sections */
  tone: "dark" | "light";
  value?: string;
  onValueChange?: (value: string) => void;
  name?: string;
  id?: string;
  required?: boolean;
  invalid?: boolean;
  disabled?: boolean;
  /** Classes for the closed box — pass the same input classes as sibling fields */
  triggerClassName: string;
  "aria-label"?: string;
}

const TONES = {
  dark: {
    content:
      "border-white/10 bg-[#0b1424]/95 text-slate-200 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.8),0_0_0_1px_rgba(26,108,245,0.08)] backdrop-blur-xl",
    item: "text-slate-200 data-[highlighted]:bg-[#1a6cf5]/20 data-[highlighted]:text-white data-[state=checked]:text-white",
    check: "text-[#5b9bff]",
    chevron: "text-slate-400",
    placeholder: "data-[placeholder]:text-slate-400",
    scroll: "text-slate-400",
  },
  light: {
    content:
      "border-slate-200 bg-white text-slate-700 shadow-[0_20px_50px_-16px_rgba(15,23,42,0.25)]",
    item: "text-slate-700 data-[highlighted]:bg-blue-50 data-[highlighted]:text-slate-900 data-[state=checked]:font-semibold data-[state=checked]:text-slate-900",
    check: "text-[#1a6cf5]",
    chevron: "text-slate-400",
    placeholder: "data-[placeholder]:text-slate-400",
    scroll: "text-slate-400",
  },
} as const;

export default function ThemedSelect({
  options,
  placeholder,
  tone,
  value,
  onValueChange,
  name,
  id,
  required,
  invalid,
  disabled,
  triggerClassName,
  "aria-label": ariaLabel,
}: Props) {
  const t = TONES[tone];
  return (
    <SelectPrimitive.Root
      // Radix treats "" as "no value"; undefined keeps the placeholder visible
      value={value === "" ? undefined : value}
      onValueChange={onValueChange}
      name={name}
      required={required}
      disabled={disabled}
    >
      <SelectPrimitive.Trigger
        id={id}
        aria-label={ariaLabel}
        aria-invalid={invalid || undefined}
        className={`flex items-center justify-between gap-2 text-left disabled:cursor-not-allowed disabled:opacity-60 ${t.placeholder} ${triggerClassName}`}
      >
        <span className="min-w-0 flex-1 truncate">
          <SelectPrimitive.Value placeholder={placeholder} />
        </span>
        <SelectPrimitive.Icon asChild>
          <ChevronDown
            className={`h-4 w-4 shrink-0 transition-transform duration-200 [[data-state=open]_&]:rotate-180 ${t.chevron}`}
          />
        </SelectPrimitive.Icon>
      </SelectPrimitive.Trigger>

      <SelectPrimitive.Portal>
        <SelectPrimitive.Content
          position="popper"
          sideOffset={6}
          className={`z-[200] max-h-[min(20rem,var(--radix-select-content-available-height))] w-[var(--radix-select-trigger-width)] min-w-[12rem] overflow-hidden rounded-xl border data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2 ${t.content}`}
        >
          <SelectPrimitive.ScrollUpButton className={`flex h-7 items-center justify-center ${t.scroll}`}>
            <ChevronUp className="h-4 w-4" />
          </SelectPrimitive.ScrollUpButton>
          <SelectPrimitive.Viewport className="p-1.5">
            {options.map((o) => (
              <SelectPrimitive.Item
                key={o.value}
                value={o.value}
                className={`relative flex w-full cursor-pointer select-none items-center rounded-lg py-2.5 pl-3 pr-9 text-sm outline-none transition-colors data-[disabled]:pointer-events-none data-[disabled]:opacity-50 ${t.item}`}
              >
                <SelectPrimitive.ItemText>{o.label}</SelectPrimitive.ItemText>
                <SelectPrimitive.ItemIndicator className="absolute right-3 flex items-center">
                  <Check className={`h-4 w-4 ${t.check}`} strokeWidth={2.5} />
                </SelectPrimitive.ItemIndicator>
              </SelectPrimitive.Item>
            ))}
          </SelectPrimitive.Viewport>
          <SelectPrimitive.ScrollDownButton className={`flex h-7 items-center justify-center ${t.scroll}`}>
            <ChevronDown className="h-4 w-4" />
          </SelectPrimitive.ScrollDownButton>
        </SelectPrimitive.Content>
      </SelectPrimitive.Portal>
    </SelectPrimitive.Root>
  );
}
