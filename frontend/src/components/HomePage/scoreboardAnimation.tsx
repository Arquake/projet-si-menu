import { useEffect, useRef, useState } from "react"

type ScoreboardAnimationProps = {
    scoreboardRef: React.RefObject<HTMLDivElement>; // Specify the type of the ref
  };

export default function  ScoreboardAnimation({ scoreboardRef }: ScoreboardAnimationProps) {

    const removeAllAnimationClasses = () => {
        if (indiceTextRef.current && 
            indiceSceneRef.current && 
            researchTextRef.current && 
            researchSceneRef.current &&
            escapeSceneRef.current &&
            escapeTextRef.current) {
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
    }
        
        

    const resetAnimationsToBase = () => {
        removeAllAnimationClasses()
        if (indiceTextRef.current && 
            researchTextRef.current && 
            researchSceneRef.current &&
            escapeSceneRef.current &&
            escapeTextRef.current) {
                researchTextRef.current.classList.add('hidden')
                escapeTextRef.current.classList.add('hidden')
                researchSceneRef.current.classList.add('hidden')
                escapeSceneRef.current.classList.add('hidden')
                indiceTextRef.current.classList.add("text-netflix-in")
            }
    }

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
    return (
        <>
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