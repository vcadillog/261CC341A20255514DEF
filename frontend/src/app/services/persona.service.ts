import { Injectable,inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { PersonaRequest } from '../model/persona-request';
import { PersonaResponse } from '../model/persona-response';

@Injectable({
  providedIn: 'root',
})
export class PersonaService {
  private http=inject(HttpClient)

  getPersona(): Observable<PersonaResponse[]>{
    return this.http.get<PersonaResponse[]>(`${environment.url}/persona`)
  }

  registrarPersona(persona: PersonaRequest): Observable<PersonaResponse>{
    return this.http.post<PersonaResponse>(`${environment.url}/persona`,persona)
  }

  actualizarPersona(persona: PersonaRequest): Observable<PersonaResponse>{
    return this.http.put<PersonaResponse>(`${environment.url}/persona`,persona)
  }

  eliminarPersona(persona: PersonaRequest): Observable<PersonaResponse>{
    return this.http.delete<PersonaResponse>(`${environment.url}/persona`,{
      body:persona,
    })
  }

}
