import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AudioRecorderService {
  isRecording = signal(false);
  isSupported = signal(!!(navigator.mediaDevices && (window as any).MediaRecorder));
  errorMessage = signal('');

  private mediaRecorder: MediaRecorder | null = null;
  private chunks: Blob[] = [];
  private stream: MediaStream | null = null;

  async start(): Promise<void> {
    if (!this.isSupported()) {
      this.errorMessage.set('L\'enregistrement audio n\'est pas supporté sur ce navigateur.');
      return;
    }
    this.errorMessage.set('');
    this.chunks = [];

    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.mediaRecorder = new MediaRecorder(this.stream);

      this.mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) this.chunks.push(e.data);
      };

      this.mediaRecorder.start();
      this.isRecording.set(true);
    } catch {
      this.errorMessage.set('Impossible d\'accéder au micro.');
    }
  }

  stop(): Promise<Blob> {
    return new Promise((resolve) => {
      if (!this.mediaRecorder) {
        resolve(new Blob());
        return;
      }
      this.mediaRecorder.onstop = () => {
        const blob = new Blob(this.chunks, { type: this.mediaRecorder?.mimeType || 'audio/webm' });
        this.stream?.getTracks().forEach(track => track.stop());
        this.isRecording.set(false);
        resolve(blob);
      };
      this.mediaRecorder.stop();
    });
  }
}