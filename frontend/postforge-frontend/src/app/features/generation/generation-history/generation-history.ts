import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { GenerationService } from '../../../core/services/generation.service';
import { GenerationResponse } from '../../../core/models/generation.model';

@Component({
  selector: 'app-generation-history',
  imports: [CommonModule],
  templateUrl: './generation-history.html',
  styleUrl: './generation-history.scss'
})
export class GenerationHistory implements OnInit {
  generations = signal<GenerationResponse[]>([]);
  isLoading = signal(true);
  errorMessage = signal('');

  constructor(private generationService: GenerationService, private router: Router) {}

  ngOnInit(): void {
    this.generationService.getHistory().subscribe({
      next: (data) => {
        this.generations.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.errorMessage.set('Impossible de charger l\'historique.');
        this.isLoading.set(false);
      }
    });
  }

  goToGenerate(): void {
    this.router.navigate(['/generate']);
  }
}