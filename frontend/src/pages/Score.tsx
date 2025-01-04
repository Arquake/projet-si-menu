import { useState, useEffect } from "react";
import ScoreboardComponent from "../components/ScoreboardComponent";
import Leaderboard from "../interfaces/ILearderboard";
import { useAuth } from "../useHook/useAuth";
import { ca } from "date-fns/locale";


interface ScoreboardObject {
    ever: Leaderboard[],
    month: Leaderboard[],
    week: Leaderboard[]
}

export default function Score () {

    const {makePostRequest, account, refreshJwt} = useAuth();

    const [currentPersonnalScoreboard, setCurrentPersonnalScoreboard] = useState<number>(0);
    const [currentGlobalScoreboard, setCurrentGlobalScoreboard] = useState<number>(0);

    const [personnalScoreboards, setPersonnalScoreboards] = useState<ScoreboardObject>({"ever": [], "month": [], "week": []});
    const [globalScoreboards, setGlobalScoreboards] = useState<ScoreboardObject>({"ever": [], "month": [], "week": []});

    const [globalFetchError, setGlobalFetchError] = useState<boolean>(false)
    const [personnalFetchError, setPersonnalFetchError] = useState<boolean>(false)

    const changeCurrentPersonnalScoreboard = (index: number) => {
        setCurrentPersonnalScoreboard(index)
    }

    const changeCurrentGlobalScoreboard = (index: number) => {
        setCurrentGlobalScoreboard(index)
    }

    const getCurrentScoreboardPersonnal = (): Leaderboard[] => {
        let scoreboard: Leaderboard[] = []

        if (personnalScoreboards !== undefined ) {
            if (currentPersonnalScoreboard === 0) {
                scoreboard = personnalScoreboards.ever;
            }
            else if (currentPersonnalScoreboard === 1 ) {
                scoreboard = personnalScoreboards.month
            }
            else if (currentPersonnalScoreboard === 2) {
                scoreboard = personnalScoreboards.week
            }
        }
        
        return [...scoreboard, ...Array(5 - scoreboard.length).fill(null)];
    }

    const getCurrentScoreboardGlobal = (): Leaderboard[] => {
        let scoreboard: Leaderboard[] = []

        if (globalScoreboards !== undefined ) {
            if (currentGlobalScoreboard === 0) {
                scoreboard = globalScoreboards.ever;
            }
            else if (currentGlobalScoreboard === 1 ) {
                scoreboard = globalScoreboards.month
            }
            else if (currentGlobalScoreboard === 2) {
                scoreboard = globalScoreboards.week
            }
        }
        
        return [...scoreboard, ...Array(5 - scoreboard.length).fill(null)];
    }

    useEffect(()=>{
        const fetchGlobal = async () => {
            try {
                const [everData, monthData, weekData] = await Promise.all([
                    makePostRequest<Leaderboard[]>("/get-top-ever"),
                    makePostRequest<Leaderboard[]>("/get-top-month"),
                    makePostRequest<Leaderboard[]>("/get-top-week"),
                ]);
        
                setGlobalScoreboards(() => ({
                    ever: everData,
                    month: monthData,
                    week: weekData,
                }));
        
            } catch (_) {
              
            }
        };

        const fetchPersonnal = async () => {
            try {
                const [everData, monthData, weekData] = await Promise.all([
                    makePostRequest<Leaderboard[]>("/personnal-top-ever", account?.jwt || ''),
                    makePostRequest<Leaderboard[]>("/personnal-top-month", account?.jwt || ''),
                    makePostRequest<Leaderboard[]>("/personnal-top-week", account?.jwt || ''),
                ]);
        
                setPersonnalScoreboards(() => ({
                ever: everData,
                month: monthData,
                week: weekData,
                }));
            }
            catch (error) {throw error}
        };
        
        try {
            fetchGlobal();
        }
        catch (_) {
            setGlobalFetchError(true)
        }
        
        try {
            fetchPersonnal();
        }
        catch (_) {
            try {
                refreshJwt();
                fetchPersonnal();
            }
            catch (_) {
                setPersonnalFetchError(true)
            }
        }
    },[])

    return (
        <>
            <main className="flex flex-col items-center justify-center pt-8">
                <div className="container grid grid-cols-2 md:gap-16 gap-8">
                    <div id="scoreboard" className="flex items-center justify-center
                    col-span-full md:col-span-1
                    px-4 md:px-0">
                        <div className="bg-neutral-100 pt-4 pb-6 px-6 flex flex-col
                        rounded-2xl shadow-lg w-full">
                            <p className="text-center py-4 dm:text-3xl text-2xl pb-6">Vos Meilleurs Scores</p>
                            {
                                personnalFetchError?
                                <div className="flex flex-col gap-4">
                                    <p className="text-red-600 font-semibold text-center">
                                        Une erreur innatendu s'est produite en essayant de récupérer vos scores
                                    </p>
                                    <img src="thinkface.svg" className="h-16"/>
                                </div>
                                :
                                <>
                                    <div className="px-4 flex gap-1 scoreboard-tab">
                                        <div className={(currentPersonnalScoreboard === 0? "active" : "") + " cursor-pointer"} onClick={() => changeCurrentPersonnalScoreboard(0)}>
                                            <p>Tout</p>
                                        </div>
                                        <div className={(currentPersonnalScoreboard === 1? "active" : "") + " cursor-pointer"} onClick={() => changeCurrentPersonnalScoreboard(1)}>
                                            <p>Mois</p>
                                        </div>
                                        <div className={(currentPersonnalScoreboard === 2? "active" : "") + " cursor-pointer"} onClick={() => changeCurrentPersonnalScoreboard(2)}>
                                            <p>Semaine</p>
                                        </div>
                                    </div>
                                    <div className="border-2 border-neutral-300 pt-1 rounded-lg">
                                        <ScoreboardComponent scoreBoard={getCurrentScoreboardPersonnal()} useNames={false}/>
                                    </div>
                                </>
                            }
                            
                        </div>
                    </div>

                    <div id="scoreboard" className="flex items-center justify-center
                    col-span-full md:col-span-1
                    px-4 md:px-0">
                        <div className="bg-neutral-100 pt-4 pb-6 px-6 flex flex-col
                        rounded-2xl shadow-lg w-full">
                            <p className="text-center py-4 dm:text-3xl text-2xl pb-6">Les Meilleurs Scores</p>
                            {
                                globalFetchError?
                                <div className="flex flex-col gap-4">
                                    <p className="text-red-600 font-semibold text-center">
                                        Une erreur innatendu s'est produite en essayant de récupérer les meilleurs scores
                                    </p>
                                    <img src="thinkface.svg" className="h-16"/>
                                </div>
                                :
                                <>
                                    <div className="px-4 flex gap-1 scoreboard-tab">
                                        <div className={(currentGlobalScoreboard === 0? "active" : "") + " cursor-pointer"} onClick={() => changeCurrentGlobalScoreboard(0)}>
                                            <p>Tout</p>
                                        </div>
                                        <div className={(currentGlobalScoreboard === 1? "active" : "") + " cursor-pointer"} onClick={() => changeCurrentGlobalScoreboard(1)}>
                                            <p>Mois</p>
                                        </div>
                                        <div className={(currentGlobalScoreboard === 2? "active" : "") + " cursor-pointer"} onClick={() => changeCurrentGlobalScoreboard(2)}>
                                            <p>Semaine</p>
                                        </div>
                                    </div>
                                    <div className="border-2 border-neutral-300 pt-1 rounded-lg">
                                        <ScoreboardComponent scoreBoard={getCurrentScoreboardGlobal()} useNames={false}/>
                                    </div>
                                </>
                            }
                        </div>
                    </div>
                </div>
            </main>
        </>
    )
}