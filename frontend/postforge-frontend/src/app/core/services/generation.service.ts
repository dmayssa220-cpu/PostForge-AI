/*import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GenerationRequest, GenerationResponse } from '../models/generation.model';

@Injectable({ providedIn: 'root' })
export class GenerationService {
  private readonly baseUrl = 'http://localhost:8080/api/v1/generations';

  constructor(private http: HttpClient) {}

  generate(request: GenerationRequest): Observable<GenerationResponse> {
    return this.http.post<GenerationResponse>(this.baseUrl, request);
  }

  getHistory(): Observable<GenerationResponse[]> {
    return this.http.get<GenerationResponse[]>(this.baseUrl);
  }
}*/
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GenerationRequest, GenerationResponse, ScheduleRequest } from '../models/generation.model';

@Injectable({ providedIn: 'root' })
export class GenerationService {
  private readonly baseUrl = 'http://localhost:8080/api/v1/generations';

  constructor(private http: HttpClient) {}

  generate(request: GenerationRequest): Observable<GenerationResponse> {
    return this.http.post<GenerationResponse>(this.baseUrl, request);
  }

  getHistory(): Observable<GenerationResponse[]> {
    return this.http.get<GenerationResponse[]>(this.baseUrl);
  }

  schedule(id: string, request: ScheduleRequest): Observable<GenerationResponse> {
    return this.http.patch<GenerationResponse>(`${this.baseUrl}/${id}/schedule`, request);
  }

  publish(id: string): Observable<GenerationResponse> {
    return this.http.patch<GenerationResponse>(`${this.baseUrl}/${id}/publish`, {});
  }

  getCalendar(start: string, end: string): Observable<GenerationResponse[]> {
    return this.http.get<GenerationResponse[]>(`${this.baseUrl}/calendar`, {
      params: { start, end }
    });
  }
}