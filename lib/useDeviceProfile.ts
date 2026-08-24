"use client";

import { useEffect, useState } from "react";

export type DeviceProfile = {
  /** Falso no servidor e no primeiro render do cliente. */
  resolved: boolean;
  /** Tela estreita ou toque: recebe as variantes 720p. */
  compact: boolean;
  /** Ponteiro preciso + tela larga — único contexto onde o scrub compensa. */
  canScrub: boolean;
  /** Economia de dados ou rede lenta: não baixa vídeo nenhum. */
  frugal: boolean;
};

const UNRESOLVED: DeviceProfile = {
  resolved: false,
  compact: true,
  canScrub: false,
  frugal: false,
};

type NetworkInformation = {
  saveData?: boolean;
  effectiveType?: string;
};

const SLOW_NETWORK = /^(slow-2g|2g|3g)$/;

/**
 * Decide o que cada aparelho recebe.
 *
 * Só resolve depois da montagem, de propósito: o servidor não sabe o tamanho
 * da tela nem a rede, então qualquer palpite no HTML inicial viraria divergência
 * de hidratação. Quem consome espera `resolved` antes de pedir vídeo — assim as
 * `<source>` nunca mudam depois que o elemento existe e não é preciso chamar
 * `video.load()` na mão.
 */
export function useDeviceProfile(): DeviceProfile {
  const [profile, setProfile] = useState<DeviceProfile>(UNRESOLVED);

  useEffect(() => {
    const wide = window.matchMedia("(min-width: 1024px)");
    const fine = window.matchMedia("(pointer: fine)");

    const read = () => {
      const connection = (
        navigator as Navigator & { connection?: NetworkInformation }
      ).connection;

      setProfile({
        resolved: true,
        compact: !wide.matches,
        canScrub: wide.matches && fine.matches,
        frugal:
          connection?.saveData === true ||
          SLOW_NETWORK.test(connection?.effectiveType ?? ""),
      });
    };

    read();
    wide.addEventListener("change", read);
    fine.addEventListener("change", read);

    return () => {
      wide.removeEventListener("change", read);
      fine.removeEventListener("change", read);
    };
  }, []);

  return profile;
}
