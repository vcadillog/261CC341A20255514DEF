import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private authService = inject(AuthService);
  private router = inject(Router);

  errorMessage: string = '';

  loginForm = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  });

  submit(): void {
    this.errorMessage = '';

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const { username, password } = this.loginForm.value;

    this.authService.login(username ?? '', password ?? '').subscribe({
      next: (ok) => {
        if (ok) {
          this.router.navigate(['/home']);
        } else {
          this.errorMessage = 'Usuario o contraseña inválidos.';
        }
      },
      error: (err) => {
        console.error('Error al iniciar sesión', err);
        this.errorMessage = 'No se pudo conectar con el servidor. Intente nuevamente.';
      },
    });
  }
}
