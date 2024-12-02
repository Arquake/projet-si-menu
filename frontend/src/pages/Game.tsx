import { useEffect, useState } from "react"
import { useAuth } from "../useHook/useAuth";

interface Etape {
    jwt: string;
    name: string,
    description: string, 
    authors: string, 
    url: string, 
    placement: string
}

export default function Game() {

    const {makePostRequest} = useAuth();

    const [etapes, setEtapes] = useState<Etape[]>([]);

    const [fetchError, setFetchError] = useState(true)

    useEffect(() => {
        let jwt: string | null = localStorage.getItem('jwt')
        let refreshToken: string | null = localStorage.getItem('refreshToken')
        try {
            const res = makePostRequest('/create-game', jwt, {},
                (res)=>{
                    return res.json()
                },
                (_) => {
                    return makePostRequest('/refresh-jwt', refreshToken, {}, 
                        (_) => {
                            return makePostRequest('/create-game', jwt, {},
                            (res)=>{
                                return res.json()
                            },
                            (error) => {
                                throw error
                            }
                        );
                        },
                        (error) => {
                            throw error
                        }
                    )
                }
            )

            res.then((result)=>setEtapes(result))
        }
        catch(error) {
            setFetchError(true);
        }
        
    }, []
)

    return (
        <>
            <ul className="flex flex-col gap-4 container self-center">
                {fetchError && 
                    <div className="self-justify-center self-center flex flex-col items-center justify-center pt-8 text-2xl">
                        <p>
                            Une erreur s'est produite en essayant d'établir une connexion avec le serveur
                        </p>
                        <p>
                            Code erreur : 500
                        </p>
                    </div>
                }
                {etapes.map((item, index) => (
                    <li key={index}>
                        <p>{item.name}</p>
                        <p>{item.jwt}</p>
                        <p>{item.url}</p>
                        <a href={`${item.url}?${
                            (new URLSearchParams({
                                appJwt: item.jwt,
                            })).toString()
                        }`} className="text-blue-500 underline">url test</a>
                    </li>
                ))}
            </ul>
        </>
    )
}