package isw.sigconbackend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import isw.sigconbackend.dto.PersonaRequest;
import isw.sigconbackend.dto.PersonaResponse;
import isw.sigconbackend.model.Sexo;
import isw.sigconbackend.model.TipoDocumento;
import isw.sigconbackend.model.Ubigeo;
import isw.sigconbackend.service.PersonaService;
import org.hamcrest.CoreMatchers;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentMatchers;
import org.mockito.junit.jupiter.MockitoExtension;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;

import java.sql.Date;
import java.util.Arrays;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(controllers = PersonaController.class)
@AutoConfigureMockMvc(addFilters = false)
@ExtendWith(MockitoExtension.class)
class PersonaControllerTest {
    private final Logger logger= LoggerFactory.getLogger(this.getClass());
    @Autowired
    private MockMvc mockMvc;

    private final ObjectMapper objectMapper = new ObjectMapper().registerModule(new JavaTimeModule());

    @MockitoBean
    private PersonaService personaService;

    Sexo sexoF,sexoM;
    TipoDocumento tipodocumento;
    Ubigeo ubigeo;
    PersonaRequest personaRequest;
    PersonaResponse personaResponse,personaResponse2,personaResponse3;

    @BeforeEach
    void setUp() {
        init();
    }

    public void init() {
        sexoF = Sexo.builder()
                .idSexo("F")
                .descripcion("Femenino").build();

        String idSexoF= sexoF.getIdSexo();

        sexoM = Sexo.builder()
                .idSexo("M")
                .descripcion("Masculino").build();

        String idSexoM= sexoM.getIdSexo();

        tipodocumento = TipoDocumento.builder()
                .idTipoDocumento(1)
                .descripcion("DNI").build();

        Integer id_tipo_documento=tipodocumento.getIdTipoDocumento();

        ubigeo=Ubigeo.builder()
                .idUbigeo("070104")
                .departamento("Callao")
                .provincia("La Perla")
                .distrito("La Perla").build();

        String idubigeo=ubigeo.getIdUbigeo();

        personaRequest=PersonaRequest.builder()
                .idPersona(null)
                .apellidoPaterno("Cavero")
                .apellidoMaterno("Alva")
                .nombres("Alejandro")
                .idSexo(idSexoM)
                .fechaNacimiento(new Date(2000-04-05).toLocalDate())
                .numDocumento("33356667")
                .telefono("999854142")
                .direccion("Av. Los Fresnos 865")
                .idTipoDocumento(id_tipo_documento)
                .idUbigeo(idubigeo).build();


        personaResponse=PersonaResponse.builder()
                .idPersona(1L)
                .apellidoPaterno("Cavero")
                .apellidoMaterno("Alva")
                .nombres("Alejandro")
                .sexo(sexoM)
                .fechaNacimiento(new Date(2000-04-05).toLocalDate())
                .numDocumento("33356667")
                .telefono("999854142")
                .direccion("Calle Luna 987")
                .tipoDocumento(tipodocumento)
                .ubigeo(ubigeo).build();

        personaResponse2=PersonaResponse.builder()
                .idPersona(2L)
                .apellidoPaterno("Chirinos")
                .apellidoMaterno("Soto")
                .nombres("Maria")
                .sexo(sexoF)
                .fechaNacimiento(new Date(2000-04-05).toLocalDate())
                .numDocumento("33356777")
                .telefono("995894241")
                .direccion("Av.Javier Prado 758")
                .tipoDocumento(tipodocumento)
                .ubigeo(ubigeo).build();
        personaResponse3=PersonaResponse.builder()
                .idPersona(3L)
                .apellidoPaterno("Musk")
                .apellidoMaterno("Soto")
                .nombres("Elon")
                .sexo(sexoM)
                .fechaNacimiento(new Date(2000-04-05).toLocalDate())
                .numDocumento("33356888")
                .telefono("979854421")
                .direccion("Av.Conquistadores 658")
                .tipoDocumento(tipodocumento)
                .ubigeo(ubigeo).build();
    }

    @Test
    public void PersonaController_insert() throws Exception {
        when(personaService.insertPersona(personaRequest)).thenReturn(personaResponse);

        logger.info(">Test-insertPersona1: " +  personaResponse.toString());

        MockHttpServletResponse response = mockMvc
                .perform(post("/api/v1/persona")
                        .content(objectMapper.writeValueAsString(personaRequest))
                        .contentType(MediaType.APPLICATION_JSON)
                        .accept(MediaType.APPLICATION_JSON)
                ).andReturn().getResponse();

        logger.info(">Test-insertPersona2: " +  response.getClass().toString());
        Assertions.assertEquals(response.getStatus(),200);
        Assertions.assertEquals(personaRequest.getNombres(),
                objectMapper.readValue(response.getContentAsString(), PersonaResponse.class).getNombres());
    }

    @Test
    public void PersonaController_delete() throws Exception {
        logger.info(">Test-PersonaController_delete: ");
        personaRequest.setIdPersona(1L);
        given(personaService.findPersona(ArgumentMatchers.anyLong())).willReturn(personaResponse);
        doNothing().when(personaService).deletePersona(ArgumentMatchers.anyLong());

        ResultActions response = mockMvc.perform(delete("/api/v1/persona")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(personaRequest)));

        response.andExpect(status().isOk());
    }
    @Test
    public void PersonaController_update() throws Exception {
        logger.info(">Test-PersonaController_update: ");
        personaRequest.setIdPersona(1L);

        given(personaService.findPersona(ArgumentMatchers.anyLong())).willReturn(personaResponse);

        personaRequest.setDireccion("Calle Luna 987");

        when(personaService.updatePersona(personaRequest)).thenReturn(personaResponse);

        MockHttpServletResponse response = mockMvc.perform(put("/api/v1/persona")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(personaRequest)))
                .andReturn().getResponse();

        logger.info(">Test-updatePersona1: " +  status()+" "+ personaResponse.toString());
        //Assertions.assertEquals(response.getStatus(),MockMvcResultMatchers.status().isOk());
        Assertions.assertEquals(personaRequest.getDireccion(),
                objectMapper.readValue(response.getContentAsString(), PersonaResponse.class).getDireccion());
    }
    @Test
    public void PersonaController_getPersonas() throws Exception {
        logger.info(">Test-PersonaController_getPersonas: ");
        when(personaService.getPersona()).thenReturn(Arrays.asList(personaResponse2, personaResponse3));

        ResultActions response = mockMvc.perform(get("/api/v1/persona")
                .contentType(MediaType.APPLICATION_JSON));

        response.andExpect(status().isOk())
                .andExpect(jsonPath("$.size()", CoreMatchers.is(2)))
                .andExpect(jsonPath("$[0].nombres", CoreMatchers.is(personaResponse2.getNombres())));
    }


}