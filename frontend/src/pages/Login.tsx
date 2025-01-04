import {ChangeEvent, FormEvent, useState} from "react";
import {useAuth} from "../useHook/useAuth.ts";
import loginBg from '../assets/login-bg-2.svg'
import "../styles/login.css";
import eye from "/app/src/assets/eye.svg"
import eyeCross from "/app/src/assets/cross-eye.svg"
import { useRouting } from "../useHook/useRouting.ts";

export function Login() {

    const {login, register} = useAuth();

    const {toMainMenu} = useRouting();

    const [onLogin, setOnlogin] = useState(true);
    const handleLoginChange = () => {
        setOnlogin(!onLogin);
        setPasswordShow(false)
        if (onLogin) {
            setRegisterEmailValidity(true);
            setRegisterEmail("");
            setRegisterPasswordValidity(true);
            setRegisterPassword("");
            setRegisterUsernameValidity(true);
            setRegisterUsername("");
            setRegisterError(false);
        }
        else {
            setLoginError(false);
            setLoginEmailValidity(true);
            setLoginEmail("");
            setLoginPasswordValidity(true);
            setLoginPassword("");
        }
    }

    const [passwordShow, setPasswordShow] = useState(false)
    const handlePasswordShowChange = () => {
        setPasswordShow(!passwordShow);
    }

    const [loginError, setLoginError] = useState(false)
    const [loginEmailValidity, setLoginEmailValidity] = useState(true);
    const [loginEmail, setLoginEmail] = useState("");
    const [loginPasswordValidity, setLoginPasswordValidity] = useState(true);
    const [loginPassword, setLoginPassword] = useState("");

    /**
     * vérifie à chaque carractère tapé la validité de la chaine de caractère pour qu'elle corresponde à un email
     * @param event l'evènement pour en récupérer sa valeur
     */
    const handleLoginEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
        setLoginEmail(event.target.value)
        if ((/^[\w\-\.]+@(?:[\w-]+\.)+[\w-]{2,4}$/).test(event.target.value)) {setLoginEmailValidity(true)}
        else {setLoginEmailValidity(false)}
        if(loginError){setLoginError(false)}
    }

    /**
     * vérifie à chaque carractère tapé la validité de la chaine de caractère pour qu'elle corresponde à un mot de passe
     * @param event l'evènement pour en récupérer sa valeur
     */
    const handleLoginPasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
        setLoginPassword(event.target.value)
        if ((/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{10,32}$/).test(event.target.value)) {setLoginPasswordValidity(true)}
        else {setLoginPasswordValidity(false)}
        if(loginError){setLoginError(false)}
    }

    /**
     * vérifie les champs et essaie d'établir une connexion avec le serveur
     * @param e le form event
     */
    const handleSubmitLogin = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        const email = data.get('email')!.toString();
        const password = data.get('password')!.toString();

        if (loginEmailValidity && loginPasswordValidity && !loginError) {
            login(
                email,
                password,
            )
            .then((data)=>{
                if (!data) {
                    setLoginError(true)
                } else {
                    toMainMenu()
                }
            })
        }
        else {
            setLoginError(true)
        }
    };


    const [registerError, setRegisterError] = useState(false);
    const [registerEmailValidity, setRegisterEmailValidity] = useState(true);
    const [registerEmail, setRegisterEmail] = useState("");
    const [registerPasswordValidity, setRegisterPasswordValidity] = useState(true);
    const [registerPassword, setRegisterPassword] = useState("");
    const [registerUsernameValidity ,setRegisterUsernameValidity] = useState(true);
    const [registerUsername, setRegisterUsername] = useState("");

    const handleRegisterUsernameChange = (event: ChangeEvent<HTMLInputElement>) => {
        setRegisterUsername(event.target.value)
        if ((/^[\w]{4,32}$/).test(event.target.value)) {setRegisterUsernameValidity(true)}
        else {setRegisterUsernameValidity(false)}
        if (registerError) {setRegisterError(false);}
    }

    const handleRegisterPasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
        setRegisterPassword(event.target.value)
        if ((/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{10,32}$/).test(event.target.value)) {setRegisterPasswordValidity(true)}
        else {setRegisterPasswordValidity(false)}
        if (registerError) {setRegisterError(false);}
    }

    const handleRegisterEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
        setRegisterEmail(event.target.value)
        if ((/^[\w\-\.]+@(?:[\w-]+\.)+[\w-]{2,4}$/).test(event.target.value)) {setRegisterEmailValidity(true)}
        else {setRegisterEmailValidity(false)}
        if (registerError) {setRegisterError(false);}
    }

    const handleSubmitRegister = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        
        if (registerEmailValidity && registerPasswordValidity && registerUsernameValidity) {
            register(
                data.get('email')!.toString(),
                data.get('username')!.toString(),
                data.get('password')!.toString(),
            )
            .then((data)=>{
                if (data !== true) {
                    setRegisterError(true);
                } else {
                    toMainMenu()
                }
            })
        }
    };

    return (
        <>
            <div style={{backgroundImage: `url(${loginBg})`, backgroundSize: 'cover'}} className="h-screen w-full">
                <div className="flex w-full p-8 gap-16 items-center justify-center h-screen relative">
                    <div className={`form ${onLogin?"":"login-to-left"}`}>
                        <img src="creacosm_logo.png" className="h-12 w-12 mx-auto"/>
                        <legend className="text-center text-3xl font-semibold">Connexion</legend>
                        <p className={`text-red-600 text-center ${loginError? "inline":"hidden"}`}>
                            Email ou mot de passe invalide
                        </p>
                        <form onSubmit={handleSubmitLogin} className="login-form">
                            <div>
                                <label htmlFor="email">Email</label>
                                <input type="text" id="email" placeholder="Email" required={true} 
                                className={`${loginEmailValidity && !loginError? "border-transparent":"error-input"} duration-300`} name="email" value={loginEmail} onChange={handleLoginEmailChange}/>
                            </div>
                            
                            <div>
                                <label htmlFor="password">Mot de passe</label>
                                <div className="flex justify-center items-center gap-2">
                                    <input type={passwordShow?"text":"password"} id="password" placeholder="Mot de passe" required={true} name="password" 
                                    className={`${loginPasswordValidity && !loginError? "border-transparent":"error-input"} duration-300 input-form flex-1`} value={loginPassword} onChange={handleLoginPasswordChange}/>

                                    <img src={passwordShow? eye:eyeCross} className="w-6 h-6 cursor-pointer" onClick={handlePasswordShowChange}/>
                                </div>
                            </div>
                            <button type="submit" className="login-submit-btn">Se connecter</button>
                        </form>
                        <p className="text-center" onClick={handleLoginChange}>
                            Vous n'avez pas encore de compte? <span className="text-blue-600 underline cursor-pointer">Créez en un!</span>
                        </p>
                    </div>

                    <div className={`form ${onLogin?"register-to-right":""}`}>
                        <img src="creacosm_logo.png" className="h-12 w-12 mx-auto"/>
                        <legend className="text-center text-2xl font-semibold">Créer un compte</legend>
                        <p className={`text-red-600 text-center ${registerError? "inline":"hidden"}`}>
                            Le nom d'utilisateur ou email est déjà utilisé
                        </p>
                        <form onSubmit={handleSubmitRegister} className="login-form">
                            <div>
                                <label htmlFor="username">Pseudo</label>
                                <input type="text" id="username" placeholder="Pseudo" required={true} name="username"
                                className={`${registerUsernameValidity && !registerError? "border-transparent":"error-input"} duration-300`} value={registerUsername} onChange={handleRegisterUsernameChange}/>
                            </div>
                            <div>
                                <label htmlFor="email">Email</label>
                                <input type="text" id="email" placeholder="Email" required={true} name="email"
                                className={`${registerEmailValidity && !registerError? "border-transparent":"error-input"} duration-300`} value={registerEmail} onChange={handleRegisterEmailChange}/>
                            </div>
                            <div>
                                <label htmlFor="password">Mot de passe</label>
                                <div className="flex justify-center items-center gap-2">
                                    <input type={passwordShow?"text":"password"} id="password" placeholder="Mot de passe" required={true} name="password"
                                    className={`${registerPasswordValidity && !registerError? "border-transparent":"error-input"} duration-300 input-form flex-1`} value={registerPassword} onChange={handleRegisterPasswordChange}/>
                                    <img src={passwordShow? eye:eyeCross} className="w-6 h-6 cursor-pointer" onClick={handlePasswordShowChange}/>
                                </div>

                                <ul className="password-check-list pt-2 space-y-1">
                                    <li className={`${registerPassword.length>=10? "text-green-500":"text-red-600"}`}>
                                        {getCross(registerPassword.length>=10)}
                                        <p>Au moins 10 caractère de long</p>
                                    </li>
                                    <li className={`${(/[a-z]/).test(registerPassword)? "text-green-500":"text-red-600"}`}>
                                        {getCross((/[a-z]/).test(registerPassword))}
                                        <p>Au moins une minuscule</p>
                                    </li>
                                    <li className={`${(/[A-Z]/).test(registerPassword)? "text-green-500":"text-red-600"}`}>
                                        {getCross((/[A-Z]/).test(registerPassword))}
                                        <p>Au moins une majuscule A-{">"}Z</p>
                                    </li>
                                    <li className={`${(/[@$!%*?&]/).test(registerPassword)? "text-green-500":"text-red-600"}`}>
                                        {getCross((/[@$!%*?&]/).test(registerPassword))}
                                        <p>Au moins un caractère spécial @$!%*?&</p>
                                    </li>
                                    <li className={`${(/[1-9]/).test(registerPassword)? "text-green-500":"text-red-600"}`}>
                                        {getCross((/[1-9]/).test(registerPassword))}
                                        <p>Au moins un chiffre</p>
                                    </li>
                                </ul>
                            </div>
                            <button type="submit" className="login-submit-btn">Créer</button>
                        </form>
                        <p className="text-center" onClick={handleLoginChange}>
                            Vous avez déjà un compte? <span className="text-blue-600 underline cursor-pointer">Connectez vous!</span>
                        </p>
                    </div>
                </div>
            </div>
        </>

    )
}


function getCross(isValid: boolean) {
    return (
        <>
            {
                isValid?
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M20 12a8 8 0 0 1-8 8a8 8 0 0 1-8-8a8 8 0 0 1 8-8c.76 0 1.5.11 2.2.31l1.57-1.57A9.8 9.8 0 0 0 12 2A10 10 0 0 0 2 12a10 10 0 0 0 10 10a10 10 0 0 0 10-10M7.91 10.08L6.5 11.5L11 16L21 6l-1.41-1.42L11 13.17z"/>
                </svg>
                :
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M12 20c-4.41 0-8-3.59-8-8s3.59-8 8-8s8 3.59 8 8s-3.59 8-8 8m0-18C6.47 2 2 6.47 2 12s4.47 10 10 10s10-4.47 10-10S17.53 2 12 2m2.59 6L12 10.59L9.41 8L8 9.41L10.59 12L8 14.59L9.41 16L12 13.41L14.59 16L16 14.59L13.41 12L16 9.41z"/>
                </svg>
            }
        </>
    )
}