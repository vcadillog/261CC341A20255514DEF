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

ALTER TABLE resultado_electoral ADD COLUMN IF NOT EXISTS total_votos INTEGER NOT NULL DEFAULT 0;
