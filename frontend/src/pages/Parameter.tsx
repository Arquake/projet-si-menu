import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useAuth } from "../useHook/useAuth";

enum ChangeChoice {
    Username,
    Email,
    Password,
    Delete
}

interface UserInfo {
    username: string,
    email: string
}

export default function Parameter() {

    const {account, makePostRequest, refreshJwt, updateUsername} = useAuth();

    const [userInfo, setUserInfo] = useState<UserInfo>();
    const [newUsername, setNewUserName] = useState<string>("");
    const [newEmail, setNewEmail] = useState<string>("");
    const [newPassword, setNewPassword] = useState<string>("");
    const [oldPassword, setOldPassword] = useState<string>("");

    const [usernameChangeError, setUsernameChangeError] = useState<boolean>(false)
    const [emailChangeError, setEmailChangeError] = useState<boolean>(false)
    const [passwordChangeError, setPasswordChangeError] = useState<boolean>(false)
    const [deleteError, setDeleteError] = useState<boolean>(false)

    const [fetchError, setFetchError] = useState<boolean>(false)

    const [popUpWindow, setPopUpWindow] = useState<boolean>(false)
    const [changeChoiceType, setChangeChoiceType] = useState<ChangeChoice|null>(null)

    const handleUpdate = (changeType: ChangeChoice) => {
        setChangeChoiceType(changeType)
        setPopUpWindow(true)
    }

    const handleClosePopUp = () => {
        setPopUpWindow(false)
        setDeleteError(false)
        setEmailChangeError(false)
        setPasswordChangeError(false)
        setUsernameChangeError(false)
        setNewUserName("")
        setNewEmail("")
        setNewPassword("")
        setOldPassword("")
    }

    useEffect(()=>{
        try {
            makePostRequest<UserInfo>('/get-personnal-info', account?.jwt)
            .then((data)=>{
                setUserInfo({...data});
            })
        }
        catch (_) {
            try {
                refreshJwt()
                makePostRequest<UserInfo>('/get-personnal-info', account?.jwt)
                .then((data)=>{
                    setUserInfo({...data});
                })
            }
            catch(_) {
                setFetchError(true)
            }
        }
    },[])


    const onSubmitChangeUsername = async (e: FormEvent) => {
        e.preventDefault()

        try {
            await makePostRequest('/change-name', account?.jwt, {"username": newUsername}, 
                (res)=>{if (!res.ok) {throw new Error('Network response was not ok');};}
            )
            updateUsername(newUsername)
            setUserInfo({...userInfo!, username: newUsername})
            handleClosePopUp()
        }
        catch (_) {
            try {
                await makePostRequest('/change-name', account?.jwt, {"username": newUsername}, 
                    (res)=>{if (!res.ok) {throw new Error('Network response was not ok');};}
                )
                updateUsername(newUsername)
                setUserInfo({...userInfo!, username: newUsername})
                handleClosePopUp()
            }
            catch (_) {
                setUsernameChangeError(true)
            }
        }
    }


    const onSubmitChangeEmail = async (e: FormEvent) => {
        e.preventDefault()

        try {
            await makePostRequest('/change-email', account?.jwt, {"email": newEmail}, 
                (res)=>{if (!res.ok) {throw new Error('Network response was not ok');};}
            )
            setUserInfo({...userInfo!, email: newEmail})
            handleClosePopUp()
        }
        catch (_) {
            try {
                await makePostRequest('/change-email', account?.jwt, {"email": newEmail}, 
                    (res)=>{if (!res.ok) {throw new Error('Network response was not ok');};}
                )
                setUserInfo({...userInfo!, email: newEmail})
                handleClosePopUp()
            }
            catch (_) {
                setUsernameChangeError(true)
            }
        }
    }

    const handleNewUsernameChange = (e: ChangeEvent<HTMLInputElement>) => {
        setNewUserName(e.target.value)
    }

    const handleNewEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
        setNewEmail(e.target.value)
    }


    const handleNewPassword = (e: ChangeEvent<HTMLInputElement>) => {
        setNewPassword(e.target.value)
    }

    const handleOldPassword = (e: ChangeEvent<HTMLInputElement>) => {
        setOldPassword(e.target.value)
    }

    return (
        <>
            <div className={`${popUpWindow? "opacity-100":"pointer-events-none opacity-0"} flex absolute h-full w-full bg-neutral-500 bg-opacity-70
            items-center justify-center z-20 duration-200`}>
                <div className="rounded-lg p-2 bg-neutral-50 shadow-md">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 15 15" className="h-5 cursor-pointer" onClick={handleClosePopUp}>
                        <path fill="currentColor" d="M3.64 2.27L7.5 6.13l3.84-3.84A.92.92 0 0 1 12 2a1 1 0 0 1 1 1a.9.9 0 0 1-.27.66L8.84 7.5l3.89 3.89A.9.9 0 0 1 13 12a1 1 0 0 1-1 1a.92.92 0 0 1-.69-.27L7.5 8.87l-3.85 3.85A.92.92 0 0 1 3 13a1 1 0 0 1-1-1a.9.9 0 0 1 .27-.66L6.16 7.5L2.27 3.61A.9.9 0 0 1 2 3a1 1 0 0 1 1-1c.24.003.47.1.64.27"/>
                    </svg>
                    <div className="pl-2">
                        {
                            changeChoiceType === ChangeChoice.Username?(
                                <>
                                    <p className="text-center text-xl px-8">Changer votre pseudo</p>
                                    {
                                        usernameChangeError && 
                                        <p className="text-red-900 border-2 border-red-500 bg-red-200
                                        py-1 px-4 rounded-lg">
                                            Veuillez rentrer un pseudo valide et non utilisé
                                            </p>
                                    }
                                    <form className="flex flex-col pt-4" onSubmit={onSubmitChangeUsername}>
                                        <label>Nouveau Pseudo :</label>
                                        <input placeholder="Nouveau pseudo" className="px-2" onChange={handleNewUsernameChange}/>
                                        <button className="bg-blue-600 hover:bg-blue-700 duration-300 text-neutral-50 rounded-lg py-1 font-semibold mt-4">Changer!</button>
                                    </form>  
                                </>
                            ): changeChoiceType === ChangeChoice.Email?(
                                <>
                                    <p className="text-center text-xl px-8">Changer votre email</p>
                                    <form className="flex flex-col pt-4" onSubmit={onSubmitChangeEmail}>
                                        <label>Nouveau email :</label>
                                        <input placeholder="Nouveau email" className="px-2" onChange={handleNewEmailChange}/>
                                        <button className="bg-blue-600 hover:bg-blue-700 duration-300 text-neutral-50 rounded-lg py-1 font-semibold mt-4">Changer!</button>
                                    </form>  
                                </>
                            ): changeChoiceType === ChangeChoice.Password?(
                                <>
                                    <p className="text-center text-xl px-8">Changer votre mot de passe</p>
                                    <form className="flex flex-col pt-4">
                                        <label>Ancien mot de passe :</label>
                                        <input placeholder="Ancien mot de passe" className="px-2" onChange={handleNewPassword}/>
                                        <label>Nouveau mot de passe :</label>
                                        <input placeholder="Nouveau mot de passe" className="px-2" onChange={handleOldPassword}/>
                                        <button className="bg-blue-600 hover:bg-blue-700 duration-300 text-neutral-50 rounded-lg py-1 font-semibold mt-4">Changer!</button>
                                    </form>  
                                </>
                            ): (
                                <>
                                    <p className="text-center text-xl px-8">Supprimer votre compte</p>
                                    <form className="flex flex-col pt-4">
                                        <label>Mot de passe :</label>
                                        <input placeholder="Mot de passe" className="px-2"/>
                                        <button className="bg-red-600 hover:bg-red-700 duration-300 text-neutral-50 rounded-lg py-1 font-semibold mt-4">Supprimer</button>
                                    </form> 
                                </>
                            )
                        }
                    </div>
                </div>
            </div>
            <div className={"flex justify-center items-center"}>
                {
                    fetchError?
                        <div className="flex flex-col gap-1 text-red-600 font-semibold text-center">
                            <p className="text-2xl">Oups !</p>
                            <p>Il semble qu'une erreur se soit produite !</p>
                            <p>Veuillez réessayer plus tard</p>
                            <img src="thinkface.svg" className="h-20"/>
                        </div>
                    :
                        <div className="px-8 pt-10 container">
                            <h1 className={"text-2xl pb-2"}>Vos informations</h1>

                            <div className="pl-4 flex flex-col gap-2">
                                <div className="flex gap-2 text-lg items-center">
                                    <p>Pseudo : {userInfo?.username}</p>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-6 text-blue-600 cursor-pointer" onClick={()=>handleUpdate(ChangeChoice.Username)}>
                                        <path fill="currentColor" fillRule="evenodd" d="M3.25 22a.75.75 0 0 1 .75-.75h16a.75.75 0 0 1 0 1.5H4a.75.75 0 0 1-.75-.75" clipRule="evenodd"/>
                                        <path fill="currentColor" d="m11.52 14.929l5.917-5.917a8.2 8.2 0 0 1-2.661-1.787a8.2 8.2 0 0 1-1.788-2.662L7.07 10.48c-.462.462-.693.692-.891.947a5.2 5.2 0 0 0-.599.969c-.139.291-.242.601-.449 1.22l-1.088 3.267a.848.848 0 0 0 1.073 1.073l3.266-1.088c.62-.207.93-.31 1.221-.45q.518-.246.969-.598c.255-.199.485-.43.947-.891m7.56-7.559a3.146 3.146 0 0 0-4.45-4.449l-.71.71l.031.09c.26.749.751 1.732 1.674 2.655A7 7 0 0 0 18.37 8.08z"/>
                                    </svg>
                                </div>
                                <div className="flex gap-2 text-lg items-center">
                                    <p>Email : {userInfo?.email}</p>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-6 text-blue-600 cursor-pointer" onClick={()=>handleUpdate(ChangeChoice.Email)}>
                                        <path fill="currentColor" fillRule="evenodd" d="M3.25 22a.75.75 0 0 1 .75-.75h16a.75.75 0 0 1 0 1.5H4a.75.75 0 0 1-.75-.75" clipRule="evenodd"/>
                                        <path fill="currentColor" d="m11.52 14.929l5.917-5.917a8.2 8.2 0 0 1-2.661-1.787a8.2 8.2 0 0 1-1.788-2.662L7.07 10.48c-.462.462-.693.692-.891.947a5.2 5.2 0 0 0-.599.969c-.139.291-.242.601-.449 1.22l-1.088 3.267a.848.848 0 0 0 1.073 1.073l3.266-1.088c.62-.207.93-.31 1.221-.45q.518-.246.969-.598c.255-.199.485-.43.947-.891m7.56-7.559a3.146 3.146 0 0 0-4.45-4.449l-.71.71l.031.09c.26.749.751 1.732 1.674 2.655A7 7 0 0 0 18.37 8.08z"/>
                                    </svg>
                                </div>
                                <div className="flex sm:flex-row flex-col gap-4 pt-2">
                                    <button className="rounded-lg bg-blue-600 text-neutral-50 px-4 py-2 font-semibold w-fit" onClick={()=>handleUpdate(ChangeChoice.Password)}>
                                        Changer votre mot de passe
                                    </button>
                                    <button className="border-2 rounded-lg text-red-600 border-red-600 px-4 py-2 font-semibold w-fit" onClick={()=>handleUpdate(ChangeChoice.Delete)}>
                                        Supprimer votre compte
                                    </button>
                                </div>
                            </div>
                        </div>
                }
            </div>
        </>
    )
}