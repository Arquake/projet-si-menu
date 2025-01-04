import Hero from "../components/HomePage/Hero";
import Scoreboard from "../components/HomePage/ScoreboardHomePage";
import About from "./About";



export default function MainMenu() {

    return (
        <>
            <main className="flex flex-col items-center justify-center">
                <Hero />
                <Scoreboard />
                <About />
            </main>
        </>
    )
}