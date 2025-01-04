import "./../../styles/scoreboard.css"
import {useEffect, useRef, useState} from 'react'
import { useAuth } from "../../useHook/useAuth";
import ScoreboardAnimation from "./scoreboardAnimation";
import Leaderboard from "../../interfaces/ILearderboard";
import ScoreboardComponent from "../ScoreboardComponent";


export default function Scoreboard () {

    const { makePostRequest } = useAuth()

    const [everScoreboard, setEverScoreboard] = useState<Leaderboard[]>([]); 
    const [monthScoreboard, setMonthScoreboard] = useState<Leaderboard[]>([]); 
    const [weekScoreboard, setWeekScoreboard] = useState<Leaderboard[]>([]); 

    const scoreboardRef = useRef(null);

    const [currentScoreboard, setCurrentScoreboard] = useState(0);

    useEffect(()=>{
        makePostRequest<Leaderboard[]>("/get-top-ever")
        .then((data)=>{
            setEverScoreboard(data)
        })

        makePostRequest<Leaderboard[]>("/get-top-month")
        .then((data)=>{
            setMonthScoreboard(data)
        })

        makePostRequest<Leaderboard[]>("/get-top-week")
        .then((data)=>{
            setWeekScoreboard(data)
        })
        
    },[])

    const getCurrentScoreboard = (): Leaderboard[] => {
        let scoreboard: Leaderboard[] = []
        
        if (currentScoreboard === 0) {
            scoreboard = everScoreboard
        }
        else if (currentScoreboard === 1 ) {
            scoreboard = monthScoreboard
        }
        else if (currentScoreboard === 2) {
            scoreboard = weekScoreboard
        }
        
        return [...scoreboard, ...Array(5 - scoreboard.length).fill(null)].slice(0, 5);
    }

    const changeCurrentScoreboard = (index: number) => {
        setCurrentScoreboard(index)
    }

    return (
        <>
            <div className="w-full py-8 flex items-center justify-center bg-blue-600" ref={scoreboardRef}>
                <div className="container grid grid-cols-2 gap-16">
                    <div id="scoreboard" className="flex items-center justify-center
                    col-span-full md:col-span-1
                    px-4 md:px-0">
                        <div className="bg-neutral-100 pt-4 pb-6 px-6 flex flex-col
                        rounded-2xl shadow-lg w-full">
                            <p className="text-center py-4 dm:text-3xl text-2xl pb-6">Meilleurs Scores</p>
                            <div className="px-4 flex gap-1 scoreboard-tab">
                                <div className={(currentScoreboard === 0? "active" : "") + " cursor-pointer"} onClick={() => changeCurrentScoreboard(0)}>
                                    <p>Tout</p>
                                </div>
                                <div className={(currentScoreboard === 1? "active" : "") + " cursor-pointer"} onClick={() => changeCurrentScoreboard(1)}>
                                    <p>Mois</p>
                                </div>
                                <div className={(currentScoreboard === 2? "active" : "") + " cursor-pointer"} onClick={() => changeCurrentScoreboard(2)}>
                                    <p>Semaine</p>
                                </div>
                            </div>
                            <div className="border-2 border-neutral-300 pt-1 rounded-xl">
                                <ScoreboardComponent scoreBoard={getCurrentScoreboard()} useNames={true}/>
                            </div>
                        </div>
                    </div>

                    <ScoreboardAnimation scoreboardRef={scoreboardRef}/>
                </div>
            </div>

            
        </>
    )
}