CREATE EXTENSION IF NOT EXISTS "uuid-ossp";


-------------------------------------- TABLE CREATION --------------------------------------


-- Drop Niveau 2 --



DROP TABLE IF EXISTS Tokens, OngoingGames, FinishedGames;



-- Drop Niveau 1 --



DROP TABLE IF EXISTS Users, Projects;



-- Creation table niveau 1 --



CREATE TABLE Users (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    username VARCHAR(32) UNIQUE NOT NULL CHECK (username ~ '^[\w]{4,32}$'),
    email VARCHAR(256) UNIQUE NOT NULL CHECK (email ~ '^[\w\-\.]+@(?:[\w-]+\.)+[\w-]{2,4}$'),
    password VARCHAR(256) NOT NULL
);


CREATE TABLE Projects (
    id SERIAL PRIMARY KEY,
    placement VARCHAR(255) UNIQUE NOT NULL,
    "order" INTEGER UNIQUE NOT NULL CHECK ("order" BETWEEN 1 AND 99),
    url VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) UNIQUE NOT NULL,
    description TEXT NOT NULL,
    authors VARCHAR(255)[] NOT NULL,
    privateKey VARCHAR(255) UNIQUE NOT NULL
);



-- Creation table niveau 2 --



CREATE TABLE Tokens (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    createdAt TIMESTAMP DEFAULT now() NOT NULL,
    userUid UUID NOT NULL,
    CONSTRAINT fk_user FOREIGN KEY (userUid)
        REFERENCES users(id) ON DELETE CASCADE
);


CREATE TABLE OngoingGames (
    id INTEGER PRIMARY KEY,
    currentStage INTEGER NOT NULL,
    startedAt TIMESTAMP DEFAULT now() NOT NULL,
    userId UUID UNIQUE NOT NULL,
    score INTEGER CHECK(score >= 0) NOT NULL,
    completedStages BOOLEAN[] NOT NULL,
    CONSTRAINT fk_user FOREIGN KEY (userId)
        REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_currentStage FOREIGN KEY (currentStage)
        REFERENCES projects("order")
);

CREATE OR REPLACE FUNCTION generate_ongoing_game_id() RETURNS INTEGER AS $$
DECLARE
    new_id INTEGER;
BEGIN
    LOOP
        new_id := FLOOR(100000 + (RANDOM() * 900000))::INTEGER;

        IF NOT EXISTS (SELECT 1 FROM OngoingGames WHERE id = new_id) THEN
            RETURN new_id;  
        END IF;

    END LOOP;
END;
$$ LANGUAGE plpgsql;


-- Alter the table to use the new function for the default value of id
ALTER TABLE OngoingGames ALTER COLUMN id SET DEFAULT generate_ongoing_game_id();



CREATE TABLE FinishedGames (
    id SERIAL PRIMARY KEY,
    userId UUID NOT NULL,
    registeredAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    timeSpentSeconds INT NOT NULL,
    stage INT NOT NULL,
    score INT CHECK (score >= 0) NOT NULL,
    finished BOOLEAN NOT NULL,
    completedStages BOOLEAN[] NOT NULL,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (stage) REFERENCES projects("order")
);



-------------------------------------- INSERTS --------------------------------------



-- Ajout d'utilisateurs

INSERT INTO Users (id, username, email, password) 
VALUES 
    -- motDEPASSE1@
    ('25bf73b2-ce07-424b-b8b1-715d053353c2', 'Michael', 'michael@gmail.com', '$argon2id$v=19$m=65536,t=3,p=4$l7IvthrAG9BRgacumpvGpA$T/RZw+wNWbTDLlBjD2nwa+8qaPX38zA27OnbO0QxXoM'),
    -- motDEPASSE2@
    ('7a034517-f694-477e-9a83-74f18911bac3', 'Dany', 'dany@gmail.com', '$argon2id$v=19$m=65536,t=3,p=4$d7tCgHpfQ++El+2W9mtZUw$DaUmvU2QiSoLamzWFqG9C6+oV2/LvybLCnCjJgN2+qk'),
    -- motDEPASSE3@
    ('b423d376-26be-4069-ba6f-8bf1c31ba2f6', 'DanDan', 'dan@gmail.com', '$argon2id$v=19$m=65536,t=3,p=4$gJ0WbalPDK1bJdWhuo4kBQ$kUdYO9MNQPA47S4nNUxXImdYTVzAqJlvEVywhLNWZUk');


-- Ajout de token d'utilisateurs

INSERT INTO Tokens (id, createdAt, userUid) 
VALUES 
  ('b871f0b4-6a3e-40bd-9c26-c02ccbbf026f', '2024-12-29 16:45:29.233', '7a034517-f694-477e-9a83-74f18911bac3'),
  ('ca0c1446-0d29-4ad6-819e-eec7e1c16fc9', '2024-12-29 16:21:27.304', 'b423d376-26be-4069-ba6f-8bf1c31ba2f6'),
  ('d0078270-8488-4435-ae15-98907440a267', '2024-12-29 16:36:27.129', '25bf73b2-ce07-424b-b8b1-715d053353c2'),
  ('e1f06ed5-cda9-47b0-92b7-3abe824d4a7d', '2024-12-29 16:37:08.02', '25bf73b2-ce07-424b-b8b1-715d053353c2');


-- Ajout des projets

INSERT INTO Projects (placement, "order", url, name, description, authors, privateKey) 
VALUES 
  ('salle 1', 1, 'https://google.fr', 'test 1', 'desc 1', '{ADJAS HICHAM, AFKIR AYOUB, BENABIDI MOHAMED-ANAS, BIYIHA BIKONDI EMERIC}', 'pk'),
  ('salle 2', 2, 'https://example.com', 'test 2', 'desc 2', '{AHAMAT MOUSSA ABDELKERIM, EL BUSHABATI REDWAN, IBRAHIM ELMI KENEDID, MOHAMAD ALI}', 'pk2'),
  ('salle 3', 3, 'https://yahoo.com', 'test 3', 'desc 3', '{BARHOUMI YUSRA, BELBAZ BELKAIS MELINA, BEN ABDALLAH WALA, EL BELAIZI CHAIMAE}', 'pk3'),
  ('salle 4', 4, 'https://bing.com', 'test 4', 'desc 4', '{BOUDIAF MOHAMMED ACHRAF, BRUMAIRE QUENTIN, CRESPEAU BENJAMIN, GOUASMI YASSINE ABDENNOUR}', 'pk4'),
  ('salle 5', 5, 'https://duckduckgo.com', 'test 5', 'desc 5', '{ABHARI NISRINE, DEMARET SULLIVAN, FOUCHER THOMAS, SUKIENNIK ZINEB}', 'pk5'),
  ('salle 6', 6, 'https://store.steampowered.com/', 'test 6', 'desc 6', '{DIAGNE BAYE CHEIKH, DINCER TAYYIB, GUEYE BINTA, POUYE ABDOUL AZIZ}', 'pk6'),
  ('salle 7', 7, 'https://youtube.com', 'test 7', 'desc 7', '{BEE THIBAULT, GASSE MATIS, LECLERC GALLOIS THEO, PEREZ BENJAMIN}', 'pk7'),
  ('salle 8', 8, 'https://facebook.com', 'test 8', 'desc 8', '{EL MADANI AMINA, MANAR NADA, OKBA SALMA}', 'pk8'),
  ('salle 9', 9, 'https://twitter.com', 'test 9', 'desc 9', '{BELKADI ASMAA, ECHCHATBI HASNAA, HABBAK YASMINE, MAZLANI DOHA}', 'pk9'),
  ('salle 10', 10, 'https://instagram.com', 'test 10', 'desc 10', '{BAZHAR AMAL, MAZER HIBAT ALLAH, METROUH NINA, ZENASNI AMINA}', 'pk10'),
  ('salle 11', 11, 'https://linkedin.com', 'test 11', 'desc 11', '{DRAILY ESTEBAN, GOMADO KOFFI HILD, GONNET VINCENT, GOUDAL ARTHUR}', 'pk11'),
  ('salle 12', 12, 'https://reddit.com', 'test 12', 'desc 12', '{NADOT ANTONY, NDJABENGUE DOUMBENENYDAVID GEOFRET, PEREZ ENZO, PETEL ROMAIN}', 'pk12'),
  ('salle 13', 13, 'https://tiktok.com', 'test 13', 'desc 13', '{BABA AHMET, FOFANA ABDOULAHI, HANI SELIM, MAOULANA FAYAD}', 'pk13');


-- Ajout de parties finies

INSERT INTO FinishedGames (id, userId, registeredAt, timeSpentSeconds, stage, score, finished, completedStages) 
VALUES 
  (1, 'b423d376-26be-4069-ba6f-8bf1c31ba2f6', '2024-12-29 16:23:23.241', 2337, 1, 9480, true, '{t, t, t, f, f, f, f, t, f, f, f, f, t}'),
  (2, '25bf73b2-ce07-424b-b8b1-715d053353c2', '2024-12-29 16:39:30.438', 3164, 1, 14470, false, '{t, f, f, t, t, t, t, f, t, f, t, t, f }'),
  (3, '25bf73b2-ce07-424b-b8b1-715d053353c2', '2024-12-29 16:45:15.6', 3320, 1, 7700, true, '{t, f, f, f, f, t, f, f, t, f, t, t, t}'),
  (4, '7a034517-f694-477e-9a83-74f18911bac3', '2024-12-29 16:45:36.275', 2736, 1, 12490, true, '{t, t, t, f, f, t, f, f, t, f, t, t, t}');


-- Ajout de parties en cours

INSERT INTO OngoingGames (id, currentStage, startedAt, userId, score, completedStages) 
VALUES 
  (generate_ongoing_game_id(), 1, '2024-12-29 16:45:00', '25bf73b2-ce07-424b-b8b1-715d053353c2', 0, '{f, f, f, f, f, f, f, f, f, f, f, f, f}'),
  (generate_ongoing_game_id(), 6, '2024-12-29 16:55:00', 'b423d376-26be-4069-ba6f-8bf1c31ba2f6', 8760, '{t, f, t, t, t, f, f, f, f, f, f, f, f}'),
  (generate_ongoing_game_id(), 12, '2024-12-29 17:05:00', '7a034517-f694-477e-9a83-74f18911bac3', 23460, '{t, t, t, t, t, t, t, t, t, t, t, t, f}');



-------------------------------------- REQUESTS --------------------------------------


-- Regroupe les parties en cours par stage puis leur date de début, leur id et enfin leur score
-- Et ensuite les tris de façon ascendante par leur date de début
--
-- permet de récupérer les partie en cours et en attente au tout début du lancement du serveur si certaines n'étaient pas fini

SELECT currentStage, startedAt, id, score, MIN(startedAt) AS min_startedAt
FROM OngoingGames
GROUP BY currentStage, startedAt, id, score
ORDER BY min_startedAt ASC;


-- Met à jour le score de la partie en cours avec l'id ":codeId"
-- et lui ajoute à son score existant ":scoreToAdd" de score

UPDATE OngoingGames
SET score = score + :scoreToAdd
WHERE id = :codeId;


-- Met à jour l'étape actuelle de la partie en cours et les stages complétés pour la partie avec l'id ":gameId"

UPDATE ongoing_games
SET 
    currentStage = currentStage + 1,
    completedStages = :completedStages
WHERE id = :gameId;


-- Retourne le projet qui prend place après celui à la place ":currentGameOrder"
-- Limit 1 pour s'assurer qu'une seule ligne est retourné

SELECT *
FROM projects
WHERE "order" = :currentGameOrder + 1
LIMIT 1;


-- Retourne les 5 meilleurs score de tout les temps fait sur des parties terminées

SELECT *
FROM FinishedGames
ORDER BY score DESC
LIMIT 5;


-- Pareil que celle au-dessus mais pour la semaine passée

SELECT *
FROM FinishedGames
WHERE registeredAt >= NOW() - INTERVAL '7 days'
ORDER BY score DESC
LIMIT 5;
