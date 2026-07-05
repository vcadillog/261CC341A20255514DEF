import { Component, inject } from '@angular/core';
import {
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { UsuarioService } from '../../services/usuario.service';
import { RegistroRequest } from '../../model/registro-request';

function passwordsMatchValidator(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password')?.value;
  const confirmPassword = control.get('confirmPassword')?.value;
  return password === confirmPassword ? null : { passwordsMismatch: true };
}

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  private usuarioService = inject(UsuarioService);
  private router = inject(Router);

  errorMessage: string = '';
  successMessage: string = '';

  registerForm = new FormGroup(
    {
      username: new FormControl('', [Validators.required, Validators.minLength(4)]),
      nombre: new FormControl('', [Validators.required, Validators.minLength(2)]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      confirmPassword: new FormControl('', [Validators.required]),
    },
    { validators: passwordsMatchValidator }
  );

  submit(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const { username, nombre, password } = this.registerForm.value;
    const request: RegistroRequest = {
      username: username ?? '',
      nombre: nombre ?? '',
      password: password ?? '',
    };

    this.usuarioService.registrar(request).subscribe({
      next: () => {
        this.successMessage = 'Cuenta creada. Ya puedes iniciar sesión.';
        setTimeout(() => this.router.navigate(['/login']), 1200);
      },
      error: (err) => {
        if (err.status === 409) {
          this.errorMessage = 'Ese nombre de usuario ya está en uso.';
        } else {
          console.error('Error al registrar usuario', err);
          this.errorMessage = 'No se pudo completar el registro. Intente nuevamente.';
        }
      },
    });
  }
}
