import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { GenerationService } from '../../../core/services/generation.service';
import { GenerationResponse } from '../../../core/models/generation.model';
import { CarouselViewer } from '../../../shared/carousel-viewer/carousel-viewer';

@Component({
  selector: 'app-generation-form',
  imports: [CommonModule, FormsModule, CarouselViewer],
  templateUrl: './generation-form.html',
  styleUrl: './generation-form.scss'
})
export class GenerationForm {
  topic = '';
  language = 'fr';
  tone = 'expert';

  isLoading = signal(false);
  errorMessage = signal('');
  result = signal<GenerationResponse | null>(null);

  constructor(private generationService: GenerationService, private router: Router) {}

  onSubmit(): void {
    this.errorMessage.set('');
    this.isLoading.set(true);
    this.result.set(null);

    this.generationService.generate({
      topic: this.topic,
      language: this.language,
      tone: this.tone
    }).subscribe({
      next: (response) => {
        this.isLoading.set(false);
        this.result.set(response);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMessage.set(err.error?.error || 'Erreur lors de la génération.');
      }
    });
  }

  goToHistory(): void {
    this.router.navigate(['/history']);
  }
}