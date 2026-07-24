type IconProps = { className?: string };

export function LogoMark({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <g transform="rotate(-35 12 12)" fill="currentColor">
        <rect x="5" y="2" width="5.2" height="20" rx="2.6" />
        <rect x="13" y="6" width="5.2" height="12" rx="2.6" />
      </g>
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
      strokeWidth="3"
      strokeLinecap="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M12 5v14M5 12h14" />
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
      strokeWidth="3"
      strokeLinecap="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

export function GridIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 12 12"
      className={className}
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="3.6" cy="3.6" r="1.5" />
      <circle cx="8.4" cy="3.6" r="1.5" />
      <circle cx="3.6" cy="8.4" r="1.5" />
      <circle cx="8.4" cy="8.4" r="1.5" />
    </svg>
  );
}
