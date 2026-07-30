type IconProps = { className?: string };

/**
 * The Optara mark: two broken concentric rings opening at the upper right,
 * where a linked node pair breaks out — the connection motif the whole
 * identity runs on. Painted in the brand gradient rather than
 * `currentColor`, so it reads the same on paper and on ink.
 *
 * The gradient id is fixed rather than generated: every instance defines an
 * identical gradient, so `url(#…)` resolving to whichever copy comes first
 * in the document paints correctly, and the component stays server-safe
 * (no hook, no client boundary).
 */
export function LogoMark({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient
          id="optara-mark"
          x1="0.05"
          y1="0.72"
          x2="0.95"
          y2="0.22"
          gradientUnits="objectBoundingBox"
        >
          <stop offset="0" stopColor="var(--brand-violet)" />
          <stop offset="1" stopColor="var(--brand-blue)" />
        </linearGradient>
      </defs>
      <g fill="none" stroke="url(#optara-mark)" strokeLinecap="round">
        {/* Outer ring, open across the upper right */}
        <path d="M 18.6 6.22 A 12.0 12.0 0 1 0 25.78 13.4" strokeWidth="1.5" />
        {/* Fine dashes along the bottom of the outer ring */}
        <path
          d="M 7.62 27.33 A 12.0 12.0 0 0 0 21.38 27.33"
          strokeWidth="1.5"
          strokeDasharray="1.4 2.5"
        />
        {/* Inner ring, opening on the same diagonal */}
        <path d="M 15.93 10.75 A 6.9 6.9 0 1 0 21.25 16.07" strokeWidth="1.9" />
        {/* The link that breaks out of the opening */}
        <path d="M 22.99 9.01 L 26.8 5.2" strokeWidth="1.1" />
      </g>
      <g fill="url(#optara-mark)">
        <circle cx="22.99" cy="9.01" r="1.7" />
        <circle cx="26.8" cy="5.2" r="2.4" />
      </g>
    </svg>
  );
}

export function ArrowIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export function CheckIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M4 12.5l5 5L20 6.5" />
    </svg>
  );
}

export function PlusIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

export function MenuIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M4 8h16M4 16h16" />
    </svg>
  );
}

export function CloseIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

const strokeProps = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "1.5",
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
  focusable: "false" as const,
};

export function BrandingIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...strokeProps}>
      <path d="M12 3l2.4 5.2 5.6.7-4.1 3.9 1 5.6L12 15.7 7.1 18.4l1-5.6L4 8.9l5.6-.7z" />
    </svg>
  );
}

export function SeoIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...strokeProps}>
      <circle cx="11" cy="11" r="6" />
      <path d="M20 20l-4.5-4.5M9 11h4M11 9v4" />
    </svg>
  );
}

export function AdsIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...strokeProps}>
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="3.6" />
      <path d="M12 4v2M12 18v2M4 12h2M18 12h2" />
    </svg>
  );
}

export function SocialIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...strokeProps}>
      <path d="M20 12.5a7 7 0 0 1-9.9 6.4L4 20.5l1.6-5.7A7 7 0 1 1 20 12.5z" />
      <path d="M9 12h.01M12 12h.01M15 12h.01" />
    </svg>
  );
}

export function WebIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...strokeProps}>
      <rect x="3" y="4" width="18" height="14" rx="2" />
      <path d="M3 8.5h18M6.5 6.2h.01M9 6.2h.01M10 15l1.6-2.6L10 9.8M14 15h-2" />
    </svg>
  );
}

export function AppIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...strokeProps}>
      <rect x="7" y="2.5" width="10" height="19" rx="2.5" />
      <path d="M7 6h10M7 17.5h10M11 20h2" />
    </svg>
  );
}
