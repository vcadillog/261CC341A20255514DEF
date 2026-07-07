package isw.eleccionbackend.dto;

import isw.eleccionbackend.model.Candidato;
import isw.eleccionbackend.model.ResultadoElectoral;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ResultadoElectoralRequest {
    private Long idResultado;
    private Long idCandidato;
    private String candidato;
    private String partido;
    private Integer votosNacionales;
    private Integer votosExtranjero;

    public static ResultadoElectoral toEntity(ResultadoElectoralRequest request, Candidato candidato) {
        ResultadoElectoral entity = new ResultadoElectoral();
        if (request.getIdResultado() != null && request.getIdResultado() > 0)
            entity.setIdResultado(request.getIdResultado());
        else
            entity.setIdResultado(null);
        entity.setCandidato(candidato);
        entity.setVotosNacionales(request.getVotosNacionales());
        entity.setVotosExtranjero(request.getVotosExtranjero());
        entity.setTotalVotos(request.getVotosNacionales() + request.getVotosExtranjero());
        return entity;
    }
}
