import { useState } from "react";
import { useAuth } from "../useHook/useAuth";
import { ProfileArrowSvg } from "../components/ProfileArrowSvg";

export default function NavBar() {
    const {logout} = useAuth();
    const handleLogout = () => {
        logout()
    };

    const [showProfileMenu, setShowProfileMenu] = useState(false);

    const handleOpenProfileMenu = () => {
        setShowProfileMenu(!showProfileMenu);
    }

    const handleMainPageLink = () => {
        if (window.location.pathname !== "/") {
            window.location.pathname = "/";
        }
    }
    
    return (
        <>
            <header className="p-2 grid grid-cols-3 gap-12 items-center bg-yellow-100">
                <div className="flex col-span-1 col-start-2 justify-center">
                    <div className="cursor-pointer bg-yellow-300 p-2 rounded-full justify-self-center">
                        <div className="h-8 aspect-square" onClick={handleMainPageLink}>
                            <img src="/src/assets/parrot.svg" />
                        </div>
                    </div>
                </div>
                
                <div className="flex justify-end">
                    <div className="bg-yellow-300 p-2 rounded-full text-gray-700">
                        <div onClick={handleOpenProfileMenu}>
                            <ProfileArrowSvg extendMenu={!showProfileMenu} />
                        </div>
                        
                        <div className={(showProfileMenu? "profile-open":"profile-close") + " profile-bar"}>
                            <div>
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
                    </div>
                </div>
                
            </header>
        </>
    )
}