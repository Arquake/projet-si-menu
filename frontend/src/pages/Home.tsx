import { useEffect } from "react";
import NotFound from "./404";
import Game from "./Game";
import MainMenu from "./MainMenu";
import NavBar from "./NavBar"
import Parameter from "./Parameter";
import "/app/src/styles/home.css"
import { useAuth } from "../useHook/useAuth";
import { Login } from "./Login";
import { RouteStatus, useRouting } from "../useHook/useRouting";
import Score from "./Score";


export default function Home() {
  const { status } = useAuth();
  const { currentRoute, updateRouteStatus } = useRouting();

  useEffect(() => {
    updateRouteStatus();
  }, [status, updateRouteStatus]);

  return (
    <>
      {currentRoute === RouteStatus.Login ? (
        <Login />
      ) : (
        <div className="w-screen min-h-screen flex flex-col">
          <div className="flex-initial sticky top-0 z-50">
            <NavBar />
          </div>

          <div className="flex-1 cursor-default">
            {currentRoute === RouteStatus.MainMenu ? (
              <MainMenu />
            ) : currentRoute === RouteStatus.Parameter ? (
              <Parameter />
            ) : currentRoute === RouteStatus.Game ? (
              <Game />
            ) : currentRoute === RouteStatus.Score ? (
              <Score />
            ) : (
              <NotFound />
            )}
          </div>

          <footer className="w-full bg-neutral-50 flex-initial px-4 py-6">
            <p>Contactez-nous</p>
          </footer>
        </div>
      )}
    </>
  );
}
