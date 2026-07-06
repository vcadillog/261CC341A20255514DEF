import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { Facturas } from './facturas';
import { FacturasService } from '../../services/facturas.service';
import { PersonaService } from '../../services/persona.service';
import { AuthService } from '../../services/auth.service';
import { of, throwError } from 'rxjs';
import { FacturasResponse } from '../../model/facturas-response';
import { PersonaResponse } from '../../model/persona-response';

describe('Facturas', () => {
  let component: Facturas;
  let fixture: any;
  let mockFacturasService: any;
  let mockPersonaService: any;
  let mockAuthService: any;

  const mockPersona: PersonaResponse = {
    idPersona: 1,
    apellidoPaterno: 'Test',
    apellidoMaterno: 'User',
    nombres: 'Test',
    sexo: { idSexo: 'M', descripcion: 'Masculino' },
    fechaNacimiento: new Date(),
    numDocumento: '12345678',
    telefono: '999999999',
    direccion: 'Calle Test',
    tipoDocumento: { idTipoDocumento: 1, descripcion: 'DNI' },
    ubigeo: { idUbigeo: '150101', departamento: 'Lima', provincia: 'Lima', distrito: 'Lima' },
  };

  const mockFacturas: FacturasResponse[] = [
    {
      idFactura: 1,
      serie: 'F001',
      numero: '0001',
      fechaEmision: '2024-01-15',
      fechaVencimiento: '2024-02-15',
      subtotal: 1000,
      igv: 180,
      total: 820,
      estado: 'EMITIDA',
      persona: mockPersona,
      usuario: { idUsuario: 1, username: 'admin', nombre: 'Admin' },
    },
  ];

  beforeEach(async () => {
    mockFacturasService = {
      getFacturas: vi.fn().mockReturnValue(of(mockFacturas)),
      registrarFactura: vi.fn().mockReturnValue(of(mockFacturas[0])),
      actualizarFactura: vi.fn().mockReturnValue(of(mockFacturas[0])),
      eliminarFactura: vi.fn().mockReturnValue(of(mockFacturas[0])),
    };

    mockPersonaService = {
      getPersona: vi.fn().mockReturnValue(of([mockPersona])),
    };

    mockAuthService = {
      logout: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [Facturas],
      providers: [
        provideRouter([]),
        { provide: FacturasService, useValue: mockFacturasService },
        { provide: PersonaService, useValue: mockPersonaService },
        { provide: AuthService, useValue: mockAuthService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Facturas);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load facturas and personas on init', () => {
    expect(mockFacturasService.getFacturas).toHaveBeenCalled();
    expect(mockPersonaService.getPersona).toHaveBeenCalled();
    expect(component.facturasResponse.length).toBe(1);
    expect(component.personas.length).toBe(1);
  });

  it('should calculate total correctly (subtotal - igv)', () => {
    component.facturasForm.patchValue({ subtotal: '1000', igv: '180' });
    component.calcularTotal();
    expect(component.facturasForm.get('total')?.value).toBe('820.00');
  });

  it('should calculate total as 0 when fields are empty', () => {
    component.facturasForm.patchValue({ subtotal: '', igv: '' });
    component.calcularTotal();
    expect(component.facturasForm.get('total')?.value).toBe('0.00');
  });

  it('should call registrarFactura on valid submit when not editing', () => {
    component.facturasForm.patchValue({
      serie: 'F001',
      numero: '0002',
      fechaEmision: '2024-01-15',
      subtotal: '500',
      igv: '90',
      idPersona: '1',
    });
    component.isEdited = false;
    component.registrarFactura();
    expect(mockFacturasService.registrarFactura).toHaveBeenCalled();
  });

  it('should call actualizarFactura on valid submit when editing', () => {
    component.isEdited = true;
    component.facturasForm.patchValue({
      idFactura: '1',
      serie: 'F001',
      numero: '0001',
      fechaEmision: '2024-01-15',
      subtotal: '500',
      igv: '90',
      idPersona: '1',
    });
    component.registrarFactura();
    expect(mockFacturasService.actualizarFactura).toHaveBeenCalled();
  });

  it('should mark form as touched when submitting invalid form', () => {
    component.registrarFactura();
    expect(component.facturasForm.get('serie')?.touched).toBe(true);
  });

  it('should populate form when editing a factura', () => {
    component.editarFactura(mockFacturas[0]);
    expect(component.isEdited).toBe(true);
    expect(component.facturasForm.get('serie')?.value).toBe('F001');
    expect(component.facturasForm.get('numero')?.value).toBe('0001');
  });

  it('should refresh form after cancel', () => {
    component.facturasForm.patchValue({ serie: 'X' });
    component.refreshForm();
    expect(component.isEdited).toBe(false);
    expect(component.facturasForm.get('serie')?.value).toBe('');
  });

  it('should call eliminarFactura and remove from list', () => {
    window.confirm = vi.fn(() => true);
    component.eliminarFactura(mockFacturas[0]);
    expect(mockFacturasService.eliminarFactura).toHaveBeenCalledWith(1);
  });

  it('should not call eliminarFactura if confirm is cancelled', () => {
    window.confirm = vi.fn(() => false);
    component.eliminarFactura(mockFacturas[0]);
    expect(mockFacturasService.eliminarFactura).not.toHaveBeenCalled();
  });

  it('should logout and navigate to /login', () => {
    const router = TestBed.inject(Router);
    vi.spyOn(router, 'navigate');
    component.logout();
    expect(mockAuthService.logout).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });
});
