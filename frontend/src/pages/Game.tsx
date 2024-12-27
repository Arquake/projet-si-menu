import { useEffect, useState, useRef } from "react"
import { useAuth } from "../useHook/useAuth";
import ComputedRemaingTime from "../components/ComputedRemainingTime"
import { io, Socket } from 'socket.io-client';

interface Etape {
    name: string,
    description: string, 
    authors: string, 
    url: string, 
    placement: number,
    gameId: string,
    time: Date
}

interface ProjectsList {
    name: string, 
    description: string, 
    authors: string, 
    url: string, 
    placement: number
}

export default function Game() {

    const {makePostRequest, refreshJwt, account} = useAuth();

    const [etape, setEtape] = useState<Etape|null>(null);
    const [projectList, setProjectList] = useState<ProjectsList[]>([])

    const [fetchError, setFetchError] = useState<boolean|null>(null);
    const [errorCode, setErrorCode] = useState(500);
    const fetchErrorRef = useRef(true);
    const fetchErrorCode = useRef(500);

    const [gameEnded, setGameEnded] = useState(false);

    const [remainingTimeFromChild, setRemainingTimeFromChild] = useState<number>();

    const socketRef = useRef<Socket | null>(null);

    const [etapeStartTime, setEtapeStartTime] = useState<Date|null>(null);
    const [playerTurn, setPlayerTurn] = useState<boolean>(false)

    const [playerTimedOut, setPlayerTimedOut] = useState<boolean>(false)

    const handleRemainingTimeChange = (remainingTime: number) => {
        setRemainingTimeFromChild(remainingTime);
    };

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
    };

    const getAllGames = () => {
        return makePostRequest<ProjectsList[]>('/get-all-projects', account?.jwt, {},
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
    };

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
    };

    const fetchGameData = async () => {   
        try {
            let res: Etape = await getOngoingGame();
            setEtape(res);

            if (fetchErrorRef.current) {
                await refreshJwt();
                res = await getOngoingGame();
                setEtape(res);

                if (fetchErrorRef.current) {
                    res = await createGame();
                    setEtape(res);

                    const allProjects: ProjectsList[] = await getAllGames();
                    setProjectList(allProjects);
                    socketRef.current!.emit('joinRoom', res.gameId)
                }
            } else {
                const allProjects: ProjectsList[] = await getAllGames();
                setProjectList(allProjects);
                socketRef.current!.emit('joinRoom', res.gameId)
            }
        } catch (error) {
            fetchErrorRef.current = true;
        } finally {
            setFetchError(fetchErrorRef.current);
            setErrorCode(fetchErrorCode.current);
        }
    };

    useEffect(() => {
        
        if (account !== undefined && etape === null) {
            if(socketRef.current === null) {
                initializeSocket()
            }
        }
        fetchGameData()
    }, [account]);
  
    const initializeSocket = () => {
        if (socketRef.current === null) {
            socketRef.current = io('http://localhost:3000'); // Replace with your backend URL
    
            // Listen for messages from the server
            socketRef.current.on('stageValidation', (e) => {
                console.log('stage validation')
                setEtape(e)
                setEtapeStartTime(null)
                setPlayerTurn(false)
            });

            socketRef.current.on('endGame', () => {
              setGameEnded(true)
            });

            socketRef.current.on('startEtape', (date)=>{
                setPlayerTurn(false)
                setEtapeStartTime(new Date(date))
            });

            socketRef.current.on('playerCanStart',()=>{
                console.log('player can start')
                setPlayerTurn(true)
            });

            socketRef.current.on('timeout', () => {
                setPlayerTimedOut(true);
                setGameEnded(true);
            });
        }
    };
  

    return (
        <>
            <div className="grid grid-cols-3 gap-4 container self-center pt-12">
                {fetchError === true? 
                    <div className="self-justify-center self-center flex flex-col items-center justify-center pt-8 text-2xl col-span-full">
                        <p>
                            Une erreur s'est produite en essayant d'établir une connexion avec le serveur
                        </p>
                        <p>
                            Code erreur : {errorCode}
                        </p>
                    </div>

                : fetchError === null?
                    <div className="col-span-full">
                        <div className='h-screen w-screen flex items-center justify-center'>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" className="animate-spin h-12 aspect-square">
                                <path fill="currentColor" d="M2 8a6 6 0 1 1 6 6a.5.5 0 0 0 0 1a7 7 0 1 0-7-7a.5.5 0 0 0 1 0"/>
                            </svg>
                        </div>
                    </div>
                :
                    <>
                        <aside className="flex flex-col w-fit gap-2 col-span-1">
                            {
                                
                                projectList.map((element) => {
                                    return (
                                        <div className="py-1 px-4 rounded-full bg-neutral-50 border border-blue-500 flex gap-4 items-center" key={element.name}>
                                            <p className="justify-self-start">
                                                {element.name}
                                            </p>
                                            {
                                                element.placement < etape!.placement || gameEnded?
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 aspect-square justify-self-end text-blue-600">
                                                    <g fill="none" fillRule="evenodd"><path d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z"/><path fill="currentColor" d="M21.546 5.111a1.5 1.5 0 0 1 0 2.121L10.303 18.475a1.6 1.6 0 0 1-2.263 0L2.454 12.89a1.5 1.5 0 1 1 2.121-2.121l4.596 4.596L19.424 5.111a1.5 1.5 0 0 1 2.122 0"/></g>
                                                </svg>
                                                :
                                                <div id="spacePlaceholder" className="h-5 aspect-square">

                                                </div>
                                            }
                                        </div>
                                    );
                                })
                            }
                        </aside>

                        <div key={etape!.name} className="self-center justify-self-center text-center">
                            {
                                gameEnded || playerTimedOut?
                                    <>
                                        {
                                            playerTimedOut?
                                            <p>Vous avez été TO</p>
                                            : <></>
                                        }
                                        <p>Découvrez votre score !</p>
                                    </>
                                : <>
                                    {
                                        etapeStartTime !== null?
                                        <>
                                            <p>temps restant: <ComputedRemaingTime startDate={etapeStartTime!} onRemainingTimeChange={handleRemainingTimeChange} ticking={gameEnded}/></p>
                                            <p className="text-2xl">{etape!.name}</p>
                                            <p className="text-xl">Allez dans la salle {etape!.placement}</p>
                                            <p className="text-blue-500 underline text-3xl">{etape!.gameId}</p>
                                        </>
                                        : playerTurn?
                                        <>
                                            <p className="text-2xl">{etape!.name}</p>
                                            <p className="text-xl">Allez dans la salle {etape!.placement}</p>
                                            <p className="text-blue-500 underline text-3xl">{etape!.gameId}</p>
                                        </>
                                        : 
                                        <p>
                                            Vous êtes dans la file d'attente pour la prochaine salle
                                        </p>
                                    }
                                </>
                            }
                            
                            
                            
                        </div>
                    </>
                }

                
            </div>
        </>
    )
}


