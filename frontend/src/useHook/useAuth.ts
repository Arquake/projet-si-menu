import {userStore} from "../store/userStore.ts";
import {useCallback} from "react";
import RegisterError from "../Error/RegisterError.ts"

export enum AuthStatus {
    Unknown = 0,
    Authenticated = 1,
    Guest = 2,
}

const apiUrl: string = import.meta.env.VITE_FETCH_API;

export function useAuth() {
    const {account, setAccount} = userStore();
    let status = AuthStatus.Unknown;
    switch (account) {
        case null :
            status = AuthStatus.Guest;
            break;
        case undefined :
            status = AuthStatus.Unknown;
            break;
        default :
            status = AuthStatus.Authenticated;
            break;
    }


    const tokenAuthenticate = useCallback(() => {
        fetch(apiUrl + '/token-login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('refreshToken') || ''}`
            }
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error('Network response was not ok');
                }
                return res.json();
            })
            .then((data) => {
                setAccount(data);
                localStorage.setItem('jwt', data.jwt);
                localStorage.setItem('refreshToken', data.refreshToken);
            })
            .catch(()=> {
                setAccount(null);
                localStorage.removeItem('jwt');
                localStorage.removeItem('refreshToken');
            });
    }, [])


    const login = useCallback((email: string, password:string) => {
        return fetch(apiUrl + '/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        })
        .then(res => {
            if (!res.ok) {
                throw new Error('Network response was not ok');
            }
            return res.json();
        })
        .then((data) => {
            setAccount(data);
            localStorage.setItem('jwt', data.jwt);
            localStorage.setItem('refreshToken', data.refreshToken);
            return true
        })
        .catch(()=>{return false});
    }, [])


    const logout = useCallback(() => {
        fetch(apiUrl + '/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${account?.refreshToken || ''}`
            }
        })
        .then(()=> {
            setAccount(null);
            localStorage.removeItem('jwt');
            localStorage.removeItem('refreshToken');
        })
    }, [])

    const register = useCallback((email: string, username: string, password:string) => {
        return fetch(apiUrl + '/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email,
                password,
                username
            })
        })
        .then(res => {
            if (!res.ok) {
                return Promise.reject({...res.json(), status:res.status});
            }
            return res.json();
        })
        .then((data) => {
            setAccount(data);
            localStorage.setItem('jwt', data.jwt);
            localStorage.setItem('refreshToken', data.refreshToken);
            return true
        })
        .catch((error)=>{
            return error
        });
    }, [])

    return {
        account,
        status,
        tokenAuthenticate,
        login,
        logout,
        register
    }
}