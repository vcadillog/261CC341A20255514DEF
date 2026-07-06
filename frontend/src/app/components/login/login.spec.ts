import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { Login } from './login';
import { AuthService } from '../../services/auth.service';
import { Home } from '../home/home';
import { of, throwError } from 'rxjs';

describe('Login', () => {
  let component: Login;
  let fixture: any;
  let mockAuthService: any;

  beforeEach(async () => {
    mockAuthService = {
      login: vi.fn().mockReturnValue(of(true)),
      logout: vi.fn(),
      loadPersona: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [Login, Home],
      providers: [
        provideRouter([{ path: 'home', component: Home }]),
        { provide: AuthService, useValue: mockAuthService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Login);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have an invalid form when empty', () => {
    expect(component.loginForm.valid).toBe(false);
  });

  it('should mark fields as touched on submit with invalid form', () => {
    component.submit();
    expect(component.loginForm.get('username')?.touched).toBe(true);
    expect(component.loginForm.get('password')?.touched).toBe(true);
  });

  it('should call authService.login on valid submit', () => {
    component.loginForm.patchValue({ username: 'testuser', password: '123456' });
    component.submit();
    expect(mockAuthService.login).toHaveBeenCalledWith('testuser', '123456');
  });

  it('should navigate to /home on successful login', () => {
    const router = TestBed.inject(Router);
    const navigateSpy = vi.spyOn(router, 'navigate');
    component.loginForm.patchValue({ username: 'testuser', password: '123456' });
    component.submit();
    expect(mockAuthService.loadPersona).toHaveBeenCalled();
    expect(navigateSpy).toHaveBeenCalledWith(['/home']);
  });

  it('should set errorMessage when login returns false', () => {
    mockAuthService.login.mockReturnValue(of(false));
    component.loginForm.patchValue({ username: 'bad', password: 'bad' });
    component.submit();
    expect(component.errorMessage).toBe('Usuario o contraseña inválidos.');
  });

  it('should set errorMessage on login error', () => {
    mockAuthService.login.mockReturnValue(throwError(() => new Error('fail')));
    component.loginForm.patchValue({ username: 'error', password: 'error' });
    component.submit();
    expect(component.errorMessage).toBe('No se pudo conectar con el servidor. Intente nuevamente.');
  });

  it('should clear errorMessage before submitting', () => {
    component.errorMessage = 'some error';
    component.loginForm.patchValue({ username: 'u', password: 'p' });
    component.submit();
    expect(component.errorMessage).toBe('');
  });
});
