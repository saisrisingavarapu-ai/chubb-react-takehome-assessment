import { describe, it, expect, beforeEach, vi } from 'vitest';
import { applyTheme, getPreferredTheme, ThemeMode } from './theme.js';

describe('theme utilities', () => {
  beforeEach(() => {
    window.localStorage.clear();
    document.documentElement.classList.remove('theme-dark');
    document.documentElement.removeAttribute('data-theme');
    window.matchMedia = vi.fn().mockReturnValue({ matches: false, addEventListener: vi.fn(), removeEventListener: vi.fn() });
  });

  it('applies the correct dark theme classes and attribute', () => {
    applyTheme(ThemeMode.dark);

    expect(document.documentElement).toHaveClass('theme-dark');
    expect(document.documentElement).toHaveAttribute('data-theme', 'dark');
  });

  it('reads theme from persisted localStorage state', () => {
    window.localStorage.setItem('chubb-preferences', JSON.stringify({ state: { theme: ThemeMode.dark } }));

    expect(getPreferredTheme()).toBe(ThemeMode.dark);
  });

  it('falls back to system preference when storage is missing', () => {
    expect(getPreferredTheme()).toBe(ThemeMode.light);
  });
});
