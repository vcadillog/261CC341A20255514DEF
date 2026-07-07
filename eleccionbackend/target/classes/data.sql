INSERT INTO candidato (id_candidato, candidato, partido) VALUES
    (1, 'Keiko Sofia Fujimori Higuchi', 'Fuerza Popular'),
    (2, 'Roberto Helbert Sanchez Palomino', 'Juntos por el Perú')
ON CONFLICT (id_candidato) DO NOTHING;

INSERT INTO resultado_electoral (id_candidato, votos_nacionales, votos_extranjero, total_votos, created_at, updated_at) VALUES
    (1, 9028008, 195388, 9223396, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (2, 9060022, 113733, 9173755, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (id_resultado) DO NOTHING;
