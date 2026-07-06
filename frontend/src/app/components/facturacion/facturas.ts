import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FacturasService } from '../../services/facturas.service';
import { FacturasRequest } from '../../model/facturas-request';
import { FacturasResponse } from '../../model/facturas-response';
import { PersonaService } from '../../services/persona.service';
import { PersonaResponse } from '../../model/persona-response';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-facturas',
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './facturas.html',
  styleUrl: './facturas.css',
})
export class Facturas implements OnInit {
  private facturasService = inject(FacturasService);
  private personaService = inject(PersonaService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  facturasResponse: FacturasResponse[] = [];
  facturasRequest: FacturasRequest = {} as FacturasRequest;
  facturasForm: FormGroup;
  personas: PersonaResponse[] = [];
  isEdited: boolean = false;

  constructor() {
    this.facturasForm = new FormGroup({
      idFactura: new FormControl(''),
      serie: new FormControl('', [Validators.required]),
      numero: new FormControl('', [Validators.required]),
      fechaEmision: new FormControl('', [Validators.required]),
      fechaVencimiento: new FormControl(''),
      subtotal: new FormControl('', [Validators.required]),
      igv: new FormControl('', [Validators.required]),
      total: new FormControl({ value: '', disabled: true }),
      estado: new FormControl('EMITIDA', [Validators.required]),
      idPersona: new FormControl('', [Validators.required]),
    });

    this.facturasForm.get('subtotal')?.valueChanges.subscribe(() => this.calcularTotal());
    this.facturasForm.get('igv')?.valueChanges.subscribe(() => this.calcularTotal());
  }

  calcularTotal(): void {
    const subtotal = parseFloat(this.facturasForm.get('subtotal')?.value) || 0;
    const igv = parseFloat(this.facturasForm.get('igv')?.value) || 0;
    const total = subtotal - igv;
    this.facturasForm.get('total')?.setValue(total.toFixed(2), { emitEvent: false });
  }

  ngOnInit(): void {
    this.getPersonas();
    this.getFacturas();
  }

  getFacturas(): void {
    this.facturasService.getFacturas().subscribe(
      (result: FacturasResponse[]) => {
        console.log('getFacturas', result);
        this.facturasResponse = result;
        this.cdr.detectChanges();
      }
    );
  }

  getPersonas(): void {
    this.personaService.getPersona().subscribe(
      (result: PersonaResponse[]) => {
        console.log('getPersonas', result);
        this.personas = result;
        this.cdr.detectChanges();
      }
    );
  }

  registrarFactura(): void {
    if (this.facturasForm.invalid) {
      this.facturasForm.markAllAsTouched();
      return;
    }

    const formValue = this.facturasForm.getRawValue();
    this.facturasRequest = {
      idFactura: formValue.idFactura ? Number(formValue.idFactura) : null as any,
      serie: formValue.serie,
      numero: formValue.numero,
      fechaEmision: formValue.fechaEmision,
      fechaVencimiento: formValue.fechaVencimiento,
      subtotal: formValue.subtotal,
      igv: formValue.igv,
      total: formValue.total,
      estado: formValue.estado,
      idPersona: Number(formValue.idPersona),
      idUsuario: 1,
    };

    if (this.isEdited) {
      this.facturasService.actualizarFactura(this.facturasRequest).subscribe({
        next: () => {
          this.getFacturas();
          this.refreshForm();
        },
        error: (err) => console.error('Error al actualizar factura', err),
      });
    } else {
      this.facturasService.registrarFactura(this.facturasRequest).subscribe({
        next: () => {
          this.getFacturas();
          this.refreshForm();
        },
        error: (err) => console.error('Error al registrar factura', err),
      });
    }
  }

  editarFactura(factura: FacturasResponse): void {
    this.isEdited = true;
    this.facturasForm.patchValue({
      idFactura: factura.idFactura,
      serie: factura.serie,
      numero: factura.numero,
      fechaEmision: factura.fechaEmision,
      fechaVencimiento: factura.fechaVencimiento,
      subtotal: factura.subtotal,
      igv: factura.igv,
      total: factura.total,
      estado: factura.estado,
      idPersona: factura.persona?.idPersona,
    });
  }

  eliminarFactura(factura: FacturasResponse): void {
    if (!confirm('¿Eliminar factura ' + factura.serie + '-' + factura.numero + '?')) return;
    this.facturasService.eliminarFactura(factura.idFactura).subscribe({
      next: () => {
        this.facturasResponse = this.facturasResponse.filter(f => f.idFactura !== factura.idFactura);
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al eliminar factura', err);
        alert('Error al eliminar factura: ' + (err.error?.message || err.message));
      },
    });
  }

  refreshForm(): void {
    this.isEdited = false;
    this.facturasForm.reset({
      idFactura: '',
      serie: '',
      numero: '',
      fechaEmision: '',
      fechaVencimiento: '',
      subtotal: '',
      igv: '',
      estado: 'EMITIDA',
      idPersona: '',
    });
    this.facturasForm.get('total')?.disable();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
