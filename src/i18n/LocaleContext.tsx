/**
 * LocaleContext.tsx — Global locale state shared across all pages.
 *
 * Wrap the app root with <LocaleProvider> and consume with useLocale().
 */
import { createContext, useContext, useState, type ReactNode } from 'react';
import type { Locale } from './translations';

interface LocaleContextValue {
  locale: Locale;
  setLocale: (l: Locale) => void;
}

const LocaleContext = createContext<LocaleContextValue>({
  locale: 'en',
  setLocale: () => {},
});

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>('en');
  return (
    <LocaleContext.Provider value={{ locale, setLocale }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  return useContext(LocaleContext);
}
