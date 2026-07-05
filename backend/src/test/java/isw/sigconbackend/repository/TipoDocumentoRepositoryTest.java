package isw.sigconbackend.repository;

import isw.sigconbackend.model.TipoDocumento;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest;
import org.springframework.boot.jdbc.EmbeddedDatabaseConnection;
import org.springframework.boot.jdbc.test.autoconfigure.AutoConfigureTestDatabase;

import java.util.List;

@DataJpaTest
@AutoConfigureTestDatabase(connection = EmbeddedDatabaseConnection.H2)
class TipoDocumentoRepositoryTest {
    @Autowired
    TipoDocumentoRepository tipoDocumentoRepository;
    private TipoDocumento tipoDocumento;

    @BeforeEach
    void setUp() {
    }

    @Test
    public void testFindAll(){
        tipoDocumento=TipoDocumento.builder()
                .idTipoDocumento(1)
                .descripcion("DNI").build();
        tipoDocumento=tipoDocumentoRepository.save(tipoDocumento);

        List<TipoDocumento> tipoDocumentoList=tipoDocumentoRepository.findAll();

        Assertions.assertThat(tipoDocumentoList).isNotNull();
        Assertions.assertThat(tipoDocumentoList.size()).isEqualTo(1);
    }
}