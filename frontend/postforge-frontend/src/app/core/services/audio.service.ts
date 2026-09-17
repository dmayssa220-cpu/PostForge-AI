import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AudioService {
  private readonly baseUrl = 'http://localhost:8080/api/v1/audio';

  constructor(private http: HttpClient) {}

  transcribeAudio(blob: Blob, language: string): Observable<{ transcript: string }> {
    const formData = new FormData();
    formData.append('file', blob, 'recording.webm');
    formData.append('language', language);
    return this.http.post<{ transcript: string }>(`${this.baseUrl}/transcribe`, formData);
  }
}