import { useEffect, useState } from "react";

import { INITIAL_SYNC_STEPS } from "@/shared/constants/syncing";
import type { SyncStep } from "@/features/onboarding/types/syncing";

export interface SyncingProgressState {
  steps: SyncStep[];
  messageIndex: number;
  allDone: boolean;
}

export function useSyncingProgress(): SyncingProgressState {
  const [steps, setSteps] = useState<SyncStep[]>(INITIAL_SYNC_STEPS);
  const [messageIndex, setMessageIndex] = useState(0);
  const [allDone, setAllDone] = useState(false);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];

    timers.push(setTimeout(() => {
      setSteps((prev) => prev.map((s, i) => i === 0 ? { ...s, status: "active" } : s));
    }, 300));

    timers.push(setTimeout(() => {
      setSteps((prev) => prev.map((s, i) => {
        if (i === 0) return { ...s, status: "done" };
        if (i === 1) return { ...s, status: "active" };
        return s;
      }));
      setMessageIndex(1);
    }, 1500));

    timers.push(setTimeout(() => {
      setSteps((prev) => prev.map((s, i) => {
        if (i <= 1) return { ...s, status: "done" };
        if (i === 2) return { ...s, status: "active" };
        return s;
      }));
      setMessageIndex(2);
    }, 3000));

    timers.push(setTimeout(() => {
      setSteps((prev) => prev.map((s, i) => {
        if (i <= 2) return { ...s, status: "done" };
        if (i === 3) return { ...s, status: "active" };
        return s;
      }));
      setMessageIndex(3);
    }, 4500));

    timers.push(setTimeout(() => {
      setSteps((prev) => prev.map((s) => ({ ...s, status: "done" })));
      setMessageIndex(4);
      setAllDone(true);
    }, 6000));

    return () => timers.forEach(clearTimeout);
  }, []);

  return { steps, messageIndex, allDone };
}
