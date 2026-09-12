import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GenerationRequest, GenerationResponse, ScheduleRequest, TranslateRequest } from '../models/generation.model';

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
  deleteGeneration(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  editGeneration(id: string, editedOutput: any): Observable<GenerationResponse> {
    return this.http.put<GenerationResponse>(`${this.baseUrl}/${id}/edit`, { editedOutput });
  }

  search(topic: string, status: string): Observable<GenerationResponse[]> {
    const params: any = {};
    if (topic) params.topic = topic;
    if (status) params.status = status;
    return this.http.get<GenerationResponse[]>(`${this.baseUrl}/search`, { params });
  }
  translate(id: string, request: TranslateRequest): Observable<GenerationResponse> {
  return this.http.post<GenerationResponse>(`${this.baseUrl}/${id}/translate`, request);
}
}