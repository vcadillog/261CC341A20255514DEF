package isw.sigconbackend.service;

import isw.sigconbackend.dto.LoginRequest;
import isw.sigconbackend.dto.RegistroRequest;
import isw.sigconbackend.dto.UsuarioResponse;
import isw.sigconbackend.model.Usuario;
import isw.sigconbackend.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class UsuarioService {

    @Autowired
    UsuarioRepository usuarioRepository;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    /**
     * Returns null if the username is already taken.
     */
    public UsuarioResponse registrar(RegistroRequest request) {
        if (usuarioRepository.existsByUsername(request.getUsername())) {
            return null;
        }

        Usuario usuario = Usuario.builder()
                .username(request.getUsername())
                .nombre(request.getNombre())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .createdAt(LocalDateTime.now())
                .build();

        Usuario saved = usuarioRepository.save(usuario);
        return UsuarioResponse.fromEntity(saved);
    }

    /**
     * Returns null if the username doesn't exist or the password doesn't match.
     */
    public UsuarioResponse login(LoginRequest request) {
        Optional<Usuario> usuarioOpt = usuarioRepository.findByUsername(request.getUsername());
        if (usuarioOpt.isEmpty()) {
            return null;
        }

        Usuario usuario = usuarioOpt.get();
        if (!passwordEncoder.matches(request.getPassword(), usuario.getPasswordHash())) {
            return null;
        }

        return UsuarioResponse.fromEntity(usuario);
    }
}
