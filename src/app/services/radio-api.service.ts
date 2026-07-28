import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { CatalogQuery, PagedResponse, RadioModelSummary } from '../models/radio-catalog';
import { Observable } from 'rxjs';
import { RadioModelDetail, RadioSpecResponse } from '../models/radio-detail';
import { Brand } from '../models/brand';
import { RadioModelRequest } from '../models/radio-request';
import { RadioSpecRequest } from '../models/spec-request';

@Injectable({
  providedIn: 'root',
})
export class RadioApiService {
  private readonly radioBaseUrl = 'http://localhost:8080/api/radios';
  private readonly brandBaseUrl = 'http://localhost:8080/api/brands';

  constructor(private http: HttpClient) {}

  getCatalog(query: CatalogQuery = {}): Observable<PagedResponse<RadioModelSummary>> {
    let params = new HttpParams();

    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params = params.set(key, value.toString());
      }
    });

    return this.http.get<PagedResponse<RadioModelSummary>>(`${this.radioBaseUrl}/catalog`, { params });
  }

  getRadioDetails(id: number): Observable<RadioModelDetail> {
    return this.http.get<RadioModelDetail>(`${this.radioBaseUrl}/${id}/details`);
  }

  getBrand(): Observable<Brand[]> {
    return this.http.get<Brand[]>(this.brandBaseUrl);
  }

  createRadioModel(
    request: RadioModelRequest
  ): Observable<{ id: number }> {
    return this.http.post<{ id: number }>(this.radioBaseUrl, request);
  }

  addRadioSpec(
    radioId: number,
    request: RadioSpecRequest
  ): Observable<RadioSpecResponse> {
    return this.http.post<RadioSpecResponse>(
      `${this.radioBaseUrl}/${radioId}/specs`,
      request
    );
  }
}
