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
import java.util.List;
import java.util.stream.Collectors;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FacturasResponse {
    private Long idFactura;
    private String serie;
    private String numero;
    private LocalDate fechaEmision;
    private LocalDate fechaVencimiento;
    private BigDecimal subtotal;
    private BigDecimal igv;
    private BigDecimal total;
    private String estado;
    private Persona persona;
    private Usuario usuario;

    public static FacturasResponse fromEntity(Facturas factura) {
        return FacturasResponse.builder()
                .idFactura(factura.getIdFactura())
                .serie(factura.getSerie())
                .numero(factura.getNumero())
                .fechaEmision(factura.getFechaEmision())
                .fechaVencimiento(factura.getFechaVencimiento())
                .subtotal(factura.getSubtotal())
                .igv(factura.getIgv())
                .total(factura.getTotal())
                .estado(factura.getEstado())
                .persona(factura.getPersona())
                .usuario(factura.getUsuario())
                .build();
    }

    public static List<FacturasResponse> fromEntities(List<Facturas> facturas) {
        return facturas.stream()
                .map(FacturasResponse::fromEntity)
                .collect(Collectors.toList());
    }
}
