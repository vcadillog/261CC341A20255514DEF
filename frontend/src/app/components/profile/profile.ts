import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { PersonaService } from '../../services/persona.service';
import { UsuarioService } from '../../services/usuario.service';
import { SexoService } from '../../services/sexo.service';
import { TipoDocumentoService } from '../../services/tipo-documento.service';
import { UbigeoService } from '../../services/ubigeo.service';
import { Sexo } from '../../model/sexo';
import { TipoDocumento } from '../../model/tipo-documento';
import { Ubigeo } from '../../model/ubigeo';
import { PersonaRequest } from '../../model/persona-request';
import { CambioPasswordRequest } from '../../model/cambio-password-request';

function passwordsMatchValidator(control: AbstractControl): ValidationErrors | null {
  const password = control.get('newPassword')?.value;
  const confirm = control.get('confirmPassword')?.value;
  return password === confirm ? null : { passwordsMismatch: true };
}

@Component({
  selector: 'app-profile',
  imports: [RouterLink, ReactiveFormsModule, CommonModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile implements OnInit {
  private authService = inject(AuthService);
  private personaService = inject(PersonaService);
  private usuarioService = inject(UsuarioService);
  private sexoService = inject(SexoService);
  private tipoDocumentoService = inject(TipoDocumentoService);
  private ubigeoService = inject(UbigeoService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  nombre = this.authService.currentNombre;
  username = this.authService.currentUsername;
  persona = this.authService.currentPersona;

  editing = false;
  saving = false;
  errorMessage = '';
  sexo: Sexo[] = [];
  tipoDocumento: TipoDocumento[] = [];
  ubigeo: Ubigeo[] = [];

  editForm = new FormGroup({
    apellidoPaterno: new FormControl('', [Validators.required, Validators.minLength(2)]),
    apellidoMaterno: new FormControl('', [Validators.required, Validators.minLength(2)]),
    nombres: new FormControl('', [Validators.required, Validators.minLength(2)]),
    idSexo: new FormControl('I', [Validators.required]),
    fechaNacimiento: new FormControl('', [Validators.required]),
    idTipoDocumento: new FormControl('1', [Validators.required]),
    numDocumento: new FormControl('', [Validators.required, Validators.minLength(8)]),
    telefono: new FormControl('', [Validators.required, Validators.minLength(7)]),
    direccion: new FormControl('', [Validators.required, Validators.minLength(8)]),
    idUbigeo: new FormControl('150101', [Validators.required]),
  });

  showPasswordForm = false;
  savingPassword = false;
  passwordError = '';
  passwordSuccess = '';

  passwordForm = new FormGroup({
    currentPassword: new FormControl('', [Validators.required]),
    newPassword: new FormControl('', [Validators.required, Validators.minLength(6)]),
    confirmPassword: new FormControl('', [Validators.required]),
  }, { validators: passwordsMatchValidator });

  ngOnInit(): void {
    this.sexoService.getSexo().subscribe((r) => (this.sexo = r));
    this.tipoDocumentoService.getTipoDocumento().subscribe((r) => (this.tipoDocumento = r));
    this.ubigeoService.getUbigeo().subscribe((r) => (this.ubigeo = r));
  }

  startEdit(): void {
    const p = this.persona();
    if (!p) return;
    this.editForm.patchValue({
      apellidoPaterno: p.apellidoPaterno,
      apellidoMaterno: p.apellidoMaterno,
      nombres: p.nombres,
      idSexo: p.sexo?.idSexo ?? 'I',
      fechaNacimiento: p.fechaNacimiento ? String(p.fechaNacimiento).substring(0, 10) : '',
      idTipoDocumento: String(p.tipoDocumento?.idTipoDocumento ?? 1),
      numDocumento: p.numDocumento,
      telefono: p.telefono,
      direccion: p.direccion,
      idUbigeo: p.ubigeo?.idUbigeo ?? '150101',
    });
    this.errorMessage = '';
    this.editing = true;
  }

  cancelEdit(): void {
    this.editing = false;
    this.errorMessage = '';
  }

  save(): void {
    this.errorMessage = '';
    if (this.editForm.invalid) {
      this.editForm.markAllAsTouched();
      return;
    }

    const p = this.persona();
    if (!p?.idPersona) return;

    const v = this.editForm.value;
    const request: PersonaRequest = {
      idPersona: p.idPersona,
      apellidoPaterno: v.apellidoPaterno ?? '',
      apellidoMaterno: v.apellidoMaterno ?? '',
      nombres: v.nombres ?? '',
      idSexo: v.idSexo ?? 'I',
      fechaNacimiento: v.fechaNacimiento as any,
      idTipoDocumento: Number(v.idTipoDocumento ?? 1),
      numDocumento: v.numDocumento ?? '',
      telefono: v.telefono ?? '',
      direccion: v.direccion ?? '',
      idUbigeo: v.idUbigeo ?? '150101',
      username: p.username ?? '',
    };

    this.saving = true;
    this.personaService.actualizarPersona(request).subscribe({
      next: (updated) => {
        this.authService.setPersonaData(updated);
        this.saving = false;
        this.editing = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.saving = false;
        this.errorMessage = err.error?.message || 'Error al actualizar perfil.';
        this.cdr.detectChanges();
      },
    });
  }

  togglePasswordForm(): void {
    this.showPasswordForm = !this.showPasswordForm;
    this.passwordError = '';
    this.passwordSuccess = '';
    if (!this.showPasswordForm) {
      this.passwordForm.reset();
    }
  }

  savePassword(): void {
    this.passwordError = '';
    this.passwordSuccess = '';

    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      return;
    }

    const u = this.username();
    if (!u) return;

    const v = this.passwordForm.value;
    const request: CambioPasswordRequest = {
      username: u,
      currentPassword: v.currentPassword ?? '',
      newPassword: v.newPassword ?? '',
    };

    this.savingPassword = true;
    this.usuarioService.cambiarPassword(request).subscribe({
      next: () => {
        this.savingPassword = false;
        this.passwordSuccess = 'Contraseña actualizada correctamente.';
        this.passwordForm.reset();
        this.authService.loadPersona();
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.savingPassword = false;
        if (err.status === 401) {
          this.passwordError = 'La contraseña actual no es correcta.';
        } else {
          this.passwordError = err.error?.message || 'Error al cambiar contraseña.';
        }
        this.cdr.detectChanges();
      },
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
