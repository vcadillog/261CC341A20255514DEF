package isw.sigconbackend.service;

import isw.sigconbackend.dto.FacturasRequest;
import isw.sigconbackend.dto.FacturasResponse;
import isw.sigconbackend.model.Facturas;
import isw.sigconbackend.repository.FacturasRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FacturasService {
    @Autowired
    FacturasRepository facturasRepository;

    public List<FacturasResponse> getFacturas() {
        return FacturasResponse.fromEntities(facturasRepository.findAll());
    }

    public FacturasResponse findFactura(Long id) {
        return FacturasResponse.fromEntity(facturasRepository.findById(id).get());
    }

    public FacturasResponse insertFactura(FacturasRequest facturasRequest) {
        Facturas factura = FacturasRequest.toEntity(facturasRequest);
        factura.setTotal(factura.getSubtotal().subtract(factura.getIgv()));
        factura.setCreatedAt(java.time.LocalDateTime.now());
        factura.setUpdatedAt(java.time.LocalDateTime.now());
        Facturas newFactura = facturasRepository.save(factura);
        return FacturasResponse.fromEntity(newFactura);
    }

    public FacturasResponse updateFactura(FacturasRequest facturasRequest) {
        Facturas factura = FacturasRequest.toEntity(facturasRequest);
        factura.setTotal(factura.getSubtotal().subtract(factura.getIgv()));
        factura.setUpdatedAt(java.time.LocalDateTime.now());
        factura = facturasRepository.save(factura);
        return FacturasResponse.fromEntity(factura);
    }

    public void deleteFactura(Long id) {
        facturasRepository.deleteById(id);
    }
}
