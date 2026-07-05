package isw.sigconbackend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name="ubigeo")
public class Ubigeo {
    @Id    
    @Column(name="idubigeo")
    private String idUbigeo;
    private String departamento;
    private String provincia;
    private String distrito;            
}
