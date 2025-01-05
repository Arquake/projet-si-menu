import { PropsWithChildren, useEffect } from "react";
import { AuthStatus, useAuth } from "../useHook/useAuth";
import { useNavigate } from "react-router-dom";

type DisconnectedRouteProps = PropsWithChildren;

export default function DisconnectedRoute ({children}: DisconnectedRouteProps) {

    const {status} = useAuth();
    const navigate = useNavigate();

    useEffect(()=>{
        if (status === AuthStatus.Authenticated) {
            navigate('/')
        }
    },[navigate, status])

    return children;
}