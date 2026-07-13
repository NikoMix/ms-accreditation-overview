import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Microsoft Specialization Readiness',
  description:
    'A partner-ready view of Microsoft specialization accelerators and Microhacks, maintained from YAML.',
};

const themeInitScript = `(function(){var key='specialization-readiness-theme';var theme;try{theme=localStorage.getItem(key);}catch(error){console.warn('Theme preference could not be read.',error);}if(theme!=='light'&&theme!=='dark'){theme=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}document.documentElement.dataset.theme=theme;})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
