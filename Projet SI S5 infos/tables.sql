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
    email VARCHAR(256) UNIQUE NOT NULL CHECK (email ~ '^[\w\-\.]+@(?:[\w-]+\.)+[a-zA-Z]{2,63}$'),
    password VARCHAR NOT NULL
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
    -- mdp : ?U9Up&@6qWP*D0G4p6WPts9d*rScnL4jGg9/Th6Acbywy$HXAnVUT4Z5A6&-bMRboarJf+SRr-*ZAOCStpnc%$eI09P83RY@ICtyBJpAARcj*EEZ3jtc?GR-HjoX/TZtlok6*vMytYPOslMG!c56rtdo%okrABx!HEAaXRIV*$434na9nRmUWPrE@B-UA45ecsMrg%7R5605d*NuiEyi0K-!C8+p0l/Xk$d-wrg-OnopFc1eI!q4BKV@E8FNtjF%
  ('salle 1', 1, 'https://google.fr', 'test 1', 'desc 1', '{ADJAS HICHAM, AFKIR AYOUB, BENABIDI MOHAMED-ANAS, BIYIHA BIKONDI EMERIC}', '$argon2id$v=19$m=65536,t=3,p=4$XKDNeWdvLoDdAnvJ2jwumw$fnJYo6uA6KOR5wKVQTxWENXlLFfLH8ksizqt13982bc'),
  -- mdp : +Wv1*+$e8b?7-5exT%qLR?la?+Hg$vk/sp@f2qm+f&qej6qMY4Y26guJkhmBi5h@*TbSLX*J2skHl/Za?3qK&w+UFE1NVA!bvx/*t6pju7D78P*cneX27htms5ZOdyjZMKyOROxXW@qQ?1Xph!gXr$Svr3j-ayhYWsFdZn8*5VLxIbH/jraSCwgeQ-EvUESdL0k-UQIt/NmU@XF*w/xhG6UbYbZU*C598w$dFfH00-rIcomrWCWybDuXJls5/-9b
  ('salle 2', 2, 'https://example.com', 'test 2', 'desc 2', '{AHAMAT MOUSSA ABDELKERIM, EL BUSHABATI REDWAN, IBRAHIM ELMI KENEDID, MOHAMAD ALI}', '$argon2id$v=19$m=65536,t=3,p=4$B7e+U8lnj1/45zfNY1BokQ$msaiwhj1Q70mEaFmOf5gMd/4IdWaMnO8wvvYEdEyziE'),
  -- mdp : EUHt?UWDg135kc7$6mAt!e4z*TKt!aFJTucga2gCfQxd?mc*185BCu8fe4dCiIOQq%GjOhR8yG97Cq0*gwM8*BK!el*BamaD*IgBJ?L24q0K+P/Q2TV3b0E*aDL!8A-bU3V$E8M?FniV97tOXMjlt3e1Ii2Q?4HbH0*t*U$OIqU%aUxsF$?iu%n3bcHqZzP-!E*J%X*S8MCWRz1d@f+4P6&C1m1TJDyd&b5h?778m*eC$S3ly@4fDMUgJlcu7!5k
  ('salle 3', 3, 'https://yahoo.com', 'test 3', 'desc 3', '{BARHOUMI YUSRA, BELBAZ BELKAIS MELINA, BEN ABDALLAH WALA, EL BELAIZI CHAIMAE}', '$argon2id$v=19$m=65536,t=3,p=4$3Lq7p7PR6Spm73+WuBFt6w$0uWd7uEHaQRAgS+Hf+AAn9poAV8+Ymp4BR6jVeW+JGE'),
  -- mdp : 87b/YSO+1+%NxQ*PHBoKKwZ9?HcgJaYRwpwh!T/vf4i*@cclyd9LI7x*EuS@l2ZKUk/zccn&clEJXjBg2iTyQGh015Z6QuktDt&bwjqDLZrgxi/Glje5U/O3+Iiusv1@V%H6Qx42Atr-3yTBcCbkiNt!%kR9g!K45i+Y7Uliltl6h4i$jGGjCyGRYHCAK@UcMyuL4Cri/0@1C5Eeq4m5LF8cf$%+puqohdP1EE2I6M5&jQkx-+NkdYQ+OoGygte8
  ('salle 4', 4, 'https://bing.com', 'test 4', 'desc 4', '{BOUDIAF MOHAMMED ACHRAF, BRUMAIRE QUENTIN, CRESPEAU BENJAMIN, GOUASMI YASSINE ABDENNOUR}', '$argon2id$v=19$m=65536,t=3,p=4$r9paKuRlPoyP7D1CM4xCWg$0p86Hcz+cUrRvbH5vLTN+cKQxuS3wE8RyulIk8L7yBc'),
  -- mdp : v!%UMiVFWtWqnawVUBOW*HMYMMf%-1VMb+hBU!n46tox&wed%O+!mCI5LnUVRigWsFYYYvKPrmpTa2!YcqOYu0+YK3pg4pgkUBqJFsvS-SKpXjlk%nMI-9k7E!lsb-9&*mb6nlz/FxQGeAy*F+$n$wI23-nf1BLKHbmD!QsmAs3fR!Ftu5tdPNcbC05Q+u37Jjk?cS!@pABy$*SIm*%*UL4tmb!qEIuud*2-R6JT+m3!n0AyC0sy/rW1+2G5oMmK
  ('salle 5', 5, 'https://duckduckgo.com', 'test 5', 'desc 5', '{ABHARI NISRINE, DEMARET SULLIVAN, FOUCHER THOMAS, SUKIENNIK ZINEB}', '$argon2id$v=19$m=65536,t=3,p=4$il3/gtHtwcyS5lNV8/bm4Q$OdwEcsoMY1ZACsB2iLKT0n8pPi31IB6CNr0zb7RPMxg'),
  -- mdp : Xp?WKlbBXFb4e5abrjYunZqGo*TUM5*XhId18ra!p0zm?PKfln!wBFjDG6EPwzbJIF*9*o41NzMFnqZ5UixLvP%$KAxi2T%r@d*fl?f?cpGpq/jgw$pd5+1N&YhlwT4NbHvWh6MiStqHjWPx7!o0rjuVLJYFX-LtAKngJUP6FEf7ZK4qG@1p@X-X*1%/eX&iRO@9WRzvTTAqI9!2tT8h--7uzp3JhQCGdopQGAojp8sIfibnAxqIVVfWjvUGaR6A
  ('salle 6', 6, 'https://store.steampowered.com/', 'test 6', 'desc 6', '{DIAGNE BAYE CHEIKH, DINCER TAYYIB, GUEYE BINTA, POUYE ABDOUL AZIZ}', '$argon2id$v=19$m=65536,t=3,p=4$9sH7SKwuX6KmFS2n1b0b+Q$1ul56BVqdr5YfgKMzC5kZ4s+st+VechdmVw/QPit5As'),
  -- mdp : fy8JF*FB9Cdc2I1l2bWucL@kV0g43z*j9DM*PGKnC8fToC7FUfn4NmbU?FPj1Tuf26&iwd+J&Fu&kLboTsPxUp4sWB+j!D*yu5u3GFA7?*8PL-hrkCOH3vkvz34M%JCEzp&0R&Zgl%C/BN@g1Zcljzv?*2sE*BYWJ*W/tM%QwaJuCqUu3!Y8SoamPAHjgokAxsyj8Fk*xU7RyPSTcSqIh*xK$FCjIvjvLrVGC5fb/oUx*0*M8BQ+!!do6eO6v/S6
  ('salle 7', 7, 'https://youtube.com', 'test 7', 'desc 7', '{BEE THIBAULT, GASSE MATIS, LECLERC GALLOIS THEO, PEREZ BENJAMIN}', '$argon2id$v=19$m=65536,t=3,p=4$T2Orr39ih2/UuBloLXJB1Q$+dzvk/UuNuA/qpHsPRaFdoe7x8mkfpWNF0NylJ0ISTU'),
  -- mdp : nz7$Xt?VpNk&-$MOu?2z*+6&xVj0vTL7qaaWOzYNeULmCP54!NOoM-?LVxXfIpae6D91J?t&a*QB-Y9IpXxd?!71bcHcLZ?jJEngG2w@/vHAkF6XUa*?rx5$D*oPe%06W8**-rX%C5JG!T9YPd48*Z-VYtfO4+KRsuHuaA7eW8/w-j95C-yMbJEF?K*w2Q7ektgylhhw9z?zlR%j?+UDsNgg/C*R6vmkJ7snkHDdYfhUATBlmmOCiGM&m4/7hF/S
  ('salle 8', 8, 'https://facebook.com', 'test 8', 'desc 8', '{EL MADANI AMINA, MANAR NADA, OKBA SALMA}', '$argon2id$v=19$m=65536,t=3,p=4$ljnl70Hlp7ZfP3BUDPX5LA$9UYTQ+EFLm4cNRn2kzReeI7wPj6MbOAkHYLAdxQKV7M'),
  -- mdp : MnHk0j?*Xg-/aao@29Kudv1pnoHWyEzF9ST3x6g58m*C7AZEOl9FAw5eQ4MUzWmNakH25jGF+NqwhAd9N%ufL9820odmCNjG?!zSC!*jmlnzGJ2x%ICg*Y&jEe5r1mx*Y38D@w&B!-+t/PrDyKJDVnPyRU*y45-sMY0Fmp*Wa8ijxVv*x&Kt9xqsjJATwYHaB/$!lROYhr5EB+3hLtArwJ43Hx!!?jRZZpmcIEjQEllOYwP*3s$A0Ms3-berkzXH
  ('salle 9', 9, 'https://twitter.com', 'test 9', 'desc 9', '{BELKADI ASMAA, ECHCHATBI HASNAA, HABBAK YASMINE, MAZLANI DOHA}', '$argon2id$v=19$m=65536,t=3,p=4$ea3MhhPJjuS9nZoQC45Owg$+84+9y6Z97CEHBDtb9eFq3lvXsMSj2AzWrER45w3D9E'),
  -- mdp : K!MC$rglEDW@9pQl0?%8?VV6nXLOTeV!9V%Qu?h1Q64S+%J/9Iy!VqC8G*bFCr8q+CCf*ki9*qDtfMCZE*M6E-ejKMA13Iy9/TbJSdZ8yvdQneL6Z2Eb-Box8x*Cy*0@DFxZi&8iMKfoKYJPUhSh@yOMSZ&I%yZBIT$FPyRGdhpSyfg%-!HoTHGS400-1CK-+EAEHPecL8l%HrkhQZl3m0TF1MUEw5Gg&zXv/7m9nwiMQ@8SuTO9F&NAA7yO8PcV
  ('salle 10', 10, 'https://instagram.com', 'test 10', 'desc 10', '{BAZHAR AMAL, MAZER HIBAT ALLAH, METROUH NINA, ZENASNI AMINA}', '$argon2id$v=19$m=65536,t=3,p=4$/IRoWeId/qBTnBeB2tVpnQ$amWctCX+Uq5dwhXlX3yBdFy43MDqpBgRV6SkXqAuwEA'),
  -- mdp : 04EG3RO6XY-eMSZ/qeasJ*aVxgXQICs50m5Wp3YGJV*wFImjj2v?P2Pea7kHd-1YLFc?2ud$nUF+80QII+YNd5TNV8h/uyYmj2M5vr4m991JBxar*9yZd!-ms-LL57ofpD*FMI/HSviZvU9vjO&tGlokoYYCo$8dR9Bcr&a6?pjBtiUZQ/gWVnneFUiWL%bH1wc%aVIEBW&HXvJus6Z7TsC$X$D@VGanES4iFqOc*Bkn1U$AvwNm2MUIDUW4ifvn
  ('salle 11', 11, 'https://linkedin.com', 'test 11', 'desc 11', '{DRAILY ESTEBAN, GOMADO KOFFI HILD, GONNET VINCENT, GOUDAL ARTHUR}', '$argon2id$v=19$m=65536,t=3,p=4$OeXEnEyVDXJJkr3n8pu6eQ$/YTYXP4Ga5RWY9vCHXVRF2dBlAiCE+ojOEQBVuSU15s'),
  -- mdp : RrI6MJ90uSq$Orj9@NB$aGlMYKL*Rh&HwGvzq&HME1Zls/eOj3nScehuXOwb-wsL2cMU&G-M++D8O*&*goH8Y%6fR@$4+/4+Kte*I@-/W29T-9pAsUf2SHuwpjz8KNBQhZQHiRT!RR8OEmo4IdtyW6bRZ@i6UQcuxZHj-x1k1fhuClDr!UF5SX0RvV+b1k3&w8Gm0SXBbfk32PqCGGGl0jw6l*OhSAflts$ApJpoA%O/2n!o2YdB$m3s2g@2PLYD
  ('salle 12', 12, 'https://reddit.com', 'test 12', 'desc 12', '{NADOT ANTONY, NDJABENGUE DOUMBENENYDAVID GEOFRET, PEREZ ENZO, PETEL ROMAIN}', '$argon2id$v=19$m=65536,t=3,p=4$ZbenGOdtGRKyCtd2qVUz7g$bd1jnPRnfpk8TG3JYlCqWwjwEMlEpiRGZjIblf4vmvo'),
  -- mdp : !1pbiQXP$83?sSv2Q$h46?NJNVsFHv2&TuzBrDdhT0r@u8kZLJQgpb/ML1c9Di/w/FEp*p!ihTq+Z*WSu%oR*8H*y?7kChc*QRrraKAwxA7JNqXNHSk9/*1DRJqG/C5OhIkakj-vhX6?j*wqoKD1ww%HR77QELud1*/+@E3vN2ff%va2KpVH&@uWtK$pwo5p%n1nFZ?1Dx*cgC1f!rFD5*VzbR4edg!/DwWm$*J5DNKJdY05/%THk&nOgYgwjPm!
  ('salle 13', 13, 'https://tiktok.com', 'test 13', 'desc 13', '{BABA AHMET, FOFANA ABDOULAHI, HANI SELIM, MAOULANA FAYAD}', '$argon2id$v=19$m=65536,t=3,p=4$jBhkGO8aV0x0G1srHoQDjw$Y5ZLNGQe6QhV6fF42hLVJLTi5x9Ya3VZo4xxhh/kxuI');


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
-- Et ensuite les tri de façon ascendante par leur date de début
--
-- permet de récupérer les parties en cours et en attente au tout début du lancement du serveur si certaines n'étaient pas fini

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
