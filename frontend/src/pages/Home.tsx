import { useEffect, useState } from "react";
import NotFound from "./404";
import Game from "./Game";
import MainMenu from "./MainMenu";
import NavBar from "./NavBar"
import Parameter from "./Parameter";
import "/app/src/styles/home.css"



export default function Home () {

    const [currentPath, setCurrentPath] = useState(0)

    useEffect(() => {
        const updatePath = () => {
          switch (window.location.pathname) {
            case "/":
              setCurrentPath(0);
              break;
            case "/parameter":
              setCurrentPath(1);
              break;
            case "/game":
              setCurrentPath(2);
              break;
            default:
              setCurrentPath(-1);
              break;
          }
        };
    
        // Run on initial render
        updatePath();
    
        // Listen for popstate events
        window.addEventListener("popstate", updatePath);
    
        // Monkey-patch pushState and replaceState to detect manual updates
        const originalPushState = window.history.pushState;
        const originalReplaceState = window.history.replaceState;
    
        window.history.pushState = function (...args) {
          originalPushState.apply(window.history, args);
          updatePath();
        };
    
        window.history.replaceState = function (...args) {
          originalReplaceState.apply(window.history, args);
          updatePath();
        };
    
        // Cleanup
        return () => {
          window.removeEventListener("popstate", updatePath);
          window.history.pushState = originalPushState;
          window.history.replaceState = originalReplaceState;
        };
      }, []);

    return (
        <>
            <div className="w-screen h-screen flex flex-col">
                <NavBar/>

                {
                    currentPath == 0? <MainMenu />
                    : currentPath == 1? <Parameter />
                    : currentPath == 2? <Game />
                    : <NotFound />
                }
            </div>
        </>
    )
}
