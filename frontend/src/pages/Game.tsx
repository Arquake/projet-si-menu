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

    const [etape, setEtape] = useState<Etape>({jwt:"",name:"",description:"", authors:"",url:"",placement:""});

    const [fetchError, setFetchError] = useState(true)

    useEffect(() => {
        let jwt: string | null = localStorage.getItem('jwt')
        let refreshToken: string | null = localStorage.getItem('refreshToken')
        try {
            const res = makePostRequest<Etape>('/create-game', jwt, {},
                (res)=>{
                    return res.json()
                },
                (_) => {
                    return makePostRequest('/refresh-jwt', refreshToken, {}, 
                        (_) => {
                            return makePostRequest<Etape>('/create-game', jwt, {},
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

            console.log(res)
            setEtape(res as Etape)
            setFetchError(false);

        }
        catch(error) {
            setFetchError(true);
        }
        
    }, []
)

    return (
        <>
            <ul className="flex flex-col gap-4 container self-center">
                {fetchError? 
                    <div className="self-justify-center self-center flex flex-col items-center justify-center pt-8 text-2xl">
                        <p>
                            Une erreur s'est produite en essayant d'établir une connexion avec le serveur
                        </p>
                        <p>
                            Code erreur : 500
                        </p>
                    </div>

                    :

                    <li key={etape.name}>
                        <p>{etape.name}</p>
                        <p>{etape.jwt}</p>
                        <p>{etape.url}</p>
                        <a href={`${etape.url}?${
                            (new URLSearchParams({
                                appJwt: etape.jwt,
                            })).toString()
                        }`} className="text-blue-500 underline">url test</a>
                    </li>
                }

                
            </ul>
        </>
    )
}