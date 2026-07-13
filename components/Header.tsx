'use client';

import { useRef, useState } from 'react';
import type { SolutionArea } from '@/lib/catalog';
import { Icon } from './Icon';
import { ThemeToggle } from './ThemeToggle';

interface HeaderProps {
  brand: string;
  repositoryUrl: string;
  solutionAreas: Pick<SolutionArea, 'id' | 'name'>[];
}

export function Header({
  brand,
  repositoryUrl,
  solutionAreas,
}: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const firstNavigationLink = useRef<HTMLAnchorElement>(null);
  const menuButton = useRef<HTMLButtonElement>(null);

  function toggleMenu() {
    const nextOpen = !menuOpen;
    setMenuOpen(nextOpen);
    if (nextOpen) {
      requestAnimationFrame(() => firstNavigationLink.current?.focus());
    }
  }

  return (
    <header className="topbar">
      <div className="shell topbar-inner">
        <a className="brand" href="#top" aria-label={`${brand}, back to top`}>
          <span className="ms-logo" aria-hidden="true">
            <span />
            <span />
            <span />
            <span />
          </span>
          <span className="brand-copy">
            <strong>{brand}</strong>
            <small>Readiness dashboard</small>
          </span>
        </a>

        <div className="topbar-actions">
          <nav
            id="primary-navigation"
            className={`topbar-nav${menuOpen ? ' is-open' : ''}`}
            aria-label="Solution areas"
            onKeyDown={(event) => {
              if (event.key === 'Escape') {
                setMenuOpen(false);
                menuButton.current?.focus();
              }
            }}
          >
            {solutionAreas.map((area, index) => (
              <a
                key={area.id}
                ref={index === 0 ? firstNavigationLink : undefined}
                href={`#${area.id}`}
                onClick={() => setMenuOpen(false)}
              >
                {area.name}
              </a>
            ))}
          </nav>

          <a
            className="source-button"
            href={repositoryUrl}
            target="_blank"
            rel="noreferrer"
            aria-label="Open source repository on GitHub"
          >
            <Icon name="github" />
            <span>GitHub</span>
          </a>
          <ThemeToggle />
          <button
            ref={menuButton}
            type="button"
            className="menu-button"
            aria-expanded={menuOpen}
            aria-controls="primary-navigation"
            aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}
            onClick={toggleMenu}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>
    </header>
  );
}
