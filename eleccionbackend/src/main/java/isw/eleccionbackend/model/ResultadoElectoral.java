package isw.eleccionbackend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "resultado_electoral")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ResultadoElectoral {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_resultado", nullable = false)
    private Long idResultado;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_candidato", referencedColumnName = "id_candidato", nullable = false)
    private Candidato candidato;

    @Column(name = "votos_nacionales", nullable = false)
    private Integer votosNacionales;

    @Column(name = "votos_extranjero", nullable = false)
    private Integer votosExtranjero;

    @Column(name = "total_votos", nullable = false)
    private Integer totalVotos;

    @Column(name = "created_at", nullable = true, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at", nullable = true)
    private LocalDateTime updatedAt = LocalDateTime.now();
}
