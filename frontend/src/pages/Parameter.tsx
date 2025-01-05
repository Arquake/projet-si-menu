

export default function Parameter() {
    return (
        <>
            <div className={"flex justify-center items-center"}>
                <div className=" pt-10 container">
                    <h1 className={"text-xl pb-2"}>Vos informations</h1>

                    <form className="flex flex-col bg-gray-200 pr-1 pl-1 pt-0.5 pb-1 rounded-lg" onSubmit={(e) => {e.preventDefault();}}>
                        <label htmlFor={"username"}>Username :</label>
                        <input id={"username"} type={"text"} value={"Votre username"}
                               className={"border-2 border-solid rounded"}/>
                        <label htmlFor={"mail"}>Email :</label>
                        <input id={"mail"} type="text" value={"VOTRE_EMAIL_ICI@OUAIS_LA.VRM"}
                               className={"border-2 border-solid rounded"}/>

                        <p className={"text-lg pt-5"}>Entrer votre mot de passe pour valider les modifications</p>
                        <label htmlFor={"mail"}>Mot de passe :</label>
                        <input id={"mail"} type="text" value={""}
                               className={"border-2 border-solid rounded"}/>

                        <button type={"submit"} className={"mt-2 bg-blue-600 rounded-lg"}>Modifier</button>
                    </form>
                    <a href={"#"} className={"text-blue-600 underline"}>Vous souhaitez changer de mot de passe, cliquez ici</a>
                </div>
            </div>
        </>
    )
}