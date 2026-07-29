"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

/**
 * Sincroniza a saída do preloader com a entrada da hero.
 * Antes cada um usava um delay fixo em segundos — em aparelho lento os dois
 * dessincronizavam e o título entrava antes da cortina subir.
 */
type IntroValue = {
  introDone: boolean;
  finishIntro: () => void;
};

const IntroContext = createContext<IntroValue>({
  introDone: true,
  finishIntro: () => {},
});

export function IntroProvider({ children }: { children: ReactNode }) {
  const [introDone, setIntroDone] = useState(false);
  const finishIntro = useCallback(() => setIntroDone(true), []);

  const value = useMemo(
    () => ({ introDone, finishIntro }),
    [introDone, finishIntro]
  );

  return <IntroContext.Provider value={value}>{children}</IntroContext.Provider>;
}

export function useIntro() {
  return useContext(IntroContext);
}
