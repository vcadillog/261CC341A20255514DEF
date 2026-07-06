ALTER TABLE persona ADD COLUMN IF NOT EXISTS username VARCHAR(50);

CREATE TABLE IF NOT EXISTS facturas (
    id_factura SERIAL PRIMARY KEY,
    serie VARCHAR(10) NOT NULL,
    numero VARCHAR(20) NOT NULL,
    fecha_emision DATE NOT NULL,
    fecha_vencimiento DATE,
    subtotal NUMERIC(10, 2) NOT NULL,
    igv NUMERIC(10, 2) NOT NULL,
    total NUMERIC(10, 2) NOT NULL,
    estado VARCHAR(20) NOT NULL DEFAULT 'EMITIDA',
    id_persona BIGINT,
    id_usuario BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_facturas_persona FOREIGN KEY (id_persona) REFERENCES persona(id_persona),
    CONSTRAINT fk_facturas_usuario FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario)
);
