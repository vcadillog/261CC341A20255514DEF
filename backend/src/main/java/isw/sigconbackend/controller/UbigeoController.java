package isw.sigconbackend.controller;

import isw.sigconbackend.service.UbigeoService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(path="api/v1/ubigeo")
public class UbigeoController {
    private final Logger logger = LoggerFactory.getLogger(this.getClass());

    @Autowired
    UbigeoService ubigeoService;

    @GetMapping
    public ResponseEntity<?> getUbigeo(){
        try{
            return ResponseEntity.ok(ubigeoService.getUbigeo());
        } catch (Exception e) {
            logger.error("Error Inesperado",e);
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }
}
