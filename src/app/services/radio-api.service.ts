import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { CatalogQuery, PagedResponse, RadioModelSummary } from '../models/radio-catalog';
import { Observable } from 'rxjs';
import { RadioModelDetail } from '../models/radio-detail';

@Injectable({
  providedIn: 'root',
})
export class RadioApiService {
  private readonly baseUrl = 'http://localhost:8080/api/radios';

  constructor(private http: HttpClient) {}

  getCatalog(
    query: CatalogQuery = {}
  ): Observable<PagedResponse<RadioModelSummary>> {
    let params = new HttpParams();

    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params = params.set(key, value.toString());
      }
    });

    return this.http.get<PagedResponse<RadioModelSummary>>(
      `${this.baseUrl}/catalog`,
      { params }
    );
  }

  getRadioDetails(id: number): Observable<RadioModelDetail>{
    return this.http.get<RadioModelDetail>(
      `${this.baseUrl}/${id}/details`
    );
  }
}
