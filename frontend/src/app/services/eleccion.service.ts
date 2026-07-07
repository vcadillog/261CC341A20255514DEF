import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { timeout } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { ResultadoElectoralResponse } from '../model/resultado-electoral-response';

@Injectable({
  providedIn: 'root',
})
export class EleccionService {
  private http = inject(HttpClient);

  getResultados(): Observable<ResultadoElectoralResponse[]> {
    return this.http.get<ResultadoElectoralResponse[]>(`${environment.eleccionUrl}/resultado-electoral`).pipe(timeout(10000));
  }
}
