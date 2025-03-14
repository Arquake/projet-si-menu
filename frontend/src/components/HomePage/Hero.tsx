import lotion from "./../../assets/lotion.svg"
import lipstick from "./../../assets/lipstick.svg"

export default function Hero () {
    return (
        <>
            <div className="container pt-0 pb-8">
                <div className="creacosm font-light relative p-4">
                    <div className="absolute grid grid-cols-8 grid-rows-8 w-full h-full">
                        <div className="sm:space-y-1 col-span-4 col-start-2 row-start-2
                        xl:-translate-x-10 md:translate-x-0 sm:-translate-x-8 
                        md:translate-y-0 -translate-y-0 -space-y-1">
                            <div className="escape-game">
                                <p>Escape Game</p>
                                <img src={lotion} className="escape-lotion"/>
                                <img src={lipstick} className="escape-lips "/>
                            </div>
                            <p className="escape-game-bottom">
                                Par Créacosm
                            </p>
                            <p className="univ-bottom">Une marque de l'université d'Orléans</p>
                        </div>
                    </div>
                    
                    <div className="bg-polygon w-full">
                        <div className="absolute overlap-bg h-full w-full" />
                        <img src="/creacosm_picture.png" className="w-full z-0"/>
                    </div>
                </div>
            </div>
        </>
    );
}