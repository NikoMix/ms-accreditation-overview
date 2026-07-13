'use client';

import { useSyncExternalStore } from 'react';
import { Icon } from './Icon';

type Theme = 'light' | 'dark';

const STORAGE_KEY = 'specialization-readiness-theme';
const COLOR_SCHEME_QUERY = '(prefers-color-scheme: dark)';

function readStoredTheme(): Theme | null {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    return value === 'light' || value === 'dark' ? value : null;
  } catch (error) {
    console.warn('Theme preference could not be read.', error);
    return null;
  }
}
function readTheme(): Theme {
  const value = document.documentElement.dataset.theme;
  return value === 'dark' ? 'dark' : 'light';
}

function applyTheme(theme: Theme, persist: boolean) {
  document.documentElement.dataset.theme = theme;

  if (!persist) {
    return;
  }

  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch (error) {
    console.warn('Theme preference could not be saved.', error);
  }
}

function subscribe(onStoreChange: () => void) {
  const media = window.matchMedia(COLOR_SCHEME_QUERY);
  const observer = new MutationObserver(onStoreChange);

  const handleSystemTheme = () => {
    if (readStoredTheme() === null) {
      applyTheme(media.matches ? 'dark' : 'light', false);
    }
  };

  const handleStorage = (event: StorageEvent) => {
    if (event.key !== null && event.key !== STORAGE_KEY) {
      return;
    }

    applyTheme(
      readStoredTheme() ?? (media.matches ? 'dark' : 'light'),
      false,
    );
  };

  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme'],
  });
  media.addEventListener('change', handleSystemTheme);
  window.addEventListener('storage', handleStorage);

  return () => {
    observer.disconnect();
    media.removeEventListener('change', handleSystemTheme);
    window.removeEventListener('storage', handleStorage);
  };
}

export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, readTheme, () => 'light');
  const isDark = theme === 'dark';
  const label = isDark ? 'Switch to light theme' : 'Switch to dark theme';

  return (
    <button
      type="button"
      className="icon-button"
      aria-label={label}
      title={label}
      onClick={() => applyTheme(isDark ? 'light' : 'dark', true)}
    >
      <Icon name={isDark ? 'sun' : 'moon'} />
    </button>
  );
}
