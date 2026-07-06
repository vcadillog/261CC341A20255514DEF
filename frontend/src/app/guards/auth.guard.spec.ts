import { TestBed } from '@angular/core/testing';
import { Router, provideRouter, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { authGuard } from './auth.guard';

describe('authGuard', () => {
  let mockAuthService: any;

  beforeEach(() => {
    mockAuthService = {
      isLoggedIn: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: mockAuthService },
      ],
    });
  });

  it('should allow activation when user is logged in', () => {
    mockAuthService.isLoggedIn.mockReturnValue(true);
    const route = {} as ActivatedRouteSnapshot;
    const state = {} as RouterStateSnapshot;
    const result = TestBed.runInInjectionContext(() => authGuard(route, state));
    expect(result).toBe(true);
  });

  it('should navigate to /login when user is not logged in', () => {
    mockAuthService.isLoggedIn.mockReturnValue(false);
    const router = TestBed.inject(Router);
    const navigateSpy = vi.spyOn(router, 'navigate');
    const route = {} as ActivatedRouteSnapshot;
    const state = {} as RouterStateSnapshot;
    const result = TestBed.runInInjectionContext(() => authGuard(route, state));
    expect(result).toBe(false);
    expect(navigateSpy).toHaveBeenCalledWith(['/login']);
  });
});
