package isw.sigconbackend.repository;

import isw.sigconbackend.model.Persona;
import isw.sigconbackend.model.Sexo;
import isw.sigconbackend.model.TipoDocumento;
import isw.sigconbackend.model.Ubigeo;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest;
import org.springframework.boot.jdbc.EmbeddedDatabaseConnection;
import org.springframework.boot.jdbc.test.autoconfigure.AutoConfigureTestDatabase;

import java.sql.Date;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
@AutoConfigureTestDatabase(connection = EmbeddedDatabaseConnection.H2)
class PersonaRepositoryTest {

    @Autowired
    PersonaRepository personaRepository;

    @Autowired
    SexoRepository sexoRepository;

    @Autowired
    TipoDocumentoRepository tipoDocumentoRepository;

    @Autowired
    UbigeoRepository ubigeoRepository;

    private Sexo sexo;
    private TipoDocumento tipoDocumento;
    private Ubigeo ubigeo;


    @BeforeEach
    void setUp() {
        init();
    }

    public void init() {
        tipoDocumento=TipoDocumento.builder()
                .idTipoDocumento(1)
                .descripcion("DNI").build();
        tipoDocumento=tipoDocumentoRepository.save(tipoDocumento);

        Sexo sexoF=Sexo.builder()
                .idSexo("F")
                .descripcion("Femenino")
                .descCorto("Fem").build();
        sexoF=sexoRepository.save(sexoF);

        Sexo sexoM=Sexo.builder()
                .idSexo("M")
                .descripcion("Masculino")
                .descCorto("Mas").build();
        sexoM=sexoRepository.save(sexoM);

        Ubigeo ubigeo1=Ubigeo.builder()
                .idUbigeo("150114")
                .departamento("Lima")
                .provincia("Lima")
                .distrito("La Molina").build();
        ubigeo1=ubigeoRepository.save(ubigeo1);

        Ubigeo ubigeo2=Ubigeo.builder()
                .idUbigeo("070104")
                .departamento("Callao")
                .provincia("La Perla")
                .distrito("La Perla").build();
        ubigeo2=ubigeoRepository.save(ubigeo2);

        Persona persona1= Persona.builder()
                .apellidoPaterno("Cavero")
                .apellidoMaterno("Alva")
                .nombres("Alejandro")
                .sexo(sexoM)
                .fechaNacimiento(new Date(2000-04-05).toLocalDate())
                .numDocumento("33356667")
                .telefono("988926748")
                .direccion("Av. Los Fresnos 865")
                .tipoDocumento(tipoDocumento)
                .ubigeo(ubigeo1).build();
        Persona newPersona1=personaRepository.save(persona1);

        Persona persona2=Persona.builder()
                .apellidoPaterno("Chirinos")
                .apellidoMaterno("Vargas")
                .nombres("Patricia")
                .sexo(sexoF)
                .fechaNacimiento(new Date(1992-04-05).toLocalDate())
                .numDocumento("55556667")
                .telefono("999926847")
                .direccion("Av. Guardia Chalaca 565")
                .tipoDocumento(tipoDocumento)
                .ubigeo(ubigeo2).build();
        Persona newPersona2=personaRepository.save(persona2);
    }
    @Test
    public void personaRepository_findAll() {
        List<Persona> personaList = personaRepository.findAll();
        Assertions.assertThat(personaList).isNotNull();
        Assertions.assertThat(personaList.size()).isEqualTo(2);
    }
    @Test
    public void personaRepository_findById() {
        Persona personaResult = personaRepository.findById(personaRepository.findAll().get(0).getIdPersona()).orElse(null);
        Assertions.assertThat(personaResult).isNotNull();
        Assertions.assertThat(personaResult.getApellidoPaterno()).isNotNull();
        Assertions.assertThat(personaResult.getIdPersona()).isGreaterThan(0);

    }
    @Test
    public void personaRepository_deleteById(){
        Persona personaResult = personaRepository.findAll().get(0);
        Assertions.assertThat(personaResult).isNotNull();
        personaRepository.delete(personaResult);
        Persona deletedPersona = personaRepository.findById(personaResult.getIdPersona()).orElse(null);
        Assertions.assertThat(deletedPersona).isNull();
    }

    @Test
    public void personaRepository_save() {
        Persona persona3=Persona.builder()
                .apellidoPaterno("Musk")
                .apellidoMaterno("Musk")
                .nombres("Elon")
                .sexo(sexoRepository.findById("M").get())
                .fechaNacimiento(new Date(2000-04-05).toLocalDate())
                .numDocumento("33356888")
                .telefono("989986247")
                .direccion("Av.Conquistadores 658")
                .tipoDocumento(tipoDocumentoRepository.findById(1).get())
                .ubigeo(ubigeoRepository.findById("070104").get()).build();
        Persona newPersona = personaRepository.save(persona3);

        Assertions.assertThat(newPersona).isNotNull();
        Assertions.assertThat(newPersona.getIdPersona()).isNotNull();
        Assertions.assertThat(newPersona.getApellidoPaterno()).isEqualTo("Musk");
    }
    @Test
    public void personaRepository_update(){
        Persona personaResult = personaRepository.findAll().get(0);
        personaResult.setDireccion("Av.Jose Galvez 748");

        Persona updatedPersona = personaRepository.save(personaResult);
        Assertions.assertThat(updatedPersona.getDireccion()).isEqualTo("Av.Jose Galvez 748");
    }

}