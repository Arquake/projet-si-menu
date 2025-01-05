import React, { useEffect, useState, useRef } from "react"
import { useAuth } from "../useHook/useAuth";
import ComputedRemaingTime from "../components/ComputedRemainingTime"
import { io, Socket } from 'socket.io-client';
import Confetti from 'react-confetti';
import { useNavigate } from "react-router-dom";


interface Etape {
    name: string,
    description: string, 
    authors: string, 
    url: string, 
    placement: number,
    gameId: string,
    time: Date,
    order: number
}

interface ProjectsList {
    name: string, 
    description: string, 
    authors: string, 
    url: string, 
    placement: number,
    order: number
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

    const navigate = useNavigate()

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
                    setProjectList(allProjects.sort((a,b)=> a.placement - b.placement));
                    socketRef.current!.emit('joinRoom', res.gameId)
                }
            } else {
                const allProjects: ProjectsList[] = await getAllGames();
                setProjectList(allProjects.sort((a,b)=> a.placement - b.placement));
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
        fetchGameData();
    }, [account]);
  
    const initializeSocket = () => {
        if (socketRef.current === null) {
            socketRef.current = io('http://localhost:3000');
    
            socketRef.current.on('stageValidation', (e) => {
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
                setPlayerTurn(true)
            });

            socketRef.current.on('timeout', () => {
                setPlayerTimedOut(true);
                setGameEnded(true);
            });
        }
    };

    const handleToScore = () => {
        navigate("/score");
    }

    return (
        <>
            <div className={`${gameEnded? "bg-blue-600" : ""} flex flex-col min-h-screen`}>
                <div className="grid grid-cols-3 gap-4 container self-center pt-6">
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
                            {
                                !gameEnded && !playerTimedOut? 
                                    <aside className="w-full md:col-span-1 md:col-start-2 col-span-full row-start-2 border-neutral-300
                                    md:border-x-2 border-b-2">
                                    {
                                        gameEnded || playerTimedOut?
                                        <></>
                                        : projectList.map((element) => {
                                            return (
                                                <div className="pt-2 pb-3 px-4 bg-neutral-50 border-t-2 border-neutral-300 flex gap-4 items-center justify-center" key={element.name}>
                                                    <p className="justify-self-start">
                                                        {element.name}
                                                    </p>
                                                    {
                                                        element.order < etape!.order || gameEnded?
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
                                : 
                                <>
                                </>
                            }
                            

                            <div key={etape!.name} className="self-center justify-self-center text-center col-span-full pb-4">
                                {
                                    gameEnded || playerTimedOut?
                                        <>
                                            {
                                                playerTimedOut?
                                                <p>Vous avez été TO</p>
                                                : 
                                                <>
                                                    {gameEnded && <Confetti gravity={0.05} numberOfPieces={100}/>}
                                                    <div className="px-8">
                                                        <div className="sm:space-y-16 space-y-12 p-8 rounded-xl bg-neutral-50 shadow-lg">
                                                            <div>
                                                                <p className="sm:text-4xl text-3xl font-normal">
                                                                    Bravo!
                                                                </p>
                                                                <p className="sm:text-3xl text-2xl opacity-90 fo nt-normal">
                                                                    Vous vous êtes échappé
                                                                </p>
                                                            </div>

                                                            <div className="w-full flex flex-col gap-2 items-center justify-center">
                                                                <img src="cup.svg" className="sm:w-3/5 w-1/2"/>
                                                                <div>
                                                                    <p className="sm:text-2xl text-xl">
                                                                        Votre score est de :
                                                                    </p>
                                                                    <p className="sm:text-3xl text-2xl">
                                                                        //TODO Faire le socket pour get le score
                                                                    </p>
                                                                </div>

                                                                <div className="pt-6">
                                                                    <button className="sm:py-2 py-1 sm:px-8 px-6 hover:bg-blue-700 bg-blue-600
                                                                    text-neutral-50 font-semibold sm:text-xl text-lg rounded-lg shadow-lg
                                                                    duration-300" onClick={handleToScore}>
                                                                        Voir vos score
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </>
                                            }
                                            
                                        </>
                                    : <>
                                        {
                                            etapeStartTime !== null?
                                            <>
                                                <p>temps restant: <ComputedRemaingTime startDate={etapeStartTime!} onRemainingTimeChange={handleRemainingTimeChange} ticking={gameEnded}/></p>
                                                <p className="sm:text-2xl text-xl">{etape!.name}</p>
                                                <p className="sm:text-xl text-lg">Allez dans la salle {etape!.placement}</p>
                                                <p className="text-blue-500 underline sm:text-3xl text-2xl">{etape!.gameId}</p>
                                            </>
                                            : playerTurn?
                                            <>
                                                <p className="sm:text-2xl text-xl">{etape!.name}</p>
                                                <p className="sm:text-xl text-lg">Allez dans la salle {etape!.placement}</p>
                                                <p className="text-blue-500 underline sm:text-3xl text-2xl">{etape!.gameId}</p>
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
                {
                    gameEnded?
                    <img src="bandeau.png" className="xl:blur-md blur-sm w-full"/>
                    :
                    <></>
                }
            </div>
        </>
    )
}


