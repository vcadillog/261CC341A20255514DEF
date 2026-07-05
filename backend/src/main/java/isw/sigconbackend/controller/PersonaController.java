package isw.sigconbackend.controller;

import isw.sigconbackend.dto.PersonaRequest;
import isw.sigconbackend.dto.PersonaResponse;
import isw.sigconbackend.service.PersonaService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import isw.sigconbackend.util.ErrorResponse;

import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping(path="api/v1/persona")
public class PersonaController {
    private final Logger logger = LoggerFactory.getLogger(this.getClass());

    @Autowired
    PersonaService personaService;

    @GetMapping
    public ResponseEntity<?> getPersona(){
        List<PersonaResponse> lista= Collections.emptyList();
        try{
            lista=personaService.getPersona();
        } catch (Exception e) {
            logger.error("Error Inesperado",e);
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
        if(lista.isEmpty())
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ErrorResponse.builder()
                            .message("Lista vacia de Personas")
                            .build()
                    );
        return ResponseEntity.ok(lista);
    }

    @PostMapping
    public ResponseEntity<?> insertPersona(@RequestBody PersonaRequest personaRequest){
        logger.info(">insert "+ personaRequest.toString());
        PersonaResponse personaResponse;
        try{
            personaResponse=personaService.insertPersona(personaRequest);
        } catch (Exception e) {
            logger.error("Error Inesperado",e);
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
        if(personaResponse==null)
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ErrorResponse.builder()
                            .message("No se pudo insertar Persona")
                            .build()
                    );
        return ResponseEntity.ok(personaResponse);
    }

    @PutMapping
    public ResponseEntity<?> updatePersona(@RequestBody PersonaRequest personaRequest){
        logger.info(">update "+ personaRequest.toString());
        PersonaResponse personaResponse;
        try{
            //antes de actualizar, verificamos que la persona exista
            personaResponse=personaService.findPersona(personaRequest.getIdPersona());
            if(personaResponse==null)
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ErrorResponse.builder()
                                .message("No se ubicó Persona")
                                .build()
                        );
            //actualizamos persona
            personaResponse=personaService.updatePersona(personaRequest);
        } catch (Exception e) {
            logger.error("Error Inesperado",e);
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
        if(personaResponse==null)
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ErrorResponse.builder()
                            .message("No fue posible actualizar Persona")
                            .build()
                    );
        return ResponseEntity.ok(personaResponse);
    }

    @DeleteMapping
    public ResponseEntity<?> deletePersona(@RequestBody PersonaRequest personaRequest){
        logger.info(">delete "+ personaRequest.toString());
        PersonaResponse personaResponse;
        try{
            //antes de eliminar, verificamos que la persona existe
            personaResponse=personaService.findPersona(personaRequest.getIdPersona());
            if(personaResponse==null)
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ErrorResponse.builder()
                                .message("No se ubicó Persona")
                                .build()
                        );
            //eliminar persona
            personaService.deletePersona(personaRequest.getIdPersona());
        } catch (Exception e) {
            logger.error("Error Inesperado",e);
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return ResponseEntity.ok(personaResponse);
    }

}
