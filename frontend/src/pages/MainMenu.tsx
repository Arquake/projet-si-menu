export default function MainMenu() {

    return (
        <>
            <main className="flex-1 bg-gray-100 flex justify-center">
                <div className="container">
                    <div className="w-full flex justify-center py-4">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-1/3 text-emerald-500 neon-escape">
                            <path fill="currentColor" d="m13.116 14.387l-1.318-1.437l-.382 1.958q-.056.329-.346.515q-.29.187-.618.13l-2.338-.493q-.143-.05-.246-.177q-.102-.127-.052-.283q.05-.142.176-.238t.27-.046l2.41.494l1.032-5.208l-1.82.671V11.5q0 .154-.115.27q-.115.114-.269.114t-.27-.115q-.114-.115-.114-.269v-1.208q0-.264.146-.468q.146-.203.388-.29l2.664-.969q.335-.124.66.006q.324.131.48.462q.469.983 1.045 1.427t1.001.574q.154.06.27.187q.115.127.115.284t-.121.265t-.264.059q-.53-.145-1.2-.605t-1.258-1.263l-.482 2.678l1.107 1.182q.106.125.162.269t.056.297V17.5q0 .154-.116.27q-.115.114-.269.114t-.27-.115q-.114-.115-.114-.269zm.384-6.502q-.376 0-.63-.255T12.616 7t.254-.63t.63-.254t.63.254t.255.63t-.255.63t-.63.255M12.003 21q-1.866 0-3.51-.708q-1.643-.709-2.859-1.924t-1.925-2.856T3 12.003t.709-3.51Q4.417 6.85 5.63 5.634t2.857-1.925T11.997 3t3.51.709q1.643.708 2.859 1.922t1.925 2.857t.709 3.509t-.708 3.51t-1.924 2.859t-2.856 1.925t-3.509.709M12 20q3.35 0 5.675-2.325T20 12t-2.325-5.675T12 4T6.325 6.325T4 12t2.325 5.675T12 20"/>
                        </svg>
                    </div>
                    <div className="flex justify-center">
                        <div className="w-1/5 rounded-full border-2 border-emerald-500 flex justify-center py-2 px-8 cursor-pointer hover:shadow-xl duration-300" onClick={()=>{window.history.pushState({}, "", "/game")}}>
                            <p className="text-emerald-500 font-bold text-2xl">
                                Jouer
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </>
    )
}