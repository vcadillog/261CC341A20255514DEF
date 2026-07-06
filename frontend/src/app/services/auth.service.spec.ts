import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { UsuarioService } from './usuario.service';
import { PersonaService } from './persona.service';
import { of, throwError } from 'rxjs';
import { environment } from '../../environments/environment';

describe('AuthService', () => {
  let service: AuthService;
  let httpTesting: HttpTestingController;
  let mockPersonaService: any;

  const mockUsuarioResponse = {
    idUsuario: 1,
    username: 'testuser',
    nombre: 'Test User',
    password: '',
  };

  const mockPersonaResponse = {
    idPersona: 1,
    apellidoPaterno: 'Test',
    apellidoMaterno: 'User',
    nombres: 'Test User',
    sexo: { idSexo: 'M', descripcion: 'Masculino' },
    fechaNacimiento: '1990-01-01',
    numDocumento: '12345678',
    telefono: '999999999',
    direccion: 'Calle Test',
    tipoDocumento: { idTipoDocumento: 1, descripcion: 'DNI' },
    ubigeo: { idUbigeo: '150101', departamento: 'Lima', provincia: 'Lima', distrito: 'Lima' },
  };

  beforeEach(() => {
    mockPersonaService = {
      getPersonaByUsername: vi.fn().mockReturnValue(of(mockPersonaResponse)),
    };

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        AuthService,
        { provide: PersonaService, useValue: mockPersonaService },
      ],
    });

    service = TestBed.inject(AuthService);
    httpTesting = TestBed.inject(HttpTestingController);

    localStorage.clear();
  });

  afterEach(() => {
    httpTesting.verify();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return false and not login when credentials are invalid (401)', () => {
    let result: boolean | undefined;
    service.login('bad', 'bad').subscribe((r) => (result = r));

    const req = httpTesting.expectOne(`${environment.url}/auth/login`);
    expect(req.request.method).toBe('POST');
    req.flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });

    expect(result).toBe(false);
    expect(service.isLoggedIn()).toBe(false);
  });

  it('should login successfully and set signals', () => {
    let result: boolean | undefined;
    service.login('testuser', '123456').subscribe((r) => (result = r));

    const req = httpTesting.expectOne(`${environment.url}/auth/login`);
    req.flush(mockUsuarioResponse);

    expect(result).toBe(true);
    expect(service.isLoggedIn()).toBe(true);
    expect(service.currentUsername()).toBe('testuser');
    expect(service.currentNombre()).toBe('Test User');
    expect(service.currentIdUsuario()).toBe(1);
  });

  it('should persist login state to localStorage', () => {
    service.login('testuser', '123456').subscribe();

    const req = httpTesting.expectOne(`${environment.url}/auth/login`);
    req.flush(mockUsuarioResponse);

    expect(localStorage.getItem('sigcon_logged_in')).toBe('true');
    expect(localStorage.getItem('sigcon_username')).toBe('testuser');
    expect(localStorage.getItem('sigcon_nombre')).toBe('Test User');
    expect(localStorage.getItem('sigcon_id_usuario')).toBe('1');
  });

  it('should load persona data via personaService', () => {
    service.login('testuser', '123456').subscribe();

    const req = httpTesting.expectOne(`${environment.url}/auth/login`);
    req.flush(mockUsuarioResponse);

    service.loadPersona();
    expect(mockPersonaService.getPersonaByUsername).toHaveBeenCalledWith('testuser');
    expect(service.currentPersona()).toEqual(mockPersonaResponse);
  });

  it('should set persona data', () => {
    service.setPersonaData(mockPersonaResponse as any);
    expect(service.currentPersona()).toEqual(mockPersonaResponse);
    expect(localStorage.getItem('sigcon_persona_data')).toBeTruthy();
  });

  it('should clear persona data', () => {
    service.setPersonaData(mockPersonaResponse as any);
    service.clearPersona();
    expect(service.currentPersona()).toBeNull();
    expect(localStorage.getItem('sigcon_persona_data')).toBeNull();
  });

  it('should logout and clear all state', () => {
    service.login('testuser', '123456').subscribe();
    const req = httpTesting.expectOne(`${environment.url}/auth/login`);
    req.flush(mockUsuarioResponse);

    service.logout();

    expect(service.isLoggedIn()).toBe(false);
    expect(service.currentUsername()).toBeNull();
    expect(service.currentNombre()).toBeNull();
    expect(service.currentIdUsuario()).toBeNull();
    expect(service.currentPersona()).toBeNull();
    expect(localStorage.getItem('sigcon_logged_in')).toBeNull();
  });
});
