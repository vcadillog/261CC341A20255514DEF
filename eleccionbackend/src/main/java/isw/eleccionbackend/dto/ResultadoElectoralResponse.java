package isw.eleccionbackend.dto;

import isw.eleccionbackend.model.ResultadoElectoral;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.stream.Collectors;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ResultadoElectoralResponse {
    private Long idResultado;
    private Long idCandidato;
    private String candidato;
    private String partido;
    private Integer votosNacionales;
    private Integer votosExtranjero;
    private Integer totalVotos;

    public static ResultadoElectoralResponse fromEntity(ResultadoElectoral entity) {
        return ResultadoElectoralResponse.builder()
                .idResultado(entity.getIdResultado())
                .idCandidato(entity.getCandidato().getIdCandidato())
                .candidato(entity.getCandidato().getCandidato())
                .partido(entity.getCandidato().getPartido())
                .votosNacionales(entity.getVotosNacionales())
                .votosExtranjero(entity.getVotosExtranjero())
                .totalVotos(entity.getTotalVotos())
                .build();
    }

    public static List<ResultadoElectoralResponse> fromEntities(List<ResultadoElectoral> entities) {
        return entities.stream()
                .map(ResultadoElectoralResponse::fromEntity)
                .collect(Collectors.toList());
    }
}
