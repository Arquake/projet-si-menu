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


-- les mots de passe :

-- 1 fmJYravPGbIwwnbUeNsF83ZC
-- 2 836Ns5tJsKfGnbP5jaQrHOpC
-- 3 V1Gsg62q7DU4FQQYGWAIBNXr
-- 4 xu6bg0EmGpztrO1uSuml46DV
-- 5 hyh1j0eC3SpEFV9h6reGVqyM
-- 6 KGx8JtdNUBd6xAsBrsNIWsur
-- 7 tADVXzYQUYmYW55A6o6jWbC2
-- 8 r35o55iT5xzYVtmPBfoiwBg9
-- 9 DkC3NFFtYQ7ft44LN8r8285E
-- 10 tSEW0i7C29yXgoRJiHMv3hyb
-- 11 C6tKZm7EDd3dwLY18LgrZxVD
-- 12 pp7RFuMGcHuwlBpes9JhdPoL
-- 13 rsxnWbSiYhsl2dcmUqGY9dkq

INSERT INTO Projects (placement, "order", url, name, description, authors, privateKey) 
VALUES 
    -- mdp : fmJYravPGbIwwnbUeNsF83ZC
  ('salle 1', 1, 'https://google.fr', 'test 1', 'desc 1', '{ADJAS HICHAM, AFKIR AYOUB, BENABIDI MOHAMED-ANAS, BIYIHA BIKONDI EMERIC}', '$argon2id$v=19$m=65536,t=3,p=4$YyEAS5p0fOVLuos8o3++uQ$k4oMg1/y2Y5U2MZLVbLO4LDFOX0npjlD8F3Af9IcZP8'),
  -- mdp : 836Ns5tJsKfGnbP5jaQrHOpC
  ('salle 2', 2, 'https://example.com', 'test 2', 'desc 2', '{AHAMAT MOUSSA ABDELKERIM, EL BUSHABATI REDWAN, IBRAHIM ELMI KENEDID, MOHAMAD ALI}', '$argon2id$v=19$m=65536,t=3,p=4$y+I5Zpz/dEAASjJoBMWoiA$YLA/z9uBpSh8zFwqjDeP3w3YtFfCPS99kp0RCjRpIO8'),
  -- mdp : V1Gsg62q7DU4FQQYGWAIBNXr
  ('salle 3', 3, 'https://yahoo.com', 'test 3', 'desc 3', '{BARHOUMI YUSRA, BELBAZ BELKAIS MELINA, BEN ABDALLAH WALA, EL BELAIZI CHAIMAE}', '$argon2id$v=19$m=65536,t=3,p=4$vSLG6n653dG+/hClOx8wkg$z278GFKyTvOJPbmMm3L0IIVAWxUvTOERNXLpz5eR4l4'),
  -- mdp : xu6bg0EmGpztrO1uSuml46DV
  ('salle 4', 4, 'https://bing.com', 'test 4', 'desc 4', '{BOUDIAF MOHAMMED ACHRAF, BRUMAIRE QUENTIN, CRESPEAU BENJAMIN, GOUASMI YASSINE ABDENNOUR}', '$argon2id$v=19$m=65536,t=3,p=4$CLtBIQDMPkcDolsBpe+6rA$xejDi6o18g4bqkTgPtzrawtq5kIbhBZDl+nR/XvWA7w'),
  -- mdp : hyh1j0eC3SpEFV9h6reGVqyM
  ('salle 5', 5, 'https://duckduckgo.com', 'test 5', 'desc 5', '{ABHARI NISRINE, DEMARET SULLIVAN, FOUCHER THOMAS, SUKIENNIK ZINEB}', '$argon2id$v=19$m=65536,t=3,p=4$ijDmB9JRr2tBJEoePvfQLQ$OyH0kRgm6B7hmjW4JpbIFmotL7HuMqZpkjr6kdJpH/o'),
  -- mdp : KGx8JtdNUBd6xAsBrsNIWsur
  ('salle 6', 6, 'https://store.steampowered.com/', 'test 6', 'desc 6', '{DIAGNE BAYE CHEIKH, DINCER TAYYIB, GUEYE BINTA, POUYE ABDOUL AZIZ}', '$argon2id$v=19$m=65536,t=3,p=4$AMpcw6ryBKdIr8WeNAJQfw$FHoR68EShKjDKuYQ3Gp3MzSlFY5h3zbWyHLBdvDvkk0'),
  -- mdp : tADVXzYQUYmYW55A6o6jWbC2
  ('salle 7', 7, 'https://youtube.com', 'test 7', 'desc 7', '{BEE THIBAULT, GASSE MATIS, LECLERC GALLOIS THEO, PEREZ BENJAMIN}', '$argon2id$v=19$m=65536,t=3,p=4$n2zLllV//KniJHntN5GRkg$YXhoMyVWCUWDvxb/n8z+elvtp/Pe1L0zy/DOo7BW81w'),
  -- mdp : r35o55iT5xzYVtmPBfoiwBg9
  ('salle 8', 8, 'https://facebook.com', 'test 8', 'desc 8', '{EL MADANI AMINA, MANAR NADA, OKBA SALMA}', '$argon2id$v=19$m=65536,t=3,p=4$W7WCaHAAzXgCIzuXPY/VqQ$4DhW9ZgKwGPvVzbieDcyKT485iEbAfwXSd1OFHxNMA8'),
  -- mdp : DkC3NFFtYQ7ft44LN8r8285E
  ('salle 9', 9, 'https://twitter.com', 'test 9', 'desc 9', '{BELKADI ASMAA, ECHCHATBI HASNAA, HABBAK YASMINE, MAZLANI DOHA}', '$argon2id$v=19$m=65536,t=3,p=4$XSQljyRZFjWLbmY5Kuu0Zg$RJzGVr91sbxfc/1vvanGbzBNtJWnmuUjQ23G9jthutg'),
  -- mdp : tSEW0i7C29yXgoRJiHMv3hyb
  ('salle 10', 10, 'https://instagram.com', 'test 10', 'desc 10', '{BAZHAR AMAL, MAZER HIBAT ALLAH, METROUH NINA, ZENASNI AMINA}', '$argon2id$v=19$m=65536,t=3,p=4$6PRUqtNt8WjCXDJHwA3wBw$VbW6IB9X4tHLkdmMiJgdfU2u2R732ATGR9dCNeIoj38'),
  -- mdp : C6tKZm7EDd3dwLY18LgrZxVD
  ('salle 11', 11, 'https://linkedin.com', 'test 11', 'desc 11', '{DRAILY ESTEBAN, GOMADO KOFFI HILD, GONNET VINCENT, GOUDAL ARTHUR}', '$argon2id$v=19$m=65536,t=3,p=4$H+IXE8Z79RWq+R5uiQLPmA$8dof8jNoEJR1zoeJJEHGdD/HxhdYldrquJjB2TUJj/M'),
  -- mdp : pp7RFuMGcHuwlBpes9JhdPoL
  ('salle 12', 12, 'https://reddit.com', 'test 12', 'desc 12', '{NADOT ANTONY, NDJABENGUE DOUMBENENYDAVID GEOFRET, PEREZ ENZO, PETEL ROMAIN}', '$argon2id$v=19$m=65536,t=3,p=4$0gXQua74VonezQ4JJnkKIw$0XA2Awsj7tzuMwCfHTGBfjk3lQVpm2Sm2CJpN7yZc3Q'),
  -- mdp : rsxnWbSiYhsl2dcmUqGY9dkq
  ('salle 13', 13, 'https://tiktok.com', 'test 13', 'desc 13', '{BABA AHMET, FOFANA ABDOULAHI, HANI SELIM, MAOULANA FAYAD}', '$argon2id$v=19$m=65536,t=3,p=4$WA6Lyu13XzPViRkc5ve9vg$Ui2a/o98FLlFO7gsr4BFanLnW2wUvlWzV2izUWEOxAQ');