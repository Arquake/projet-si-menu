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

          <footer className="w-full bg-neutral-100 flex-initial px-8 py-4 grid grid-cols-2 gap-2 md:text-base sm:text-sm text-xs">
            <div className="flex flex-col">
              <p>Contactez-nous:</p>
              <a href="tel:+33238567811" className="text-blue-400 underline">
                +33 02.38.56.78.11
              </a>
              <a href="mailto:cosmetosciences@univ-orleans.fr" className="text-blue-400 underline">
                cosmetosciences@univ-orleans.fr
              </a>
            </div>
            <div className="flex flex-col justify-self-end">
              <p>Bâtiment de Physique Chimie</p>
              <p>Porte 228</p>
              <p>Rue de Chartres - BP 6749</p>
              <p>45067 ORLEANS CEDEX 2</p>
            </div>
          </footer>
        </div>
    </>
  )
}