"use client";

import { startTransition, useEffect, useState } from "react";
import { useSpendableStore } from "./store";

/**
 * Returns true once the Zustand persist store has finished rehydrating from
 * localStorage. Always returns false on the server so Next.js prerendering is
 * consistent, then flips to true on the client after hydration completes.
 */
export function useHydrated(): boolean {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // useEffect only runs on the client, where persist is available
    if (useSpendableStore.persist.hasHydrated()) {
      startTransition(() => setHydrated(true));
      return;
    }
    const unsub = useSpendableStore.persist.onFinishHydration(() => {
      setHydrated(true);
    });
    return unsub;
  }, []);

  return hydrated;
}
