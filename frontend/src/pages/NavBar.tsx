import { useState, useEffect, useRef } from "react";
import { AuthStatus, useAuth } from "../useHook/useAuth";
import { ProfileArrowSvg } from "../components/ProfileArrowSvg";
import "./../styles/navbar.css"
import { useRouting } from "../useHook/useRouting";

export default function NavBar() {

    const {logout, status} = useAuth();
    const {toGame, toParameter, toMainMenu, toLoginMenu, toScore} = useRouting();

    const handleLogout = () => {
        if (showProfileMenu) {
            logout()
            toMainMenu()
        }
    };

    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const showProfileMenuRef = useRef(showProfileMenu);

    /**
     *
     * Utilise la fonction donnée si l'utilisateur est connecté
     * sinon l'utilisateur est redirigé vers la page de login
     * @param func la fonction à utiliser si le compte est authentifié
     */
    const useFuncOrLogin = (func: () => void) => {
        if (status === AuthStatus.Authenticated) {
            func();
        }
        else {
            toLoginMenu()
        }

    }

    const handleScore = () => {
        useFuncOrLogin(toScore)
    }

    const handlePlayGame = () => {
        useFuncOrLogin(toGame)
    }

    const handleParameter = () => {
        if (showProfileMenu) {
            useFuncOrLogin(toParameter)
        }
    }

    const handleLogoClick = () => {
        toMainMenu();
    }
    
    const handleAccountButton = () => {
        setShowProfileMenu(!showProfileMenu)
    }

    const handleLogin = () => {
        toLoginMenu()
    }
    

    useEffect(() => {
        showProfileMenuRef.current = showProfileMenu;
    }, [showProfileMenu]);

    useEffect(() => {
        const handleDocumentClick = (event: MouseEvent) => {
        const optionsDiv = document.getElementById("options");
        const clickedElement = event.target as HTMLElement;

        if (
            !(optionsDiv && optionsDiv.contains(clickedElement)) &&
            showProfileMenuRef.current === true
        ) {
            setShowProfileMenu(false);
        }
        };

        document.addEventListener("click", handleDocumentClick);

        return () => {
        document.removeEventListener("click", handleDocumentClick);
        };
    }, []);

    return (
        <>
            <header className="p-1 justify-center flex items-center bg-neutral-50">
                <div className="container justify-between flex px-2 md:py-2 py-1">
                    <div className="flex gap-2 items-center relative cursor-pointer"
                    onClick={handleLogoClick}>
                        <img src="/creacosm_logo.png" className="md:h-12 h-10 aspect-square"/>
                        <p className="capitalize md:text-3xl text-2xl sm:inline hidden creacosm font-light">
                            Créa
                            <span className="text-[#0065ae]">cosm</span>
                        </p>
                    </div>

                    <div className="flex justify-center">
                        <div className="cursor-pointer md:py-2 md:px-6 px-4 rounded-full justify-self-center flex items-center
                        bg-neutral-100 hover:bg-blue-600 border-2 border-blue-600 hover:border-neutral-50 text-blue-600 hover:text-neutral-50 duration-300"
                        onClick={handlePlayGame}>
                            <div className="flex md:gap-2 gap-1 items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="md:h-8 h-6 aspect-square">
                                    <path fill="currentColor" d="M19.266 13.516a1.917 1.917 0 0 0 0-3.032A35.8 35.8 0 0 0 9.35 5.068l-.653-.232c-1.248-.443-2.567.401-2.736 1.69a42.5 42.5 0 0 0 0 10.948c.17 1.289 1.488 2.133 2.736 1.69l.653-.232a35.8 35.8 0 0 0 9.916-5.416"/>
                                </svg>
                                <p className="font-semibold md:text-2xl text-xl">
                                    JOUER
                                </p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex">
                        <div id="options">
                            {
                                status === AuthStatus.Authenticated?
                                    <>
                                        <div onClick={handleAccountButton} className="bg-neutral-50 p-2 rounded-full text-blue-600 border-2 border-blue-600 cursor-pointer">
                                            <ProfileArrowSvg extendMenu={!showProfileMenu} />
                                        </div>
                                        
                                        <div className={(showProfileMenu? "profile-open":"profile-close") + " profile-bar z-20 cursor-default"}>
                                            
                                            <div onClick={handleScore}>
                                                <div>
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-6 aspect-square">
                                                        <path fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="M9 6h12M9 12h12M9 18h8M4 7a1 1 0 1 0 0-2a1 1 0 0 0 0 2Zm0 6a1 1 0 1 0 0-2a1 1 0 0 0 0 2Zm0 6a1 1 0 1 0 0-2a1 1 0 0 0 0 2Z"/>
                                                    </svg>
                                                </div>
                                                <p>Scores</p>
                                            </div>
                                            <div onClick={handleParameter}>
                                                <div>
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-6 aspect-square">
                                                        <path fill="currentColor" d="M19.9 12.66a1 1 0 0 1 0-1.32l1.28-1.44a1 1 0 0 0 .12-1.17l-2-3.46a1 1 0 0 0-1.07-.48l-1.88.38a1 1 0 0 1-1.15-.66l-.61-1.83a1 1 0 0 0-.95-.68h-4a1 1 0 0 0-1 .68l-.56 1.83a1 1 0 0 1-1.15.66L5 4.79a1 1 0 0 0-1 .48L2 8.73a1 1 0 0 0 .1 1.17l1.27 1.44a1 1 0 0 1 0 1.32L2.1 14.1a1 1 0 0 0-.1 1.17l2 3.46a1 1 0 0 0 1.07.48l1.88-.38a1 1 0 0 1 1.15.66l.61 1.83a1 1 0 0 0 1 .68h4a1 1 0 0 0 .95-.68l.61-1.83a1 1 0 0 1 1.15-.66l1.88.38a1 1 0 0 0 1.07-.48l2-3.46a1 1 0 0 0-.12-1.17ZM18.41 14l.8.9l-1.28 2.22l-1.18-.24a3 3 0 0 0-3.45 2L12.92 20h-2.56L10 18.86a3 3 0 0 0-3.45-2l-1.18.24l-1.3-2.21l.8-.9a3 3 0 0 0 0-4l-.8-.9l1.28-2.2l1.18.24a3 3 0 0 0 3.45-2L10.36 4h2.56l.38 1.14a3 3 0 0 0 3.45 2l1.18-.24l1.28 2.22l-.8.9a3 3 0 0 0 0 3.98m-6.77-6a4 4 0 1 0 4 4a4 4 0 0 0-4-4m0 6a2 2 0 1 1 2-2a2 2 0 0 1-2 2"/>
                                                    </svg>
                                                </div>
                                                <p>Paramètres</p>
                                            </div>
                                            <div onClick={handleLogout}>
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-6 aspect-square">
                                                    <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12h-9.5m7.5 3l3-3l-3-3m-5-2V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h5a2 2 0 0 0 2-2v-1"/>
                                                </svg>
                                                <p>Se déconnecter</p>
                                            </div>
                                            
                                        </div>
                                    </>
                                :
                                <div className="bg-neutral-50 p-2 rounded-full text-blue-600 border-2 border-blue-600 cursor-pointer" onClick={handleLogin}>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-8 aspect-square">
                                        <path fill="currentColor" d="M17.5 12a5.5 5.5 0 1 1 0 11a5.5 5.5 0 0 1 0-11m0 7.751a.625.625 0 1 0 0 1.25a.625.625 0 0 0 0-1.25m0-5.877c-1.047 0-1.864.818-1.853 1.955a.5.5 0 0 0 1-.01c-.006-.579.36-.945.853-.945c.473 0 .854.392.854.95c0 .192-.055.342-.224.561l-.094.116l-.1.113l-.264.29l-.137.158c-.383.456-.535.792-.535 1.31a.5.5 0 1 0 1 0c0-.203.059-.36.24-.59l.084-.105l.101-.115l.266-.29l.135-.156c.378-.45.528-.783.528-1.292c0-1.104-.822-1.95-1.854-1.95M12.023 14a6.5 6.5 0 0 0-.709 1.5H4.253a.75.75 0 0 0-.75.75v.577c0 .535.192 1.053.54 1.46c1.253 1.469 3.22 2.214 5.957 2.214q.896 0 1.68-.106c.246.495.553.954.912 1.367q-1.193.24-2.592.24c-3.145 0-5.532-.906-7.098-2.74a3.75 3.75 0 0 1-.898-2.435v-.578A2.25 2.25 0 0 1 4.253 14zM10 2.005a5 5 0 1 1 0 10a5 5 0 0 1 0-10m0 1.5a3.5 3.5 0 1 0 0 7a3.5 3.5 0 0 0 0-7"/>
                                    </svg>
                                </div>
                            }
                            
                        </div>
                    </div>
                </div>
            </header>
        </>
    )
}
