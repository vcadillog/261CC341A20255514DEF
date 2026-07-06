-- =========================================================
-- SIGCON Backend - PostgreSQL Database Script
-- Generated to match the JPA entities in:
--   isw.sigconbackend.model.Sexo
--   isw.sigconbackend.model.TipoDocumento
--   isw.sigconbackend.model.Ubigeo
--   isw.sigconbackend.model.Persona
-- =========================================================

-- 1) Create database (run this line separately while connected to
--    the default "postgres" database, then reconnect to "sigcon_db"
--    before running the rest of the script)
-- CREATE DATABASE sigcon_db;

-- \c sigcon_db   -- (psql meta-command to switch database)

BEGIN;

-- =========================================================
-- Lookup table: sexo
-- Entity uses id_sexo (String PK), descripcion, desc_corto
-- =========================================================
CREATE TABLE IF NOT EXISTS sexo (
    id_sexo     VARCHAR(5)   NOT NULL,
    descripcion VARCHAR(50)  NOT NULL,
    desc_corto  VARCHAR(10)  NOT NULL,
    CONSTRAINT pk_sexo PRIMARY KEY (id_sexo),
    CONSTRAINT uq_sexo_descripcion UNIQUE (descripcion),
    CONSTRAINT uq_sexo_desc_corto UNIQUE (desc_corto)
);

-- =========================================================
-- Lookup table: tipo_documento
-- Entity uses id_tipo_documento (Integer PK), descripcion
-- =========================================================
CREATE TABLE IF NOT EXISTS tipo_documento (
    id_tipo_documento  INTEGER      NOT NULL,
    descripcion        VARCHAR(100) NOT NULL,
    CONSTRAINT pk_tipo_documento PRIMARY KEY (id_tipo_documento)
);

-- =========================================================
-- Lookup table: ubigeo
-- Entity uses idubigeo (String PK), departamento, provincia, distrito
-- =========================================================
CREATE TABLE IF NOT EXISTS ubigeo (
    idubigeo     VARCHAR(10)  NOT NULL,
    departamento VARCHAR(100) NOT NULL,
    provincia    VARCHAR(100) NOT NULL,
    distrito     VARCHAR(100) NOT NULL,
    CONSTRAINT pk_ubigeo PRIMARY KEY (idubigeo)
);

-- =========================================================
-- Main table: persona
-- Matches isw.sigconbackend.model.Persona field-by-field
-- =========================================================
CREATE TABLE IF NOT EXISTS persona (
    id_persona        BIGSERIAL     NOT NULL,
    apellido_paterno  VARCHAR(100)  NOT NULL,
    apellido_materno  VARCHAR(100)  NOT NULL,
    nombres           VARCHAR(100)  NOT NULL,
    fecha_nacimiento  DATE          NOT NULL,
    ndocumento        VARCHAR(20)   NOT NULL,
    direccion         VARCHAR(200)  NOT NULL,
    telefono          VARCHAR(20)   NOT NULL,
    username          VARCHAR(50)   NULL,
    created_at        TIMESTAMP     NULL,
    updated_at        TIMESTAMP     NULL,
    id_sexo           VARCHAR(5)    NULL,
    id_tipo_documento INTEGER       NULL,
    idubigeo          VARCHAR(10)   NULL,
    CONSTRAINT pk_persona PRIMARY KEY (id_persona),
    CONSTRAINT uq_persona_ndocumento UNIQUE (ndocumento),
    CONSTRAINT fk_persona_sexo
        FOREIGN KEY (id_sexo) REFERENCES sexo (id_sexo)
        ON UPDATE CASCADE ON DELETE SET NULL,
    CONSTRAINT fk_persona_tipo_documento
        FOREIGN KEY (id_tipo_documento) REFERENCES tipo_documento (id_tipo_documento)
        ON UPDATE CASCADE ON DELETE SET NULL,
    CONSTRAINT fk_persona_ubigeo
        FOREIGN KEY (idubigeo) REFERENCES ubigeo (idubigeo)
        ON UPDATE CASCADE ON DELETE SET NULL
);

-- Helpful index for lookups by document number (already unique, but
-- explicit index name makes intent clear) and for FK columns.
CREATE INDEX IF NOT EXISTS idx_persona_id_sexo ON persona (id_sexo);
CREATE INDEX IF NOT EXISTS idx_persona_id_tipo_documento ON persona (id_tipo_documento);
CREATE INDEX IF NOT EXISTS idx_persona_idubigeo ON persona (idubigeo);

-- =========================================================
-- Table: usuario (for login/registration)
-- Matches isw.sigconbackend.model.Usuario
-- =========================================================
CREATE TABLE IF NOT EXISTS usuario (
    id_usuario     BIGSERIAL     NOT NULL,
    username       VARCHAR(50)   NOT NULL,
    nombre         VARCHAR(150)  NULL,
    password_hash  VARCHAR(100)  NOT NULL,
    created_at     TIMESTAMP     NULL,
    CONSTRAINT pk_usuario PRIMARY KEY (id_usuario),
    CONSTRAINT uq_usuario_username UNIQUE (username)
);

-- =========================================================
-- Seed data for lookup tables
-- =========================================================
INSERT INTO sexo (id_sexo, descripcion, desc_corto) VALUES
    ('M', 'Masculino', 'M'),
    ('F', 'Femenino',  'F')
ON CONFLICT (id_sexo) DO NOTHING;

INSERT INTO tipo_documento (id_tipo_documento, descripcion) VALUES
    (1, 'DNI'),
    (2, 'Carnet de Extranjeria'),
    (3, 'Pasaporte'),
    (4, 'RUC')
ON CONFLICT (id_tipo_documento) DO NOTHING;

-- Sample ubigeo rows (Peru INEI codes). Replace/extend with the
-- full official INEI ubigeo table if you need nationwide coverage.
INSERT INTO ubigeo (idubigeo, departamento, provincia, distrito) VALUES
    ('150101', 'LIMA', 'LIMA', 'LIMA'),
    ('150122', 'LIMA', 'LIMA', 'MIRAFLORES'),
    ('150140', 'LIMA', 'LIMA', 'SAN ISIDRO'),
    ('040101', 'AREQUIPA', 'AREQUIPA', 'AREQUIPA'),
    ('080101', 'CUSCO', 'CUSCO', 'CUSCO')
ON CONFLICT (idubigeo) DO NOTHING;

-- Insert sample personas
INSERT INTO persona (
    apellido_paterno,
    apellido_materno,
    nombres,
    fecha_nacimiento,
    ndocumento,
    direccion,
    telefono,
    created_at,
    updated_at,
    id_sexo,
    id_tipo_documento,
    idubigeo
) VALUES 
-- Person 1: Male with DNI
(
    'GARCIA',
    'PEREZ',
    'JUAN CARLOS',
    '1990-05-15',
    '12345678',
    'Av. Principal 123, Miraflores',
    '987654321',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP,
    'M',
    1,
    '150122'
),

-- Person 2: Female with DNI
(
    'RODRIGUEZ',
    'SANCHEZ',
    'MARIA ELENA',
    '1985-08-20',
    '87654321',
    'Calle Los Pinos 456, San Isidro',
    '987654322',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP,
    'F',
    1,
    '150140'
),

-- Person 3: Male with Passport
(
    'SMITH',
    'JOHNSON',
    'ROBERT WILLIAM',
    '1995-03-10',
    'AB123456',
    'Av. La Marina 789, Lima',
    '987654323',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP,
    'M',
    3,
    '150101'
),

-- Person 4: Female with DNI
(
    'CASTILLO',
    'RAMOS',
    'ANA SOFIA',
    '2000-12-01',
    '98765432',
    'Jr. Ayacucho 234, Cusco',
    '987654324',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP,
    'F',
    1,
    '080101'
),

-- Person 5: Male with DNI
(
    'QUISPE',
    'MAMANI',
    'CARLOS ANDRES',
    '1982-07-25',
    '45678912',
    'Av. Arequipa 567, Arequipa',
    '987654325',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP,
    'M',
    1,
    '040101'
),

-- Person 6: Female with Carnet de Extranjeria
(
    'CHANG',
    'LEE',
    'KIMBERLY YUN',
    '1992-11-11',
    'CE123456',
    'Calle Las Flores 890, Miraflores',
    '987654326',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP,
    'F',
    2,
    '150122'
),

-- Person 7: Male with RUC (as persona)
(
    'FERNANDEZ',
    'MARTINEZ',
    'JOSE LUIS',
    '1988-09-03',
    '20123456789',
    'Av. Javier Prado 123, San Isidro',
    '987654327',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP,
    'M',
    4,
    '150140'
),

-- Person 8: Female with DNI
(
    'VILLANUEVA',
    'CORDOVA',
    'LAURA PATRICIA',
    '1998-04-18',
    '56789123',
    'Jr. Puno 456, Lima',
    '987654328',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP,
    'F',
    1,
    '150101'
),

-- Person 9: Male with Passport
(
    'GONZALEZ',
    'DIAZ',
    'MIGUEL ANGEL',
    '1993-06-30',
    'XY987654',
    'Av. El Sol 789, Cusco',
    '987654329',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP,
    'M',
    3,
    '080101'
),

-- Person 10: Female with DNI
(
    'TORRES',
    'RIVERA',
    'CARMEN ROSA',
    '1980-02-14',
    '34567891',
    'Calle Umacollo 321, Arequipa',
    '987654330',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP,
    'F',
    1,
    '040101'
);

COMMIT;

-- =========================================================
-- Optional: application role with least-privilege access
-- Uncomment and adjust password before running in a real environment.
-- =========================================================
-- CREATE USER sigcon_app WITH PASSWORD 'change_me';
-- GRANT CONNECT ON DATABASE sigcon_db TO sigcon_app;
-- GRANT USAGE ON SCHEMA public TO sigcon_app;
-- GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO sigcon_app;
-- GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO sigcon_app;

