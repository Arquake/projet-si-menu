import "./../../styles/scoreboard.css"
import {useRef, useState} from 'react'

export default function Scoreboard () {

    const [currentAnimation, setCurrentAnimation] = useState(0)

    const indiceTextRef = useRef(null);
    const indiceSceneRef = useRef(null);

    const researchTextRef = useRef(null);
    const researchSceneRef = useRef(null);

    const handleAnimationEnd = () => {
        if (indiceTextRef.current) {
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
                default:
                    researchTextRef.current.classList.remove("hidden")
                    researchTextRef.current.classList.add("text-crash-in-panel")
                    break;
            }
        }
        
      };
    return (
        <>
            <div className="w-full py-8 flex items-center justify-center bg-blue-600">
                <div className="container grid grid-cols-2 gap-16">
                    <div id="scoreboard">
                        <div className="bg-neutral-100 p-1">

                        </div>
                    </div>

                    <div id='illustrations' className="relative">
                    <h3 className="absolute top-8 text-neutral-50 text-4xl
                        text-center w-full font-semibold tracking-tight
                        text-netflix-in"
                        onAnimationEnd={handleAnimationEnd}
                        ref={indiceTextRef}>
                            Trouvez des indices
                        </h3>

                        <h3 className="absolute top-8 text-neutral-50 text-4xl
                        text-center w-full font-semibold tracking-tight
                        hidden"
                        onAnimationEnd={handleAnimationEnd}
                        ref={researchTextRef}>
                            Résolvez les énigmes
                        </h3>

                        <div className="blob-images relative">
                            <div ref={indiceSceneRef} className=""
                            onAnimationEnd={handleAnimationEnd}>
                                <img src="/Plants.svg" className="w-full blob-bg"/>
                                <img src="/standing-3.svg" className="-left-4 top-1 human-right"/>
                                <img src="/standing-8.svg" className="left-36 top-1 human-left"/>
                                <img src="/standing-12.svg" className="left-16 top-1 human-left"/>
                            </div>

                            <div ref={researchSceneRef} className="hidden"
                            onAnimationEnd={handleAnimationEnd}>
                                <img src="/Whiteboard.svg" className="w-full blob-bg"/>
                                <img src="/standing-19.svg" className="-left-2 top-1 human-right"/>
                                <img src="/sitting-2.svg" className="left-28 top-16 human-right"/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <svg xmlns="http://www.w3.org/2000/svg" width="0" height="0" className="absolute">
                <defs>
                    <clipPath id="svg-clip">
                        <path className="scale-75"
                        fill="#474bff" d="M393,308.5Q319,377,238,380.5Q157,384,114,312Q71,240,102,147Q133,54,230.5,71Q328,88,397.5,164Q467,240,393,308.5Z" />
                    </clipPath>
                </defs>
            </svg>
        </>
    )
}