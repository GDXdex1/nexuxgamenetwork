import { sdk } from "@farcaster/miniapp-sdk";
import { useCallback } from "react";

export function useAddMiniApp() {
    const addMiniApp = useCallback(async () => {
        try {
            await sdk.actions.addFrame();
            console.log("Mini app added");
        } catch (e) {
            console.error("Error adding mini app", e);
        }
    }, []);

    return { addMiniApp };
}
