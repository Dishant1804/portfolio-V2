"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/router";

export function PopoverProvider({ children }: { children: ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    let cleanup: () => void = () => {};

    const setup = async () => {
      const { initWritingPopovers } = await import("@/lib/writing-popover");
      cleanup();
      cleanup = initWritingPopovers();
    };

    setup();

    const handleRouteChange = () => {
      setup();
    };

    router.events.on("routeChangeComplete", handleRouteChange);

    return () => {
      cleanup();
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);

  return children;
}
