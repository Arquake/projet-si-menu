import "/app/src/styles/notFound.css"

export default function NotFound() {
    return (
        <>
            <main className="w-full flex flex-1 items-center justify-center">
                <div className="flex-1 container flex flex-col gap-2 text-center">
                    <p className="text-2xl text-red-700 font-semibold">
                        Oups!
                    </p>
                    <p className="text-2xl text-red-700 font-semibold">
                        Il semblerait que cette page n'existe pas
                    </p>
                    <img src="sadface.svg" className="h-16"/>
                </div>
            </main>
        </>
    )
}