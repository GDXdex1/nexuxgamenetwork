import { useEffect } from "react";

export function useQuickAuth(isInFarcaster: boolean) {
    useEffect(() => {
        if (isInFarcaster) {
            // Logic for quick auth if needed
            console.log("Quick auth hook initialized");
        }
    }, [isInFarcaster]);
}
