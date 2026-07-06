import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { Profile } from './profile';
import { AuthService } from '../../services/auth.service';
import { PersonaService } from '../../services/persona.service';
import { UsuarioService } from '../../services/usuario.service';
import { SexoService } from '../../services/sexo.service';
import { TipoDocumentoService } from '../../services/tipo-documento.service';
import { UbigeoService } from '../../services/ubigeo.service';
import { of, throwError } from 'rxjs';
import { Sexo } from '../../model/sexo';
import { TipoDocumento } from '../../model/tipo-documento';
import { Ubigeo } from '../../model/ubigeo';
import { PersonaResponse } from '../../model/persona-response';

describe('Profile', () => {
  let component: Profile;
  let fixture: any;
  let mockPersonaService: any;
  let mockUsuarioService: any;
  let mockAuthService: any;

  const mockSexos: Sexo[] = [{ idSexo: 'M', descripcion: 'Masculino' }];
  const mockTiposDoc: TipoDocumento[] = [{ idTipoDocumento: 1, descripcion: 'DNI' }];
  const mockUbigeos: Ubigeo[] = [{ idUbigeo: '150101', departamento: 'Lima', provincia: 'Lima', distrito: 'Lima' }];
  const mockPersona: PersonaResponse = {
    idPersona: 1,
    apellidoPaterno: 'Test',
    apellidoMaterno: 'User',
    nombres: 'Test User',
    sexo: mockSexos[0],
    fechaNacimiento: new Date('1990-01-01'),
    numDocumento: '12345678',
    telefono: '999999999',
    direccion: 'Calle Test 123',
    tipoDocumento: mockTiposDoc[0],
    ubigeo: mockUbigeos[0],
    username: 'testuser',
  };

  beforeEach(async () => {
    const currentPersonaSignal = signal<PersonaResponse | null>(mockPersona);

    mockAuthService = {
      currentNombre: signal('Test User'),
      currentUsername: signal('testuser'),
      currentPersona: currentPersonaSignal,
      setPersonaData: vi.fn(),
      loadPersona: vi.fn(),
      logout: vi.fn(),
    };

    mockPersonaService = {
      actualizarPersona: vi.fn().mockReturnValue(of(mockPersona)),
    };

    mockUsuarioService = {
      cambiarPassword: vi.fn().mockReturnValue(of({})),
    };

    await TestBed.configureTestingModule({
      imports: [Profile],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: mockAuthService },
        { provide: PersonaService, useValue: mockPersonaService },
        { provide: UsuarioService, useValue: mockUsuarioService },
        { provide: SexoService, useValue: { getSexo: () => of(mockSexos) } },
        { provide: TipoDocumentoService, useValue: { getTipoDocumento: () => of(mockTiposDoc) } },
        { provide: UbigeoService, useValue: { getUbigeo: () => of(mockUbigeos) } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Profile);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load reference data on init', () => {
    expect(component.sexo.length).toBe(1);
    expect(component.tipoDocumento.length).toBe(1);
    expect(component.ubigeo.length).toBe(1);
  });

  it('should display user info from authService signals', () => {
    expect(component.nombre()).toBe('Test User');
    expect(component.username()).toBe('testuser');
    expect(component.persona()).toEqual(mockPersona);
  });

  it('should start editing and populate form with persona data', () => {
    component.startEdit();
    expect(component.editing).toBe(true);
    expect(component.editForm.get('apellidoPaterno')?.value).toBe('Test');
    expect(component.editForm.get('nombres')?.value).toBe('Test User');
  });

  it('should cancel editing', () => {
    component.startEdit();
    expect(component.editing).toBe(true);
    component.cancelEdit();
    expect(component.editing).toBe(false);
    expect(component.errorMessage).toBe('');
  });

  it('should save profile and call actualizarPersona', () => {
    component.startEdit();
    component.save();
    expect(mockPersonaService.actualizarPersona).toHaveBeenCalled();
    expect(mockAuthService.setPersonaData).toHaveBeenCalledWith(mockPersona);
    expect(component.editing).toBe(false);
  });

  it('should toggle password form', () => {
    expect(component.showPasswordForm).toBe(false);
    component.togglePasswordForm();
    expect(component.showPasswordForm).toBe(true);
    component.togglePasswordForm();
    expect(component.showPasswordForm).toBe(false);
  });

  it('should save password and call cambiarPassword', () => {
    component.togglePasswordForm();
    component.passwordForm.patchValue({
      currentPassword: 'oldpass',
      newPassword: 'newpass123',
      confirmPassword: 'newpass123',
    });
    component.savePassword();
    expect(mockUsuarioService.cambiarPassword).toHaveBeenCalled();
    expect(component.passwordSuccess).toBe('Contraseña actualizada correctamente.');
  });

  it('should set passwordError on 401 response', () => {
    mockUsuarioService.cambiarPassword.mockReturnValue(
      throwError(() => ({ status: 401 }))
    );
    component.togglePasswordForm();
    component.passwordForm.patchValue({
      currentPassword: 'wrong',
      newPassword: 'newpass123',
      confirmPassword: 'newpass123',
    });
    component.savePassword();
    expect(component.passwordError).toBe('La contraseña actual no es correcta.');
  });

  it('should logout and navigate to /login', () => {
    const router = TestBed.inject(Router);
    vi.spyOn(router, 'navigate');
    component.logout();
    expect(mockAuthService.logout).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });
});
