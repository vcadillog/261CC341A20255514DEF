import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { LoginRequest } from '../model/login-request';
import { RegistroRequest } from '../model/registro-request';
import { CambioPasswordRequest } from '../model/cambio-password-request';
import { UsuarioResponse } from '../model/usuario-response';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  private http = inject(HttpClient);

  login(request: LoginRequest): Observable<UsuarioResponse> {
    return this.http.post<UsuarioResponse>(`${environment.url}/auth/login`, request);
  }

  registrar(request: RegistroRequest): Observable<UsuarioResponse> {
    return this.http.post<UsuarioResponse>(`${environment.url}/auth/registro`, request);
  }

  cambiarPassword(request: CambioPasswordRequest): Observable<UsuarioResponse> {
    return this.http.put<UsuarioResponse>(`${environment.url}/auth/password`, request);
  }
}
