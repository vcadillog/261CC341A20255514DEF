package isw.eleccionbackend.repository;

import isw.eleccionbackend.model.ResultadoElectoral;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ResultadoElectoralRepository extends JpaRepository<ResultadoElectoral, Long> {
}
