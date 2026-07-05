package isw.sigconbackend.service;

import isw.sigconbackend.model.TipoDocumento;
import isw.sigconbackend.repository.TipoDocumentoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TipoDocumentoService {
    @Autowired
    TipoDocumentoRepository tipoDocumentoRepository;

    public List<TipoDocumento> getTipoDocumento(){
        return tipoDocumentoRepository.findAll();
    }
}
