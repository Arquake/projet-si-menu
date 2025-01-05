import './App.css'
import {useAuth} from "./useHook/useAuth.ts";
import {useEffect} from "react";
import Home from './pages/Home.tsx';

function App() {
    const {tokenAuthenticate} = useAuth()

    useEffect(() => {
        tokenAuthenticate()
    }, [tokenAuthenticate]);

    return (
        <>
            <Home />
        </>
    )
}

export default App
