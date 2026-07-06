package isw.sigconbackend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CambioPasswordRequest {
    private String username;
    private String currentPassword;
    private String newPassword;
}
