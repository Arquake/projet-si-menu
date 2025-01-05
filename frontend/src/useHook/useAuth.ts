import {userStore} from "../store/userStore.ts";
import {useCallback} from "react";

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
                setAccount({jwt: data.jwt, refreshToken: data.refreshToken, username: localStorage.getItem("username") ||''});
                localStorage.setItem('jwt', data.jwt);
                localStorage.setItem('refreshToken', data.refreshToken);
            })
            .catch(()=> {
                setAccount(null);
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
            localStorage.setItem('username', data.username);
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
                'Authorization': `Bearer ${account?.refreshToken || localStorage.getItem('refreshToken')}`
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
            localStorage.setItem('username', data.username);
            localStorage.setItem('jwt', data.jwt);
            localStorage.setItem('refreshToken', data.refreshToken);
            return true
        })
        .catch((error)=>{
            return error
        });
    }, [])



    const makePostRequest = useCallback(<ResponseType>(
        uri: string ='/',
        bearer: string | null = null,
        body: object = {},
        thenRequest: (res:any) => ResponseType = (res)=>{if (!res.ok) {throw new Error('Network response was not ok');}return res.json() as ResponseType;},
        catchRequest: (error: any) => any = (error)=>{throw error}
    ): Promise<ResponseType> => {
        return fetch(apiUrl + uri, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${bearer || ''}`
            },
            body: JSON.stringify(body)
        })
        .then(thenRequest)
        .catch(catchRequest);
    }, [] )


    const refreshJwt = useCallback(()=>{
        makePostRequest('/refresh-jwt', account?.refreshToken, {}, 
            async (res) => {
                if (res.status === 401) {
                    setAccount(null);
                    throw new Error('invalid refresh token')
                }
                else {
                    let result = await res.json();
                    localStorage.setItem('jwt', res.jwt);
                    account!.jwt = result.jwt;
                }
            },
            (error) => {
                throw error
            }
        )
    }, [])

    const updateUsername = useCallback((newUsername: string)=>{
        setAccount({...account!, username: newUsername})
    },[])

    return {
        account,
        status,
        tokenAuthenticate,
        login,
        logout,
        register,
        makePostRequest,
        refreshJwt,
        updateUsername
    }
}
