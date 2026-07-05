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
        //Creamos una instancia de la entity persona a partir del request
        Persona persona=PersonaRequest.toEntity(personaRequest);
        //Seteamos fecha actual a los campos de auditoria
        persona.setCreatedAt(java.time.LocalDateTime.now());
        persona.setUpdatedAt(java.time.LocalDateTime.now());
        //Registramos la entity persona
        Persona newPersona=personaRepository.save(persona);
        //Transformamos la nueva entity a un objeto de tipo response
        PersonaResponse personaResponse=PersonaResponse.fromEntity(newPersona);
        return personaResponse;
    }

    public PersonaResponse updatePersona(PersonaRequest personaRequest){
        //Creamos una instancia de la entity persona a partir del request
        Persona persona=PersonaRequest.toEntity(personaRequest);
        //Seteamos fecha actual a los campos de auditoria
        persona.setUpdatedAt(java.time.LocalDateTime.now());
        //Actualizamos la entity persona
        persona=personaRepository.save(persona);
        //Transformamos la entity modificada a un objeto de tipo response
        PersonaResponse personaResponse=PersonaResponse.fromEntity(persona);
        return personaResponse;
    }

    public void deletePersona(Long id){
        personaRepository.deleteById(id);
    }



}
