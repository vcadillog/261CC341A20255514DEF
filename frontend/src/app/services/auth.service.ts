import { Injectable, inject, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { tap, map, catchError, of } from 'rxjs';
import { UsuarioService } from './usuario.service';
import { LoginRequest } from '../model/login-request';

const STORAGE_KEY = 'sigcon_logged_in';
const USERNAME_KEY = 'sigcon_username';
const NOMBRE_KEY = 'sigcon_nombre';
const ID_USUARIO_KEY = 'sigcon_id_usuario';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private usuarioService = inject(UsuarioService);

  // Reactive flag components can read to show/hide UI
  isLoggedIn = signal<boolean>(localStorage.getItem(STORAGE_KEY) === 'true');
  currentUsername = signal<string | null>(localStorage.getItem(USERNAME_KEY));
  currentNombre = signal<string | null>(localStorage.getItem(NOMBRE_KEY));
  currentIdUsuario = signal<number | null>(
    localStorage.getItem(ID_USUARIO_KEY)
      ? Number(localStorage.getItem(ID_USUARIO_KEY))
      : null
  );

  /**
   * Calls POST /api/v1/auth/login. Emits true on success, false on invalid
   * credentials (401), and re-throws any other error (e.g. network/server
   * issues) so the component can show a generic error message.
   */
  login(username: string, password: string): Observable<boolean> {
    const request: LoginRequest = { username, password };
    return this.usuarioService.login(request).pipe(
      tap((usuario) => {
        localStorage.setItem(STORAGE_KEY, 'true');
        localStorage.setItem(USERNAME_KEY, usuario.username);
        localStorage.setItem(NOMBRE_KEY, usuario.nombre);
        localStorage.setItem(ID_USUARIO_KEY, String(usuario.idUsuario));
        this.isLoggedIn.set(true);
        this.currentUsername.set(usuario.username);
        this.currentNombre.set(usuario.nombre);
        this.currentIdUsuario.set(usuario.idUsuario);
      }),
      map(() => true),
      catchError((err) => {
        if (err.status === 401) {
          return of(false);
        }
        throw err;
      })
    );
  }

  logout(): void {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(USERNAME_KEY);
    localStorage.removeItem(NOMBRE_KEY);
    localStorage.removeItem(ID_USUARIO_KEY);
    this.isLoggedIn.set(false);
    this.currentUsername.set(null);
    this.currentNombre.set(null);
    this.currentIdUsuario.set(null);
  }
}
