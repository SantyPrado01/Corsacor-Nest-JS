import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FacturaService {

  private apiUrl = 'http://localhost:3000/facturas'; 

  constructor(private http: HttpClient) { }

  crearFactura(factura: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, factura);
  }




}
