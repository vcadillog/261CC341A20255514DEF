import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { Home } from './home';
import { AuthService } from '../../services/auth.service';

describe('Home', () => {
  let component: Home;
  let fixture: any;
  let mockAuthService: any;

  beforeEach(async () => {
    mockAuthService = {
      logout: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [Home],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: mockAuthService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Home);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call authService.logout and navigate to /login on logout', () => {
    const router = TestBed.inject(Router);
    const navigateSpy = vi.spyOn(router, 'navigate');
    component.logout();
    expect(mockAuthService.logout).toHaveBeenCalled();
    expect(navigateSpy).toHaveBeenCalledWith(['/login']);
  });
});
