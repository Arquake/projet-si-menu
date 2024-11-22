

import { useEffect, useState } from "react"
import MainMenu from "./MainMenu"
import NavBar from "./NavBar"
import "/app/src/styles/home.css"
import Parameter from "./Parameter";
import NotFound from "./404";



export default function Home () {

    const [currentPage, setCurrentPage] = useState(0);
    
    useEffect(() => {
        switch (window.location.pathname) {
            case "/":
                setCurrentPage(0);
                break;
            case "/parameter":
                setCurrentPage(1);
                break;
            default:
                setCurrentPage(-1);
                break;
        }
    }, [window.location.pathname])


    return (
        <>
            <div className="w-screen h-screen flex flex-col">
                
                <NavBar/>

                {
                    currentPage === 0? <MainMenu />
                    : currentPage === 1? <Parameter />
                    : <NotFound />
                }
            </div>
        </>
    )
}
