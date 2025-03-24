import React from "react"
import Leaderboard from "../interfaces/ILearderboard"
import { format } from 'date-fns';


interface ScoreboardProp {
    scoreBoard: Leaderboard[],
    useNames: boolean
}

export default function ScoreboardComponent ({scoreBoard, useNames}: ScoreboardProp) {
    return (
        <>
            {
                useNames?
                    <div className="grid lg:grid-cols-4 md:grid-cols-5 grid-cols-3 gap-4 px-4 
                    md:text-lg font-semibold">
                        <p className="md:col-span-2 truncate">Joueur</p>
                        <p className="lg:col-span-1 md:col-span-2">Temps</p>
                        <p>Score</p>
                    </div>
                :
                    <div className="grid grid-cols-2 gap-4 px-4 
                        md:text-lg font-semibold">
                        <p>Temps</p>
                        <p>Score</p>
                    </div>
            }
            <div className="border-t-2 border-neutral-300 w-full self-center" />
            <div className="md:max-h-[11.25rem] max-h-[8rem] overflow-y-auto">
                {
                    scoreBoard.map((element, i) => (
                        <React.Fragment key={i}>
                            <div className="px-4 md:text-base sm:text-sm text-xs">
                                {
                                    useNames?
                                    <div className="grid lg:grid-cols-4 md:grid-cols-5 grid-cols-3 gap-4 pt-2 pb-0.5">
                                        {
                                        element ?
                                            <>
                                                <p className="md:col-span-2 truncate">{element.username}</p>
                                                <p className="md:col-span-2 lg:col-span-1">{format(element.time, 'HH:mm:ss')}</p>
                                                <p>{element.score}</p>
                                            </>
            
                                        :
            
                                            <>
                                                <p className="md:col-span-2 truncate text-neutral-400">------</p>
                                                <p className="md:col-span-2 lg:col-span-1 text-neutral-400">--:--:--</p>
                                                <p className="text-neutral-400">--</p>
                                            </>
                                        }
                                    </div>
                                    :
                                    <div className="grid grid-cols-2 gap-4 pt-2 pb-0.5">
                                        {
                                        element ?
                                            <>
                                                <p>{format(element.time, 'HH:mm:ss')}</p>
                                                <p>{element.score}</p>
                                            </>
            
                                        :
            
                                            <>
                                                <p className="text-neutral-400">--:--:--</p>
                                                <p className="text-neutral-400">------</p>
                                            </>
                                        }
                                    </div>
                                }
                            </div>
                            {
                                i < scoreBoard.length-1 && <div className="border-t-2 border-neutral-300 w-full self-center" />
                            }
                        </React.Fragment>
                    ))
                }
            </div>
        </>
    )
}