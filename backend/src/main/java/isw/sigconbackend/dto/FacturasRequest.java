package isw.sigconbackend.dto;

import isw.sigconbackend.model.Facturas;
import isw.sigconbackend.model.Persona;
import isw.sigconbackend.model.Usuario;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FacturasRequest {
    private Long idFactura;
    private String serie;
    private String numero;
    private String fechaEmision;
    private String fechaVencimiento;
    private String subtotal;
    private String igv;
    private String total;
    private String estado;
    private Long idPersona;
    private Long idUsuario;

    public static Facturas toEntity(FacturasRequest request) {
        Facturas factura = new Facturas();
        if (request.getIdFactura() != null && request.getIdFactura() > 0)
            factura.setIdFactura(request.getIdFactura());
        else
            factura.setIdFactura(null);

        factura.setSerie(request.getSerie());
        factura.setNumero(request.getNumero());
        factura.setFechaEmision(LocalDate.parse(request.getFechaEmision()));
        if (request.getFechaVencimiento() != null)
            factura.setFechaVencimiento(LocalDate.parse(request.getFechaVencimiento()));
        factura.setSubtotal(new BigDecimal(request.getSubtotal()));
        factura.setIgv(new BigDecimal(request.getIgv()));
        factura.setTotal(new BigDecimal(request.getTotal()));
        factura.setEstado(request.getEstado());
        if (request.getIdPersona() != null)
            factura.setPersona(Persona.builder().idPersona(request.getIdPersona()).build());
        if (request.getIdUsuario() != null)
            factura.setUsuario(Usuario.builder().idUsuario(request.getIdUsuario()).build());
        return factura;
    }
}
