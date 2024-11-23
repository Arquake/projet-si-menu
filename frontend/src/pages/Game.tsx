import { useEffect, useState } from "react"
import { useAuth } from "../useHook/useAuth";

interface Etape {
    jwt: string;
}

export default function Game() {

    const {makePostRequest} = useAuth();

    const [etapes, setEtapes] = useState<Etape[]>([]);

    useEffect(() => {
        const res = makePostRequest('/generate-all', localStorage.getItem('jwt') || null, {},
            (res)=>{
                console.log(res.json())
                return res.json()
            },
            (_) => {
                return makePostRequest('/refresh-jwt', localStorage.getItem('refreshToken') || null, {}, 
                    (_) => {
                        return makePostRequest('/generate-all', localStorage.getItem('jwt') || null, {},
                        (res)=>{
                            return res.json()
                        },
                        (error) => {
                            return error
                        }
                    );
                    },
                    (error) => {
                        console.log(error)
                        return error
                    }
                )
            }
        )

        res.then((result)=>setEtapes(result))
    }, []
)

    return (
        <>
            <ul className="flex flex-col gap-4">
                {etapes.map((item, index) => (
                    <li key={index}>
                        {item.jwt}
                    </li>
                ))}
            </ul>
        </>
    )
}