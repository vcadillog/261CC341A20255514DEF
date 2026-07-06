package isw.sigconbackend.controller;

import isw.sigconbackend.dto.CambioPasswordRequest;
import isw.sigconbackend.dto.LoginRequest;
import isw.sigconbackend.dto.RegistroRequest;
import isw.sigconbackend.dto.UsuarioResponse;
import isw.sigconbackend.service.UsuarioService;
import isw.sigconbackend.util.ErrorResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(path = "api/v1/auth")
public class AuthController {
    private final Logger logger = LoggerFactory.getLogger(this.getClass());

    @Autowired
    UsuarioService usuarioService;

    @PostMapping("/registro")
    public ResponseEntity<?> registrar(@RequestBody RegistroRequest registroRequest) {
        logger.info(">registro " + registroRequest.getUsername());
        UsuarioResponse usuarioResponse;
        try {
            usuarioResponse = usuarioService.registrar(registroRequest);
        } catch (Exception e) {
            logger.error("Error Inesperado", e);
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
        if (usuarioResponse == null)
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(ErrorResponse.builder()
                            .message("El usuario ya existe")
                            .build()
                    );
        return ResponseEntity.ok(usuarioResponse);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        logger.info(">login " + loginRequest.getUsername());
        UsuarioResponse usuarioResponse;
        try {
            usuarioResponse = usuarioService.login(loginRequest);
        } catch (Exception e) {
            logger.error("Error Inesperado", e);
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
        if (usuarioResponse == null)
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ErrorResponse.builder()
                            .message("Usuario o contraseña inválidos")
                            .build()
                    );
        return ResponseEntity.ok(usuarioResponse);
    }

    @PutMapping("/password")
    public ResponseEntity<?> cambiarPassword(@RequestBody CambioPasswordRequest request) {
        logger.info(">cambiarPassword " + request.getUsername());
        UsuarioResponse usuarioResponse;
        try {
            usuarioResponse = usuarioService.cambiarPassword(request);
        } catch (Exception e) {
            logger.error("Error Inesperado", e);
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
        if (usuarioResponse == null)
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ErrorResponse.builder()
                            .message("Usuario o contraseña actual inválidos")
                            .build()
                    );
        return ResponseEntity.ok(usuarioResponse);
    }
}
