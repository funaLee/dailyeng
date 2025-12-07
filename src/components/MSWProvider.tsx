"use client";

import { useEffect, useState } from "react";

export function MSWProvider({ children }: { children: React.ReactNode }) {
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        if (process.env.NODE_ENV === "development") {
            import("@/mocks/browser").then(({ worker }) => {
                worker.start({ onUnhandledRequest: "bypass" }).then(() => {
                    setIsReady(true);
                });
            });
        } else {
            setIsReady(true);
        }
    }, []);

    if (!isReady) {
        return null;
    }

    return <>{children}</>;
}
