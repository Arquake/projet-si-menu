import { useCallback, useState, useEffect } from "react";
import { AuthStatus, useAuth } from "./useAuth";

export enum RouteStatus {
  Error,
  MainMenu,
  Parameter,
  Game,
  Login,
  Score,
}

export function useRouting() {
  const { status } = useAuth();
  const [currentRoute, setCurrentRoute] = useState<RouteStatus>(RouteStatus.MainMenu);

  const updateRouteStatus = useCallback(() => {
    let newRoute: RouteStatus;
    if (status === AuthStatus.Authenticated) {
      switch (window.location.pathname) {
        case "/login":
        case "/":
          newRoute = RouteStatus.MainMenu;
          break;
        case "/parameter":
          newRoute = RouteStatus.Parameter;
          break;
        case "/game":
          newRoute = RouteStatus.Game;
          break;
        case "/score":
          newRoute = RouteStatus.Score;
          break;
        default:
          newRoute = RouteStatus.Error;
          break;
      }
    } else {
      switch (window.location.pathname) {
        case "/":
        case "/parameter":
        case "/game":
        case "/score":
          newRoute = RouteStatus.MainMenu;
          break;
        case "/login":
          newRoute = RouteStatus.Login;
          break;
        default:
          newRoute = RouteStatus.Error;
          break;
      }
    }
  
    setCurrentRoute(newRoute);
  }, [status]);

  const navigateTo = useCallback(
    (path: string) => {
      if (window.location.pathname !== path) {
        window.history.pushState({}, "", path);
        updateRouteStatus();
      }
    },
    [updateRouteStatus]
  );
  
  const toGame = () => navigateTo("/game");
  const toParameter = () => navigateTo("/parameter");
  const toMainMenu = () => navigateTo("/");
  const toLoginMenu = () => navigateTo("/login");
  const toScore = () => navigateTo("/score");


  useEffect(() => {
    updateRouteStatus();

    window.addEventListener("popstate", updateRouteStatus);

    const originalPushState = window.history.pushState;
    const originalReplaceState = window.history.replaceState;

    window.history.pushState = function (...args) {
      originalPushState.apply(window.history, args);
      updateRouteStatus();
    };


    return () => {
      window.removeEventListener("popstate", updateRouteStatus);
      window.history.pushState = originalPushState;
      window.history.replaceState = originalReplaceState;
    };
  }, [updateRouteStatus]);

  
  return {
    toGame,
    toParameter,
    toMainMenu,
    toLoginMenu,
    currentRoute,
    updateRouteStatus,
    toScore,
  };
}
