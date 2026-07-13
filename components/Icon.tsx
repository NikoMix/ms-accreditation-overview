import type { AreaIcon } from '@/lib/catalog';

export type IconName =
  | AreaIcon
  | 'arrow'
  | 'external'
  | 'frontier'
  | 'github'
  | 'moon'
  | 'search'
  | 'sun';

export function Icon({
  name,
  className,
}: {
  name: IconName;
  className?: string;
}) {
  const common = {
    className,
    viewBox: '0 0 24 24',
    fill: 'none',
    'aria-hidden': true,
  };

  switch (name) {
    case 'cloud':
      return (
        <svg {...common}>
          <path
            d="M7.5 18.25h9.25a4.25 4.25 0 0 0 .42-8.48A6 6 0 0 0 5.9 8.45 4.9 4.9 0 0 0 7.5 18.25Z"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="m9.2 14.2 2.15 2.15 3.7-4.45"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case 'shield':
      return (
        <svg {...common}>
          <path
            d="M12 3.1 19 6v5.1c0 4.55-2.94 8.04-7 9.8-4.06-1.76-7-5.25-7-9.8V6l7-2.9Z"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinejoin="round"
          />
          <path
            d="m8.8 12.1 2.1 2.1 4.4-4.65"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case 'sparkle':
      return (
        <svg {...common}>
          <path
            d="M12 2.8c.45 3.45 2.15 5.15 5.6 5.6-3.45.45-5.15 2.15-5.6 5.6-.45-3.45-2.15-5.15-5.6-5.6 3.45-.45 5.15-2.15 5.6-5.6Z"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <path
            d="M18.3 14.2c.25 1.95 1.25 2.95 3.2 3.2-1.95.25-2.95 1.25-3.2 3.2-.25-1.95-1.25-2.95-3.2-3.2 1.95-.25 2.95-1.25 3.2-3.2ZM5.3 13.3c.18 1.35.87 2.04 2.2 2.2-1.33.18-2.02.87-2.2 2.2-.17-1.33-.86-2.02-2.2-2.2 1.34-.16 2.03-.85 2.2-2.2Z"
            fill="currentColor"
          />
        </svg>
      );
    case 'github':
      return (
        <svg {...common} fill="currentColor">
          <path d="M12 2.4a9.8 9.8 0 0 0-3.1 19.1c.5.1.67-.22.67-.48v-1.9c-2.76.6-3.34-1.17-3.34-1.17-.45-1.15-1.1-1.45-1.1-1.45-.9-.62.07-.6.07-.6 1 .07 1.52 1.02 1.52 1.02.88 1.52 2.32 1.08 2.89.83.09-.64.34-1.08.63-1.33-2.2-.25-4.52-1.1-4.52-4.84 0-1.07.38-1.94 1.02-2.63-.1-.25-.44-1.25.1-2.6 0 0 .83-.27 2.7 1a9.4 9.4 0 0 1 4.92 0c1.87-1.27 2.7-1 2.7-1 .54 1.35.2 2.35.1 2.6.64.69 1.02 1.56 1.02 2.63 0 3.75-2.33 4.59-4.54 4.83.36.31.67.92.67 1.86v2.74c0 .27.18.59.68.49A9.8 9.8 0 0 0 12 2.4Z" />
        </svg>
      );
    case 'external':
      return (
        <svg {...common}>
          <path
            d="M13.5 5H19v5.5M18.5 5.5l-7.25 7.25"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M11 6H6.7A1.7 1.7 0 0 0 5 7.7v9.6A1.7 1.7 0 0 0 6.7 19h9.6a1.7 1.7 0 0 0 1.7-1.7V13"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
          />
        </svg>
      );
    case 'search':
      return (
        <svg {...common}>
          <circle
            cx="10.8"
            cy="10.8"
            r="6.3"
            stroke="currentColor"
            strokeWidth="1.7"
          />
          <path
            d="m15.5 15.5 4 4"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
          />
        </svg>
      );
    case 'frontier':
      return (
        <svg {...common}>
          <path
            d="m12 2.9 2.15 5.05L19.2 10.1l-5.05 2.15L12 17.3l-2.15-5.05L4.8 10.1l5.05-2.15L12 2.9Z"
            fill="currentColor"
          />
          <path
            d="m18.3 15.1.8 1.8 1.8.8-1.8.78-.8 1.82-.78-1.82-1.82-.78 1.82-.8.78-1.8Z"
            fill="currentColor"
            opacity=".7"
          />
        </svg>
      );
    case 'sun':
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="3.7" fill="currentColor" />
          <path
            d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M18.7 5.3l-1.4 1.4M6.7 17.3l-1.4 1.4"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
          />
        </svg>
      );
    case 'moon':
      return (
        <svg {...common}>
          <path
            d="M20 14.15A8.2 8.2 0 1 1 9.85 4a6.7 6.7 0 0 0 10.15 10.15Z"
            fill="currentColor"
          />
        </svg>
      );
    case 'arrow':
      return (
        <svg {...common}>
          <path
            d="M5 12h13M13.5 7.5 18 12l-4.5 4.5"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
  }
}
