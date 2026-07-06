import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { PersonaService } from './persona.service';
import { environment } from '../../environments/environment';

describe('PersonaService', () => {
  let service: PersonaService;
  let httpTesting: HttpTestingController;

  const mockPersonas = [
    {
      idPersona: 1,
      apellidoPaterno: 'Test',
      apellidoMaterno: 'User',
      nombres: 'Test User',
      sexo: { idSexo: 'M', descripcion: 'Masculino' },
      fechaNacimiento: '1990-01-01',
      numDocumento: '12345678',
      telefono: '999999999',
      direccion: 'Calle Test',
      tipoDocumento: { idTipoDocumento: 1, descripcion: 'DNI' },
      ubigeo: { idUbigeo: '150101', departamento: 'Lima', provincia: 'Lima', distrito: 'Lima' },
    },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        PersonaService,
      ],
    });

    service = TestBed.inject(PersonaService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should GET personas via getPersona()', () => {
    service.getPersona().subscribe((personas) => {
      expect(personas.length).toBe(1);
      expect(personas[0].nombres).toBe('Test User');
    });

    const req = httpTesting.expectOne(`${environment.url}/persona`);
    expect(req.request.method).toBe('GET');
    req.flush(mockPersonas);
  });

  it('should POST via registrarPersona()', () => {
    const request = {
      idPersona: undefined as any,
      apellidoPaterno: 'New',
      apellidoMaterno: 'Person',
      nombres: 'New Person',
      idSexo: 'M',
      fechaNacimiento: new Date('2000-01-01'),
      idTipoDocumento: 1,
      numDocumento: '87654321',
      telefono: '888888888',
      direccion: 'Calle New 123',
      idUbigeo: '150101',
    };

    service.registrarPersona(request).subscribe((response) => {
      expect(response).toEqual(mockPersonas[0]);
    });

    const req = httpTesting.expectOne(`${environment.url}/persona`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(request);
    req.flush(mockPersonas[0]);
  });

  it('should GET by username via getPersonaByUsername()', () => {
    service.getPersonaByUsername('testuser').subscribe((persona) => {
      expect(persona.nombres).toBe('Test User');
    });

    const req = httpTesting.expectOne(`${environment.url}/persona/username/testuser`);
    expect(req.request.method).toBe('GET');
    req.flush(mockPersonas[0]);
  });

  it('should PUT via actualizarPersona()', () => {
    const request = {
      idPersona: 1,
      apellidoPaterno: 'Updated',
      apellidoMaterno: 'Person',
      nombres: 'Updated Person',
      idSexo: 'M',
      fechaNacimiento: new Date('2000-01-01'),
      idTipoDocumento: 1,
      numDocumento: '87654321',
      telefono: '888888888',
      direccion: 'Calle Updated 456',
      idUbigeo: '150101',
    };

    service.actualizarPersona(request).subscribe((response) => {
      expect(response).toEqual(mockPersonas[0]);
    });

    const req = httpTesting.expectOne(`${environment.url}/persona`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(request);
    req.flush(mockPersonas[0]);
  });

  it('should DELETE via eliminarPersona()', () => {
    const request = { idPersona: 1 } as any;

    service.eliminarPersona(request).subscribe((response) => {
      expect(response).toEqual(mockPersonas[0]);
    });

    const req = httpTesting.expectOne(`${environment.url}/persona`);
    expect(req.request.method).toBe('DELETE');
    expect(req.request.body).toEqual(request);
    req.flush(mockPersonas[0]);
  });
});
