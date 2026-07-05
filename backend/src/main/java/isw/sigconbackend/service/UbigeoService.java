package isw.sigconbackend.service;

import isw.sigconbackend.model.Sexo;
import isw.sigconbackend.model.Ubigeo;
import isw.sigconbackend.repository.UbigeoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UbigeoService {
    @Autowired
    UbigeoRepository ubigeoRepository;
    public List<Ubigeo> getUbigeo(){
        return ubigeoRepository.findAll();
    }
}
