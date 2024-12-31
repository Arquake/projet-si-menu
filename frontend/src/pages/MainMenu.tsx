import Hero from "../components/HomePage/Hero";
import Scoreboard from "../components/HomePage/Scoreboard";



export default function MainMenu() {

    return (
        <>
            <main className="bg-neutral-50 flex flex-col items-center justify-center">
                <Hero />
                <Scoreboard />
            </main>
        </>
    )
}