import { useEffect, useState, useRef } from "react"
import { useAuth } from "../useHook/useAuth";

interface Etape {
    name: string,
    description: string, 
    authors: string, 
    url: string, 
    placement: string,
    gameId: string
}

export default function Game() {

    const {makePostRequest, refreshJwt, account} = useAuth();

    const [etape, setEtape] = useState<Etape>({name:"",description:"", authors:"",url:"",placement:"", gameId:""});

    const [fetchError, setFetchError] = useState<boolean|null>(null);
    const [errorCode, setErrorCode] = useState(500);
    const fetchErrorRef = useRef(true);
    const fetchErrorCode = useRef(500);


    const getOngoingGame = () => {
        return makePostRequest<Etape>('/get-ongoing-player-game', account?.jwt, {},
            (res) => {
                if(res.status === 200) {
                    fetchErrorRef.current = false;
                    let result = res.json()
                    return result
                }
                else {
                    fetchErrorRef.current = true;
                    fetchErrorCode.current = res.status;
                }
            }
        )
    }

    const createGame = () => {
        return makePostRequest<Etape>('/create-game', account?.jwt, {},
            (res)=>{
                if (res.status === 200) {
                    fetchErrorRef.current = false;
                    let result = res.json()
                    return result
                }
                else {
                    fetchErrorCode.current = res.status;
                    fetchErrorRef.current = true;
                }
            }
        );
    }

    useEffect(() => {
        const fetchGameData = async () => {
            try {
                // Try to get the ongoing game
                let res: Etape = await getOngoingGame();
                setEtape(res)
                if (fetchErrorRef.current) {
                    await refreshJwt();
                    let res: Etape = await getOngoingGame();
                    setEtape(res)
                    if (fetchErrorRef.current) {
                        let res: Etape = await createGame();
                        setEtape(res)
                    }
                }
            } catch (error) {
                fetchErrorRef.current = true;
            } finally {
                setFetchError(fetchErrorRef.current);
                setErrorCode(fetchErrorCode.current);
            }
        };
    
        fetchGameData();
    }, []);
    

    return (
        <>
            <div className="flex flex-col gap-4 container self-center">
                {fetchError === true? 
                    <div className="self-justify-center self-center flex flex-col items-center justify-center pt-8 text-2xl">
                        <p>
                            Une erreur s'est produite en essayant d'établir une connexion avec le serveur
                        </p>
                        <p>
                            Code erreur : {errorCode}
                        </p>
                    </div>

                : fetchError === null?
                    <div>
                        <div className='h-screen w-screen flex items-center justify-center'>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" className="animate-spin h-12 aspect-square">
                                <path fill="currentColor" d="M2 8a6 6 0 1 1 6 6a.5.5 0 0 0 0 1a7 7 0 1 0-7-7a.5.5 0 0 0 1 0"/>
                            </svg>
                        </div>
                    </div>
                :

                    <div key={etape.name} className="self-center justify-self-center text-center pt-4">
                        <p className="text-2xl">{etape.name}</p>
                        <p className="text-blue-500 underline text-3xl">{etape.gameId}</p>
                    </div>
                }

                
            </div>
        </>
    )
}