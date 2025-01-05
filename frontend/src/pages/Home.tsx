import NotFound from "./404";
import Game from "./Game";
import MainMenu from "./MainMenu";
import Parameter from "./Parameter";
import "/app/src/styles/home.css"
import { Login } from "./Login";
import Score from "./Score";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ContainerDiv from "../components/ContainerDiv";
import ProtectedRoute from "../components/ProtectedRoute";
import DisconnectedRoute from "../components/DisconnectedRoute";


const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <ContainerDiv>
        <MainMenu />
      </ContainerDiv>
    ),
  },
  {
    path: '/login',
    element: (
      <DisconnectedRoute>
        <Login />
      </DisconnectedRoute>
    ),
  },
  {
    path: '/parameter',
    element: (
      <ProtectedRoute>
        <ContainerDiv>
          <Parameter />
        </ContainerDiv>
      </ProtectedRoute>
    ),
  },
  {
    path: '/game',
    element: (
      <ProtectedRoute>
        <ContainerDiv>
          <Game />
        </ContainerDiv>
      </ProtectedRoute>
    ),
  },
  {
    path: '/score',
    element: (
      <ProtectedRoute>
        <ContainerDiv>
          <Score />
        </ContainerDiv>
      </ProtectedRoute>
    ),
  },
  {
    path: '*',
    element: (
      <ContainerDiv>
        <NotFound />
      </ContainerDiv>
    )
  }
])

export default function Home() {
  return (
    <>
      <RouterProvider router={router}/>
    </>
  );
}
