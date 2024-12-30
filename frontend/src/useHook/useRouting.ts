import { useCallback } from "react";

export function useRouting() {

    const toGame = useCallback(() => {
        window.history.pushState({}, "", "/game")
    }, [])

    const toParameter = useCallback(()=> {
        window.history.pushState({}, "", "/parameter")
    }, [])

    return {
        toGame,
        toParameter
    }
}