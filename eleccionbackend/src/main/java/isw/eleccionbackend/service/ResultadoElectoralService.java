package isw.eleccionbackend.service;

import isw.eleccionbackend.dto.ResultadoElectoralRequest;
import isw.eleccionbackend.dto.ResultadoElectoralResponse;
import isw.eleccionbackend.model.Candidato;
import isw.eleccionbackend.model.ResultadoElectoral;
import isw.eleccionbackend.repository.CandidatoRepository;
import isw.eleccionbackend.repository.ResultadoElectoralRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ResultadoElectoralService {
    @Autowired
    ResultadoElectoralRepository resultadoElectoralRepository;

    @Autowired
    CandidatoRepository candidatoRepository;

    public List<ResultadoElectoralResponse> getResultados() {
        return ResultadoElectoralResponse.fromEntities(resultadoElectoralRepository.findAll());
    }

    public ResultadoElectoralResponse findResultado(Long id) {
        return ResultadoElectoralResponse.fromEntity(resultadoElectoralRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Resultado Electoral no encontrado con id: " + id)));
    }

    public ResultadoElectoralResponse insertResultado(ResultadoElectoralRequest request) {
        Candidato candidato = candidatoRepository.findById(request.getIdCandidato())
                .orElseThrow(() -> new RuntimeException("Candidato no encontrado"));
        ResultadoElectoral entity = ResultadoElectoralRequest.toEntity(request, candidato);
        entity.setCreatedAt(java.time.LocalDateTime.now());
        entity.setUpdatedAt(java.time.LocalDateTime.now());
        ResultadoElectoral saved = resultadoElectoralRepository.save(entity);
        return ResultadoElectoralResponse.fromEntity(saved);
    }

    public ResultadoElectoralResponse updateResultado(ResultadoElectoralRequest request) {
        Candidato candidato = candidatoRepository.findById(request.getIdCandidato())
                .orElseThrow(() -> new RuntimeException("Candidato no encontrado"));
        ResultadoElectoral entity = ResultadoElectoralRequest.toEntity(request, candidato);
        entity.setUpdatedAt(java.time.LocalDateTime.now());
        entity = resultadoElectoralRepository.save(entity);
        return ResultadoElectoralResponse.fromEntity(entity);
    }

    public void deleteResultado(Long id) {
        resultadoElectoralRepository.deleteById(id);
    }
}
