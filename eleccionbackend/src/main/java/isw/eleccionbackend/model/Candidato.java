package isw.eleccionbackend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "candidato")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Candidato {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_candidato", nullable = false)
    private Long idCandidato;

    @Column(nullable = false, length = 150)
    private String candidato;

    @Column(nullable = false, length = 150)
    private String partido;
}
