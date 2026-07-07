CREATE DATABASE eleccion_db;
\c eleccion_db;

BEGIN;

CREATE TABLE IF NOT EXISTS candidato (
    id_candidato  BIGSERIAL    NOT NULL,
    candidato     VARCHAR(150) NOT NULL,
    partido       VARCHAR(150) NOT NULL,
    CONSTRAINT pk_candidato PRIMARY KEY (id_candidato)
);

CREATE TABLE IF NOT EXISTS resultado_electoral (
    id_resultado      BIGSERIAL    NOT NULL,
    id_candidato      BIGINT       NOT NULL,
    votos_nacionales  INTEGER      NOT NULL DEFAULT 0,
    votos_extranjero  INTEGER      NOT NULL DEFAULT 0,
    total_votos       INTEGER      NOT NULL DEFAULT 0,
    created_at        TIMESTAMP    NULL,
    updated_at        TIMESTAMP    NULL,
    CONSTRAINT pk_resultado_electoral PRIMARY KEY (id_resultado),
    CONSTRAINT fk_resultado_candidato
        FOREIGN KEY (id_candidato) REFERENCES candidato (id_candidato)
        ON UPDATE CASCADE ON DELETE CASCADE
);

-- First batch of data
INSERT INTO candidato (id_candidato, candidato, partido) VALUES
    (1, 'Keiko Sofia Fujimori Higuchi', 'Fuerza Popular'),
    (2, 'Roberto Helbert Sanchez Palomino', 'Juntos por el Perú')
ON CONFLICT (id_candidato) DO NOTHING;

-- Second batch of data
INSERT INTO candidato (id_candidato, candidato, partido) VALUES
    (1, 'Keiko Sofia Fujimori Higuchi', 'Fuerza Popular'),
    (2, 'Roberto Helbert Sanchez Palomino', 'Juntos por el Perú')
ON CONFLICT (id_candidato) DO NOTHING;

INSERT INTO resultado_electoral (id_candidato, votos_nacionales, votos_extranjero, total_votos, created_at, updated_at) VALUES
    (1, 9028008, 195388, (9028008 + 195388), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (2, 9060022, 113733, (9060022 + 113733), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (id_resultado) DO NOTHING;

COMMIT;

SELECT 
    candidato,
    partido,
    votos_nacionales + votos_extranjero AS total_votos
FROM resultado_electoral
JOIN candidato USING (id_candidato);

