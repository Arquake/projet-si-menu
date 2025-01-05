import NavBar from "../pages/NavBar";

interface ContainerProps {
  children: React.ReactNode;
}

export default function ContainerDiv ({children}: ContainerProps) {
  return (
    <>
      <div className="w-screen min-h-screen flex flex-col">
          <div className="flex-initial sticky top-0 z-50">
            <NavBar />
          </div>

          <div className="flex-1 cursor-default bg-neutral-50">
            {children}
          </div>

          <footer className="w-full bg-neutral-50 flex-initial px-4 py-6">
            <p>Contactez-nous</p>
          </footer>
        </div>
    </>
  )
}