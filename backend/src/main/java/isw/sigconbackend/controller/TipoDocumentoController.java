package isw.sigconbackend.controller;

import isw.sigconbackend.service.TipoDocumentoService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(path="api/v1/tipodocumento")
public class TipoDocumentoController {
    private final Logger logger = LoggerFactory.getLogger(this.getClass());

    @Autowired
    TipoDocumentoService tipoDocumentoService;

    @GetMapping
    public ResponseEntity<?> getTipoDocumento(){
        try{
            return ResponseEntity.ok(tipoDocumentoService.getTipoDocumento());
        } catch (Exception e) {
            logger.error("Error Inesperado",e);
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }

    }


}
