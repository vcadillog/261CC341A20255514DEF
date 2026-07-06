import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { FacturasRequest } from '../model/facturas-request';
import { FacturasResponse } from '../model/facturas-response';

@Injectable({
  providedIn: 'root',
})
export class FacturasService {
  private http = inject(HttpClient);

  getFacturas(): Observable<FacturasResponse[]> {
    return this.http.get<FacturasResponse[]>(`${environment.url}/facturas`);
  }

  registrarFactura(factura: FacturasRequest): Observable<FacturasResponse> {
    return this.http.post<FacturasResponse>(`${environment.url}/facturas`, factura);
  }

  actualizarFactura(factura: FacturasRequest): Observable<FacturasResponse> {
    return this.http.put<FacturasResponse>(`${environment.url}/facturas`, factura);
  }

  eliminarFactura(id: number): Observable<FacturasResponse> {
    return this.http.delete<FacturasResponse>(`${environment.url}/facturas/${id}`);
  }
}
