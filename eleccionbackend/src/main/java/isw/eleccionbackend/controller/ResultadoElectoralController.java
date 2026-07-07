package isw.eleccionbackend.controller;

import isw.eleccionbackend.dto.ResultadoElectoralRequest;
import isw.eleccionbackend.dto.ResultadoElectoralResponse;
import isw.eleccionbackend.service.ResultadoElectoralService;
import isw.eleccionbackend.util.ErrorResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping(path = "api/v1/resultado-electoral")
public class ResultadoElectoralController {
    private final Logger logger = LoggerFactory.getLogger(this.getClass());

    @Autowired
    ResultadoElectoralService resultadoElectoralService;

    @GetMapping
    public ResponseEntity<?> getResultados() {
        List<ResultadoElectoralResponse> lista = Collections.emptyList();
        try {
            lista = resultadoElectoralService.getResultados();
        } catch (Exception e) {
            logger.error("Error Inesperado", e);
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
        if (lista.isEmpty())
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ErrorResponse.builder().message("Lista vacia de Resultados Electorales").build());
        return ResponseEntity.ok(lista);
    }

    @PostMapping
    public ResponseEntity<?> insertResultado(@RequestBody ResultadoElectoralRequest request) {
        logger.info(">insert " + request.toString());
        ResultadoElectoralResponse response;
        try {
            response = resultadoElectoralService.insertResultado(request);
        } catch (Exception e) {
            logger.error("Error Inesperado", e);
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
        if (response == null)
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ErrorResponse.builder().message("No se pudo insertar Resultado Electoral").build());
        return ResponseEntity.ok(response);
    }

    @PutMapping
    public ResponseEntity<?> updateResultado(@RequestBody ResultadoElectoralRequest request) {
        logger.info(">update " + request.toString());
        ResultadoElectoralResponse response;
        try {
            response = resultadoElectoralService.findResultado(request.getIdResultado());
            if (response == null)
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ErrorResponse.builder().message("No se ubico Resultado Electoral").build());
            response = resultadoElectoralService.updateResultado(request);
        } catch (Exception e) {
            logger.error("Error Inesperado", e);
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
        if (response == null)
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ErrorResponse.builder().message("No fue posible actualizar Resultado Electoral").build());
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteResultado(@PathVariable Long id) {
        logger.info(">delete " + id);
        ResultadoElectoralResponse response;
        try {
            response = resultadoElectoralService.findResultado(id);
            if (response == null)
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ErrorResponse.builder().message("No se ubico Resultado Electoral").build());
            resultadoElectoralService.deleteResultado(id);
        } catch (Exception e) {
            logger.error("Error Inesperado", e);
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return ResponseEntity.ok(response);
    }
}
