import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { RegistrarPersona } from './registrar-persona';
import { PersonaService } from '../../services/persona.service';
import { SexoService } from '../../services/sexo.service';
import { TipoDocumentoService } from '../../services/tipo-documento.service';
import { UbigeoService } from '../../services/ubigeo.service';
import { AuthService } from '../../services/auth.service';

describe('RegistrarPersona', () => {
  let component: RegistrarPersona;
  let fixture: ComponentFixture<RegistrarPersona>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistrarPersona],
      providers: [
        provideRouter([]),
        { provide: PersonaService, useValue: { getPersona: () => of([]), registrarPersona: vi.fn(() => of({})), actualizarPersona: vi.fn(() => of({})) } },
        { provide: SexoService, useValue: { getSexo: () => of([]) } },
        { provide: TipoDocumentoService, useValue: { getTipoDocumento: () => of([]) } },
        { provide: UbigeoService, useValue: { getUbigeo: () => of([]) } },
        { provide: AuthService, useValue: { logout: vi.fn() } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RegistrarPersona);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
