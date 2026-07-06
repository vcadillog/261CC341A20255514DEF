package isw.sigconbackend.controller;

import isw.sigconbackend.dto.FacturasRequest;
import isw.sigconbackend.dto.FacturasResponse;
import isw.sigconbackend.service.FacturasService;
import isw.sigconbackend.util.ErrorResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping(path = "api/v1/facturas")
public class FacturasController {
    private final Logger logger = LoggerFactory.getLogger(this.getClass());

    @Autowired
    FacturasService facturasService;

    @GetMapping
    public ResponseEntity<?> getFacturas() {
        List<FacturasResponse> lista = Collections.emptyList();
        try {
            lista = facturasService.getFacturas();
        } catch (Exception e) {
            logger.error("Error Inesperado", e);
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
        if (lista.isEmpty())
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ErrorResponse.builder()
                            .message("Lista vacia de Facturas")
                            .build()
                    );
        return ResponseEntity.ok(lista);
    }

    @PostMapping
    public ResponseEntity<?> insertFactura(@RequestBody FacturasRequest facturasRequest) {
        logger.info(">insert " + facturasRequest.toString());
        FacturasResponse facturasResponse;
        try {
            facturasResponse = facturasService.insertFactura(facturasRequest);
        } catch (Exception e) {
            logger.error("Error Inesperado", e);
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
        if (facturasResponse == null)
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ErrorResponse.builder()
                            .message("No se pudo insertar Factura")
                            .build()
                    );
        return ResponseEntity.ok(facturasResponse);
    }

    @PutMapping
    public ResponseEntity<?> updateFactura(@RequestBody FacturasRequest facturasRequest) {
        logger.info(">update " + facturasRequest.toString());
        FacturasResponse facturasResponse;
        try {
            facturasResponse = facturasService.findFactura(facturasRequest.getIdFactura());
            if (facturasResponse == null)
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ErrorResponse.builder()
                                .message("No se ubicó Factura")
                                .build()
                        );
            facturasResponse = facturasService.updateFactura(facturasRequest);
        } catch (Exception e) {
            logger.error("Error Inesperado", e);
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
        if (facturasResponse == null)
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ErrorResponse.builder()
                            .message("No fue posible actualizar Factura")
                            .build()
                    );
        return ResponseEntity.ok(facturasResponse);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteFactura(@PathVariable Long id) {
        logger.info(">delete " + id);
        FacturasResponse facturasResponse;
        try {
            facturasResponse = facturasService.findFactura(id);
            if (facturasResponse == null)
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ErrorResponse.builder()
                                .message("No se ubicó Factura")
                                .build()
                        );
            facturasService.deleteFactura(id);
        } catch (Exception e) {
            logger.error("Error Inesperado", e);
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return ResponseEntity.ok(facturasResponse);
    }
}
