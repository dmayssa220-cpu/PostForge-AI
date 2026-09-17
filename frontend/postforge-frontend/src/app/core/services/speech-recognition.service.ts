import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SpeechRecognitionService {
  isListening = signal(false);
  isSupported = signal(false);
  transcript = signal('');
  errorMessage = signal('');

  private recognition: any;

  constructor() {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      this.isSupported.set(false);
      return;
    }

    this.isSupported.set(true);
    this.recognition = new SpeechRecognition();
    this.recognition.continuous = false;
    this.recognition.interimResults = true;
    this.recognition.maxAlternatives = 1;

    this.recognition.onresult = (event: any) => {
      let finalText = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        finalText += event.results[i][0].transcript;
      }
      this.transcript.set(finalText);
    };

    this.recognition.onerror = (event: any) => {
      this.errorMessage.set('Erreur de reconnaissance vocale : ' + event.error);
      this.isListening.set(false);
    };

    this.recognition.onend = () => {
      this.isListening.set(false);
    };
  }

  start(lang: string = 'fr-FR'): void {
    if (!this.isSupported()) {
      this.errorMessage.set('La reconnaissance vocale n\'est pas supportée sur ce navigateur.');
      return;
    }
    this.errorMessage.set('');
    this.transcript.set('');
    this.recognition.lang = lang;
    this.recognition.start();
    this.isListening.set(true);
  }

  stop(): void {
    if (this.recognition) {
      this.recognition.stop();
    }
    this.isListening.set(false);
  }
}