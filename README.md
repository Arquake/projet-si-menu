# projet-SI
## Générer les containers

<ul>
    <li>`docker-compose build`</li>
    <li>`docker-compose up -d`</li>
</ul>

## connecter la base de donnée à pgAdmin4

<ul>
    <li>Créer un nouveau <span style="color:#0ea5e9">Server Group</span></li>
    <li>Register server sur le groupe enregistré précédement
        <ul>
            <li>Dans général lui donner le nom <span style="color:#0ea5e9">menu_si_project</li>
            <li>Dans connection:
                <ul>
                    <li>Host name/adress : localhost</li>
                    <li>port : 5433</li>
                    <li>Maintenance database : menu_si_project</li>
                    <li>Username : menu_si_project</li>
                    <li>Password : menu_si_project</li>
                </ul>
            </li>
        </ul>
    </li>
</ul>

## A run dans postgres
`tables.sql`

Sans les inserts de OngoingGames, FinishedGames, Users, Tokens

Et sans les query


## A run dans express js
<code>
    npx prisma db pull
</code>

## Lien vers React
http://localhost:5173/
## Lien vers React
http://localhost:3000/


## Informations supplémentaires
Une fois les containers lancés les liens sont directement accessibles

React :
<ul>
    <li>Vite</li>
    <li>TSX</li>
    <li>Yarn</li>
    <li>version: 18.3.1</li>
    <li>Zustand</li>
</ul>

Express js :
<ul>
    <li>Node 22.8.0</li>
    <li>Vanilla js</li>
    <li>Socket.io</li>
    <li>Prisma</li>
</ul>

## Pour ajouter des dépendances
Il faut demander à tout le monde pour pouvoir modifier le docker pour les ajouter