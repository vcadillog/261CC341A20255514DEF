package isw.sigconbackend.service;

import isw.sigconbackend.dto.PersonaRequest;
import isw.sigconbackend.dto.PersonaResponse;
import isw.sigconbackend.model.Persona;
import isw.sigconbackend.repository.PersonaRepository;
import isw.sigconbackend.repository.SexoRepository;
import isw.sigconbackend.repository.TipoDocumentoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PersonaService {
    @Autowired
    PersonaRepository personaRepository;

    public List<PersonaResponse> getPersona(){
        return PersonaResponse.fromEntities(personaRepository.findAll());
    }

    public PersonaResponse findPersona(Long id){
        return PersonaResponse.fromEntity(personaRepository.findById(id).get());
    }

    public PersonaResponse insertPersona(PersonaRequest personaRequest){
        Persona persona=PersonaRequest.toEntity(personaRequest);
        persona.setCreatedAt(java.time.LocalDateTime.now());
        persona.setUpdatedAt(java.time.LocalDateTime.now());
        Persona newPersona=personaRepository.save(persona);
        PersonaResponse personaResponse=PersonaResponse.fromEntity(newPersona);
        return personaResponse;
    }

    public PersonaResponse updatePersona(PersonaRequest personaRequest){
        Persona persona=PersonaRequest.toEntity(personaRequest);
        persona.setUpdatedAt(java.time.LocalDateTime.now());
        persona=personaRepository.save(persona);
        PersonaResponse personaResponse=PersonaResponse.fromEntity(persona);
        return personaResponse;
    }

    public void deletePersona(Long id){
        personaRepository.deleteById(id);
    }

    public PersonaResponse getPersonaByUsername(String username){
        return personaRepository.findByUsername(username)
                .map(PersonaResponse::fromEntity)
                .orElse(null);
    }
}
