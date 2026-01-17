import { sdk } from "@farcaster/miniapp-sdk";
import { useEffect, useState } from "react";

export function useIsInFarcaster() {
    const [isInFarcaster, setIsInFarcaster] = useState(false);

    useEffect(() => {
        // Check if running in a frame context
        // This is a simplified check - in reality we might want to check sdk.context
        // safely without blocking
        setIsInFarcaster(true); // Default to true for miniapp for now or add actual logic
    }, []);

    return isInFarcaster;
}
