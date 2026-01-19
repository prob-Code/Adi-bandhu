import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

const UiContext = createContext(null);

export function UiProvider({ children }) {
  const [language, setLanguage] = useState(localStorage.getItem('ui.lang') || 'en');
  const [fontScale, setFontScale] = useState(parseInt(localStorage.getItem('ui.fontScale') || '100', 10));
  const [highContrast, setHighContrast] = useState(localStorage.getItem('ui.highContrast') === 'true');

  useEffect(() => {
    localStorage.setItem('ui.lang', language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem('ui.fontScale', String(fontScale));
    document.documentElement.style.fontSize = `${fontScale}%`;
  }, [fontScale]);

  useEffect(() => {
    localStorage.setItem('ui.highContrast', String(highContrast));
    document.body.classList.toggle('high-contrast', highContrast);
  }, [highContrast]);

  const value = useMemo(() => ({ language, setLanguage, fontScale, setFontScale, highContrast, setHighContrast }), [language, fontScale, highContrast]);

  return <UiContext.Provider value={value}>{children}</UiContext.Provider>;
}

export function useUi() {
  const ctx = useContext(UiContext);
  if (!ctx) throw new Error('useUi must be used within UiProvider');
  return ctx;
}
