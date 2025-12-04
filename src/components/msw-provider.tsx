"use client";

import { useEffect } from "react";

export function MSWProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
      // We only want to run this in the browser and in development
      import("@/mocks/browser")
        .then(({ worker }) => {
          worker.start({
            onUnhandledRequest: "bypass",
          });
        })
        .catch((err) => {
          console.error("Failed to start MSW worker:", err);
        });
    }
  }, []);

  return <>{children}</>;
}
