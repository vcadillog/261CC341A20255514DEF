import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
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
import { timeout, catchError } from 'rxjs/operators';
import { of, TimeoutError } from 'rxjs';
import { UsuarioService } from '../../services/usuario.service';
import { PersonaService } from '../../services/persona.service';
import { SexoService } from '../../services/sexo.service';
import { TipoDocumentoService } from '../../services/tipo-documento.service';
import { UbigeoService } from '../../services/ubigeo.service';
import { AuthService } from '../../services/auth.service';
import { RegistroRequest } from '../../model/registro-request';
import { PersonaRequest } from '../../model/persona-request';
import { Sexo } from '../../model/sexo';
import { TipoDocumento } from '../../model/tipo-documento';
import { Ubigeo } from '../../model/ubigeo';

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
export class Register implements OnInit {
  private usuarioService = inject(UsuarioService);
  private personaService = inject(PersonaService);
  private sexoService = inject(SexoService);
  private tipoDocumentoService = inject(TipoDocumentoService);
  private ubigeoService = inject(UbigeoService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  errorMessage: string = '';
  successMessage: string = '';
  submitting: boolean = false;
  sexo: Sexo[] = [];
  tipoDocumento: TipoDocumento[] = [];
  ubigeo: Ubigeo[] = [];

  registerForm = new FormGroup(
    {
      username: new FormControl('', [Validators.required, Validators.minLength(4)]),
      nombre: new FormControl('', [Validators.required, Validators.minLength(2)]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      confirmPassword: new FormControl('', [Validators.required]),
      apellidoPaterno: new FormControl('', [Validators.required, Validators.minLength(2)]),
      apellidoMaterno: new FormControl('', [Validators.required, Validators.minLength(2)]),
      idSexo: new FormControl('I', [Validators.required]),
      fechaNacimiento: new FormControl('', [Validators.required]),
      idTipoDocumento: new FormControl('1', [Validators.required]),
      numDocumento: new FormControl('', [Validators.required, Validators.minLength(8)]),
      telefono: new FormControl('', [Validators.required, Validators.minLength(7)]),
      direccion: new FormControl('', [Validators.required, Validators.minLength(8)]),
      idUbigeo: new FormControl('150101', [Validators.required]),
    },
    { validators: passwordsMatchValidator }
  );

  ngOnInit(): void {
    this.sexoService.getSexo().subscribe((r) => (this.sexo = r));
    this.tipoDocumentoService.getTipoDocumento().subscribe((r) => (this.tipoDocumento = r));
    this.ubigeoService.getUbigeo().subscribe((r) => (this.ubigeo = r));
  }

  submit(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (this.submitting) return;
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const { username, nombre, password, ...personaFields } = this.registerForm.value;
    const registroRequest: RegistroRequest = {
      username: username ?? '',
      nombre: nombre ?? '',
      password: password ?? '',
    };

    const personaRequest: PersonaRequest = {
      idPersona: null as any,
      apellidoPaterno: personaFields.apellidoPaterno ?? '',
      apellidoMaterno: personaFields.apellidoMaterno ?? '',
      nombres: nombre ?? '',
      idSexo: personaFields.idSexo ?? 'I',
      fechaNacimiento: personaFields.fechaNacimiento as any,
      idTipoDocumento: Number(personaFields.idTipoDocumento ?? 1),
      numDocumento: personaFields.numDocumento ?? '',
      telefono: personaFields.telefono ?? '',
      direccion: personaFields.direccion ?? '',
      idUbigeo: personaFields.idUbigeo ?? '150101',
      username: username ?? '',
    };

    this.submitting = true;
    this.cdr.detectChanges();

    const extractBody = (err: any) =>
      typeof err.error === 'string'
        ? err.error
        : err.error?.message ?? err.message ?? '';

    const done = () => {
      this.submitting = false;
      this.cdr.detectChanges();
    };

    this.usuarioService.registrar(registroRequest).pipe(timeout(10000)).subscribe({
      next: () => {
        this.personaService.registrarPersona(personaRequest).pipe(timeout(10000)).subscribe({
          next: (personaResponse) => {
            this.authService.setPersonaData(personaResponse);
            this.successMessage = 'Cuenta creada. Ya puedes iniciar sesión.';
            done();
            setTimeout(() => this.router.navigate(['/login']), 1200);
          },
          error: (err) => {
            console.error('Persona error:', err);
            const body = extractBody(err);
            if (err.status === 409 || /duplicate|violates unique constraint/i.test(body)) {
              this.errorMessage = 'Ese número de documento ya está registrado.';
            } else if (err instanceof TimeoutError) {
              this.errorMessage = 'El servidor no respondió a tiempo. Intente nuevamente.';
            } else {
              this.errorMessage = body || 'No se pudo completar el registro. Intente nuevamente.';
            }
            done();
          },
        });
      },
      error: (err) => {
        console.error('Usuario error:', err);
        if (err.status === 409) {
          this.errorMessage = 'Ese nombre de usuario ya está en uso.';
        } else if (err instanceof TimeoutError) {
          this.errorMessage = 'El servidor no respondió a tiempo. Intente nuevamente.';
        } else {
          this.errorMessage = extractBody(err) || 'No se pudo completar el registro. Intente nuevamente.';
        }
        done();
      },
    });
  }
}
