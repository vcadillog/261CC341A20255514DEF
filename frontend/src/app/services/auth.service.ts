import { Injectable, inject, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { tap, map, catchError, of } from 'rxjs';
import { UsuarioService } from './usuario.service';
import { PersonaService } from './persona.service';
import { LoginRequest } from '../model/login-request';
import { PersonaResponse } from '../model/persona-response';

const STORAGE_KEY = 'sigcon_logged_in';
const USERNAME_KEY = 'sigcon_username';
const NOMBRE_KEY = 'sigcon_nombre';
const ID_USUARIO_KEY = 'sigcon_id_usuario';
const PERSONA_DATA_KEY = 'sigcon_persona_data';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private usuarioService = inject(UsuarioService);
  private personaService = inject(PersonaService);

  isLoggedIn = signal<boolean>(localStorage.getItem(STORAGE_KEY) === 'true');
  currentUsername = signal<string | null>(localStorage.getItem(USERNAME_KEY));
  currentNombre = signal<string | null>(localStorage.getItem(NOMBRE_KEY));
  currentIdUsuario = signal<number | null>(
    localStorage.getItem(ID_USUARIO_KEY)
      ? Number(localStorage.getItem(ID_USUARIO_KEY))
      : null
  );
  currentPersona = signal<PersonaResponse | null>(
    localStorage.getItem(PERSONA_DATA_KEY)
      ? JSON.parse(localStorage.getItem(PERSONA_DATA_KEY)!)
      : null
  );

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

  loadPersona(): void {
    const u = this.currentUsername();
    if (!u) return;
    this.personaService.getPersonaByUsername(u).subscribe({
      next: (p) => this.setPersonaData(p),
      error: () => {},
    });
  }

  setPersonaData(p: PersonaResponse): void {
    localStorage.setItem(PERSONA_DATA_KEY, JSON.stringify(p));
    this.currentPersona.set(p);
  }

  clearPersona(): void {
    localStorage.removeItem(PERSONA_DATA_KEY);
    this.currentPersona.set(null);
  }

  logout(): void {
    const keys = [
      STORAGE_KEY, USERNAME_KEY, NOMBRE_KEY, ID_USUARIO_KEY, PERSONA_DATA_KEY,
    ];
    keys.forEach((k) => localStorage.removeItem(k));
    this.isLoggedIn.set(false);
    this.currentUsername.set(null);
    this.currentNombre.set(null);
    this.currentIdUsuario.set(null);
    this.currentPersona.set(null);
  }
}
