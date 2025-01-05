import { PropsWithChildren, useEffect } from "react";
import { AuthStatus, useAuth } from "../useHook/useAuth";
import { useNavigate } from "react-router-dom";

type ProtectedRouteProps = PropsWithChildren;

export default function ProtectedRoute ({children}: ProtectedRouteProps) {

    const {status} = useAuth();
    const navigate = useNavigate();

    useEffect(()=>{
        if (status !== AuthStatus.Authenticated) {
            navigate('/login')
        }
    },[navigate, status])

    return children;
}