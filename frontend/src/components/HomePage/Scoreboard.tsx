import "./../../styles/scoreboard.css"
import React, {useEffect, useRef, useState} from 'react'
import { format } from 'date-fns';


interface Leaderboard {
    name: string,
    time: Date,
    score: number
}

export default function Scoreboard () {

    const [everScoreboard, setEverScoreboard] = useState<Leaderboard[]>([]); 
    const [monthScoreboard, setMonthScoreboard] = useState<Leaderboard[]>([]); 
    const [weekScoreboard, setWeekScoreboard] = useState<Leaderboard[]>([]); 

    const everScoreboardRef = useRef(null); 
    const monthScoreboardRef = useRef(null); 
    const weekScoreboardRef = useRef(null); 

    const [currentScoreboard, setCurrentScoreboard] = useState(0);

    const removeAllAnimationClasses = () => {
        indiceTextRef.current.classList.remove("text-netflix-in")
        indiceTextRef.current.classList.remove("text-left-out")
        indiceTextRef.current.classList.remove("hidden")
        indiceSceneRef.current.classList.remove("fade-out-scene")
        indiceSceneRef.current.classList.remove("fade-in")
        indiceSceneRef.current.classList.remove("hidden")
        researchTextRef.current.classList.remove("scene-from-right")
        researchTextRef.current.classList.remove("text-crash-in-panel")
        researchTextRef.current.classList.remove("rotate-out-text")
        researchTextRef.current.classList.remove("hidden")
        researchSceneRef.current.classList.remove("scene-from-right")
        researchSceneRef.current.classList.remove("image-spiral-out")
        researchSceneRef.current.classList.remove("hidden")
        escapeSceneRef.current.classList.remove('top-to-bot')
        escapeSceneRef.current.classList.remove('mid-to-bot')
        escapeSceneRef.current.classList.remove('hidden')
        escapeTextRef.current.classList.remove('from-side')
        escapeTextRef.current.classList.remove('rotated-90-x')
        escapeTextRef.current.classList.remove('disapear-escape-text')
        escapeTextRef.current.classList.remove('hidden')
    }

    const resetAnimationsToBase = () => {
        removeAllAnimationClasses()
        researchTextRef.current.classList.add('hidden')
        escapeTextRef.current.classList.add('hidden')
        researchSceneRef.current.classList.add('hidden')
        escapeSceneRef.current.classList.add('hidden')
        indiceTextRef.current.classList.add("text-netflix-in")
    }

    const scoreboardRef = useRef(null);

    const [currentAnimation, setCurrentAnimation] = useState(0)

    const indiceTextRef = useRef(null);
    const indiceSceneRef = useRef(null);

    const researchTextRef = useRef(null);
    const researchSceneRef = useRef(null);

    const escapeTextRef = useRef(null);
    const escapeSceneRef= useRef(null);

    const handleAnimationEnd = () => {
        switch (currentAnimation) {
            case 0:
                indiceTextRef.current.classList.remove("text-netflix-in")
                indiceTextRef.current.classList.add("text-left-out")
                setCurrentAnimation(1)
                break;
            case 1:
                indiceTextRef.current.classList.add("hidden")
                indiceTextRef.current.classList.remove("text-left-out")
                indiceSceneRef.current.classList.add("fade-out-scene")
                setCurrentAnimation(2)
                break;
            case 2:
                indiceSceneRef.current.classList.add("hidden")
                indiceSceneRef.current.classList.remove("fade-out-scene")
                researchSceneRef.current.classList.add("scene-from-right")
                researchSceneRef.current.classList.remove("hidden")
                setCurrentAnimation(3)
                break;
            case 3:
                researchTextRef.current.classList.remove("scene-from-right")
                researchTextRef.current.classList.remove("hidden")
                researchTextRef.current.classList.add("text-crash-in-panel")
                setCurrentAnimation(4)
                break;
            case 4:
                researchTextRef.current.classList.remove("text-crash-in-panel")
                researchSceneRef.current.classList.remove("scene-from-right")
                researchTextRef.current.classList.add("rotate-out-text")
                
                setCurrentAnimation(5)
                break;
            case 5:
                researchTextRef.current.classList.remove("rotate-out-text")
                researchTextRef.current.classList.add('hidden')
                researchSceneRef.current.classList.add("image-spiral-out")
                setCurrentAnimation(6)
                break;
            case 6:
                researchSceneRef.current.classList.remove("image-spiral-out")
                researchSceneRef.current.classList.add('hidden')
                escapeSceneRef.current.classList.remove('hidden')
                escapeSceneRef.current.classList.add('top-to-bot')
                setCurrentAnimation(7)
                break;
            case 7:
                escapeSceneRef.current.classList.remove('top-to-bot')
                escapeTextRef.current.classList.remove("hidden")
                escapeTextRef.current.classList.add('from-side')
                escapeTextRef.current.classList.add('rotated-90-x')
                setCurrentAnimation(8)
                break;
            case 8:
                escapeTextRef.current.classList.remove('from-side')
                escapeTextRef.current.classList.remove('rotated-90-x')
                escapeTextRef.current.classList.add('disapear-escape-text')
                setCurrentAnimation(9)
                break;
            case 9:
                    escapeTextRef.current.classList.add('hidden')
                    escapeTextRef.current.classList.remove('disapear-escape-text')
                    escapeSceneRef.current.classList.add('mid-to-bot')
                    setCurrentAnimation(10)
                    break;
            case 10:
                escapeSceneRef.current.classList.add('hidden')
                indiceSceneRef.current.classList.add("fade-in")
                escapeSceneRef.current.classList.remove('mid-to-bot')
                indiceSceneRef.current.classList.remove('hidden')
                setCurrentAnimation(11)
                break;
            case 11:
                indiceSceneRef.current.classList.remove("fade-in")
                indiceTextRef.current.classList.remove("hidden")
                indiceTextRef.current.classList.add("text-netflix-in")
                setCurrentAnimation(0)
                break;

        }
      };

    useEffect(()=>{
        const observer = new IntersectionObserver((entries)=> {
            const entry = entries[0];
            if(entry.isIntersecting) {
                setCurrentAnimation(0)
                resetAnimationsToBase()
            }
        })
        observer.observe(scoreboardRef.current!)
    },[])

    const getCurrentScoreboard = (): Leaderboard[] => {
        const scoreboard: Leaderboard[] = []
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
                                <div className={(currentScoreboard === 0? "active" : "") + " cursor-pointer"} onClick={() => changeCurrentScoreboard(0)} ref={everScoreboardRef}>
                                    <p>Tout</p>
                                </div>
                                <div className={(currentScoreboard === 1? "active" : "") + " cursor-pointer"} onClick={() => changeCurrentScoreboard(1)} ref={monthScoreboardRef}>
                                    <p>Mois</p>
                                </div>
                                <div className={(currentScoreboard === 2? "active" : "") + " cursor-pointer"} onClick={() => changeCurrentScoreboard(2)} ref={weekScoreboardRef}>
                                    <p>Semaine</p>
                                </div>
                            </div>
                            <div className="border-2 border-neutral-300 pt-1 rounded-xl">
                                <div className="grid md:grid-cols-4 grid-cols-3 gap-4 px-4 
                                md:text-lg font-semibold">
                                    <p className="md:col-span-2 truncate">Joueur</p>
                                    <p>Temps</p>
                                    <p>Score</p>
                                </div>
                                {
                                    getCurrentScoreboard().map((element, i) => (
                                        <React.Fragment key={i}>
                                            <div className="border-t-2 border-neutral-300 w-full self-center" />
                                            <div className="px-4 md:text-base text-sm">
                                                <div className="grid md:grid-cols-4 grid-cols-3 gap-4 pt-2 pb-0.5">
                                                    {
                                                    element ?
                                                        <>
                                                            <p className="md:col-span-2 truncate">{element.name}</p>
                                                            <p>{format(element.time, 'HH:mm:ss')}</p>
                                                            <p>{element.score}</p>
                                                        </>

                                                        : 

                                                        <>
                                                            <p className="md:col-span-2 truncate text-neutral-400">------</p>
                                                            <p className="text-neutral-400">--:--:--</p>
                                                            <p className="text-neutral-400">--</p>
                                                        </>
                                                    }
                                                </div>
                                            </div>
                                        </React.Fragment>
                                    ))
                                }
                            </div>
                        </div>
                    </div>

                    <div id='illustrations' className="relative md:col-span-1 col-span-full">
                        <div className="text-illustration">
                            <h3 className="text-animated text-netflix-in"
                            onAnimationEnd={handleAnimationEnd}
                            ref={indiceTextRef}>
                                Trouvez des indices
                            </h3>

                            <h3 className="text-animated hidden"
                            onAnimationEnd={handleAnimationEnd}
                            ref={researchTextRef}>
                                Résolvez les énigmes
                            </h3>

                            <h3 className="text-animated hidden"
                            onAnimationEnd={handleAnimationEnd}
                            ref={escapeTextRef}>
                                Etablissez des records
                            </h3>
                        </div>

                        <div className="flex items-center justify-center blob-wrapper">
                            <div className="blob-images relative w-fit">
                                <div ref={indiceSceneRef} className="w-[300px] h-[300px] relative"
                                onAnimationEnd={handleAnimationEnd}>
                                    <img src="/Plants.svg" className="w-full blob-bg-plants"/>
                                    <img src="/standing-3.svg" className="left-[30px] top-[126px] human-right"/>
                                    <img src="/standing-8.svg" className="left-[165px] top-[126px] human-left"/>
                                    <img src="/standing-12.svg" className="left-[95px] top-[126px] human-left"/>
                                </div>

                                <div ref={researchSceneRef} className="hidden w-[300px] h-[300px] relative"
                                onAnimationEnd={handleAnimationEnd}>
                                    <img src="/Whiteboard.svg" className="w-full blob-bg-clues"/>
                                    <img src="/standing-19.svg" className="left-[40px] top-[120px] human-right"/>
                                    <img src="/sitting-2.svg" className="left-[130px] top-[150px] human-right"/>
                                </div>

                                <div ref={escapeSceneRef} className="hidden w-[300px] h-[300px] relative"
                                onAnimationEnd={handleAnimationEnd}>
                                    <img src="/Wireframe.svg" className="w-full blob-bg-clues"/>
                                    <img src="/standing-9.svg" className="left-[65px] top-[130px] human-right"/>
                                    <img src="/sitting-7.svg" className="left-[130px] top-[150px] human-right"/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <svg xmlns="http://www.w3.org/2000/svg" width="0" height="0" className="absolute">
                <defs>
                    <clipPath id="svg-clip">
                        <path className="blob-to-clip"
                        fill="#474bff" d="M393,308.5Q319,377,238,380.5Q157,384,114,312Q71,240,102,147Q133,54,230.5,71Q328,88,397.5,164Q467,240,393,308.5Z" />
                    </clipPath>
                </defs>
            </svg>
        </>
    )
}