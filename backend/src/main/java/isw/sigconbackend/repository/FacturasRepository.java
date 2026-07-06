package isw.sigconbackend.repository;

import isw.sigconbackend.model.Facturas;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FacturasRepository extends JpaRepository<Facturas, Long> {
}
