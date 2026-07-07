INSERT INTO candidato (id_candidato, candidato, partido) VALUES
    (1, 'Keiko Sofia Fujimori Higuchi', 'Fuerza Popular'),
    (2, 'Roberto Helbert Sanchez Palomino', 'Juntos por el Perú')
ON CONFLICT (id_candidato) DO NOTHING;

INSERT INTO resultado_electoral (id_candidato, votos_nacionales, votos_extranjero, total_votos, created_at, updated_at) VALUES
    (1, 15000, 3200, 18200, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (2, 12800, 4100, 16900, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (id_resultado) DO NOTHING;

INSERT INTO resultado_electoral (id_candidato, votos_nacionales, votos_extranjero, total_votos, created_at, updated_at) VALUES
    (1, 9028008, 195388, (9028008 + 195388), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (2, 9060022, 113733, (9060022 + 113733), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (id_resultado) DO NOTHING;
