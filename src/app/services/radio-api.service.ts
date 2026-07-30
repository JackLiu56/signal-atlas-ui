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
  private readonly specBaseUrl = 'http://localhost:8080/api/specs';

  constructor(private http: HttpClient) {}

  getCatalog(query: CatalogQuery = {}): Observable<PagedResponse<RadioModelSummary>> {
    let params = new HttpParams();

    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params = params.set(key, value.toString());
      }
    });

    return this.http.get<PagedResponse<RadioModelSummary>>(`${this.radioBaseUrl}/catalog`, {
      params,
    });
  }

  getRadioDetails(id: number): Observable<RadioModelDetail> {
    return this.http.get<RadioModelDetail>(`${this.radioBaseUrl}/${id}/details`);
  }

  getBrands(): Observable<Brand[]> {
    return this.http.get<Brand[]>(this.brandBaseUrl);
  }

  createRadioModel(request: RadioModelRequest): Observable<{ id: number }> {
    return this.http.post<{ id: number }>(this.radioBaseUrl, request);
  }

  addRadioSpec(radioId: number, request: RadioSpecRequest): Observable<RadioSpecResponse> {
    return this.http.post<RadioSpecResponse>(`${this.radioBaseUrl}/${radioId}/specs`, request);
  }

  updateRadioSpec (
    specId: number,
    request: RadioSpecRequest
  ): Observable<RadioSpecRequest>{
    return this.http.put<RadioSpecResponse>(
      `${this.specBaseUrl}/${specId}`,
      request
    );
  }

  deleteRadioSpec(specId: number): Observable<string> {
    return this.http.delete(
      `http://localhost:8080/api/specs/${specId}`,
      {
        responseType: 'text',
      },
    );
  }

  updateRadioModel(
    id: number,
    request: RadioModelRequest
  ): Observable<{ id: number }> {
    return this.http.put<{ id: number }>(
      `${this.radioBaseUrl}/${id}`,
      request
    );
  }

  deleteRadioModel(id: number): Observable<string> {
    return this.http.delete(`${this.radioBaseUrl}/${id}`, {
      responseType: 'text',
    });
  }
}
