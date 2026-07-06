import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { Register } from './register';
import { UsuarioService } from '../../services/usuario.service';
import { PersonaService } from '../../services/persona.service';
import { SexoService } from '../../services/sexo.service';
import { TipoDocumentoService } from '../../services/tipo-documento.service';
import { UbigeoService } from '../../services/ubigeo.service';
import { AuthService } from '../../services/auth.service';
import { of, throwError } from 'rxjs';
import { Sexo } from '../../model/sexo';
import { TipoDocumento } from '../../model/tipo-documento';
import { Ubigeo } from '../../model/ubigeo';
import { PersonaResponse } from '../../model/persona-response';

describe('Register', () => {
  let component: Register;
  let fixture: any;
  let mockUsuarioService: any;
  let mockPersonaService: any;
  let mockAuthService: any;

  const mockSexos: Sexo[] = [{ idSexo: 'M', descripcion: 'Masculino' }];
  const mockTiposDoc: TipoDocumento[] = [{ idTipoDocumento: 1, descripcion: 'DNI' }];
  const mockUbigeos: Ubigeo[] = [{ idUbigeo: '150101', departamento: 'Lima', provincia: 'Lima', distrito: 'Lima' }];
  const mockPersonaResponse: PersonaResponse = {
    idPersona: 1,
    apellidoPaterno: 'Test',
    apellidoMaterno: 'Test',
    nombres: 'Test',
    sexo: mockSexos[0],
    fechaNacimiento: new Date(),
    numDocumento: '12345678',
    telefono: '999999999',
    direccion: 'Calle Test',
    tipoDocumento: mockTiposDoc[0],
    ubigeo: mockUbigeos[0],
  };

  beforeEach(async () => {
    mockUsuarioService = {
      registrar: vi.fn().mockReturnValue(of({ idUsuario: 1, username: 'test', nombre: 'Test' })),
    };
    mockPersonaService = {
      registrarPersona: vi.fn().mockReturnValue(of(mockPersonaResponse)),
      getPersona: vi.fn().mockReturnValue(of([])),
    };
    mockAuthService = {
      setPersonaData: vi.fn(),
      logout: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [Register],
      providers: [
        provideRouter([]),
        { provide: UsuarioService, useValue: mockUsuarioService },
        { provide: PersonaService, useValue: mockPersonaService },
        { provide: SexoService, useValue: { getSexo: () => of(mockSexos) } },
        { provide: TipoDocumentoService, useValue: { getTipoDocumento: () => of(mockTiposDoc) } },
        { provide: UbigeoService, useValue: { getUbigeo: () => of(mockUbigeos) } },
        { provide: AuthService, useValue: mockAuthService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Register);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load sexo, tipoDocumento and ubigeo on init', () => {
    expect(component.sexo.length).toBe(1);
    expect(component.tipoDocumento.length).toBe(1);
    expect(component.ubigeo.length).toBe(1);
  });

  it('should have an invalid form when empty', () => {
    expect(component.registerForm.valid).toBe(false);
  });

  it('should mark all fields as touched on submit with invalid form', () => {
    component.submit();
    expect(component.registerForm.get('username')?.touched).toBe(true);
  });

  it('should call usuarioService.registrar and personaService.registrarPersona on valid submit', () => {
    component.registerForm.patchValue({
      username: 'newuser',
      nombre: 'New User',
      password: '123456',
      confirmPassword: '123456',
      apellidoPaterno: 'Test',
      apellidoMaterno: 'User',
      idSexo: 'M',
      fechaNacimiento: '2000-01-01',
      idTipoDocumento: '1',
      numDocumento: '12345678',
      telefono: '999999999',
      direccion: 'Calle Test 123',
      idUbigeo: '150101',
    });
    component.submit();
    expect(mockUsuarioService.registrar).toHaveBeenCalled();
    expect(mockPersonaService.registrarPersona).toHaveBeenCalled();
  });

  it('should set successMessage and navigate to /login after successful registration', () => {
    vi.useFakeTimers();
    const router = TestBed.inject(Router);
    vi.spyOn(router, 'navigate');
    component.registerForm.patchValue({
      username: 'newuser',
      nombre: 'New User',
      password: '123456',
      confirmPassword: '123456',
      apellidoPaterno: 'Test',
      apellidoMaterno: 'User',
      idSexo: 'M',
      fechaNacimiento: '2000-01-01',
      idTipoDocumento: '1',
      numDocumento: '12345678',
      telefono: '999999999',
      direccion: 'Calle Test 123',
      idUbigeo: '150101',
    });
    component.submit();
    expect(component.successMessage).toBe('Cuenta creada. Ya puedes iniciar sesión.');
    expect(mockAuthService.setPersonaData).toHaveBeenCalled();
    vi.advanceTimersByTime(1300);
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
    vi.useRealTimers();
  });

  it('should set errorMessage when usuario creation returns 409', () => {
    mockUsuarioService.registrar.mockReturnValue(throwError(() => ({ status: 409 })));
    component.registerForm.patchValue({
      username: 'existing',
      nombre: 'Test',
      password: '123456',
      confirmPassword: '123456',
      apellidoPaterno: 'Test',
      apellidoMaterno: 'User',
      idSexo: 'M',
      fechaNacimiento: '2000-01-01',
      idTipoDocumento: '1',
      numDocumento: '12345678',
      telefono: '999999999',
      direccion: 'Calle Test 123',
      idUbigeo: '150101',
    });
    component.submit();
    expect(component.errorMessage).toBe('Ese nombre de usuario ya está en uso.');
  });

  it('should set errorMessage when persona registration returns 409', () => {
    mockUsuarioService.registrar.mockReturnValue(of({ idUsuario: 1 }));
    mockPersonaService.registrarPersona.mockReturnValue(
      throwError(() => ({ status: 409, error: 'duplicate key value violates unique constraint' }))
    );
    component.registerForm.patchValue({
      username: 'newuser',
      nombre: 'New User',
      password: '123456',
      confirmPassword: '123456',
      apellidoPaterno: 'Test',
      apellidoMaterno: 'User',
      idSexo: 'M',
      fechaNacimiento: '2000-01-01',
      idTipoDocumento: '1',
      numDocumento: '12345678',
      telefono: '999999999',
      direccion: 'Calle Test 123',
      idUbigeo: '150101',
    });
    component.submit();
    expect(component.errorMessage).toBe('Ese número de documento ya está registrado.');
  });

  it('should set submitting flag to false after error', () => {
    mockUsuarioService.registrar.mockReturnValue(throwError(() => new Error('fail')));
    component.registerForm.patchValue({
      username: 'newuser',
      nombre: 'New User',
      password: '123456',
      confirmPassword: '123456',
      apellidoPaterno: 'Test',
      apellidoMaterno: 'User',
      idSexo: 'M',
      fechaNacimiento: '2000-01-01',
      idTipoDocumento: '1',
      numDocumento: '12345678',
      telefono: '999999999',
      direccion: 'Calle Test 123',
      idUbigeo: '150101',
    });
    component.submit();
    expect(component.submitting).toBe(false);
  });
});
