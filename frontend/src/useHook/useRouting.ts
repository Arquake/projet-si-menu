import { useCallback } from "react";

export function useRouting() {

    const toGame = useCallback(() => {
        window.history.pushState({}, "", "/game")
    }, [])

    const toParameter = useCallback(()=> {
        window.history.pushState({}, "", "/parameter")
    }, [])

    const toMainMenu = useCallback(()=> {
        window.history.pushState({}, "", "/")
    }, [])

    return {
        toGame,
        toParameter,
        toMainMenu
    }
}