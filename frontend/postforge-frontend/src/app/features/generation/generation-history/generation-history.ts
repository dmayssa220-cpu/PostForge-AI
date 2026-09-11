import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { GenerationService } from '../../../core/services/generation.service';
import { GenerationResponse } from '../../../core/models/generation.model';
import { CarouselViewer } from '../../../shared/carousel-viewer/carousel-viewer';

@Component({
  selector: 'app-generation-history',
  imports: [CommonModule, FormsModule, CarouselViewer],
  templateUrl: './generation-history.html',
  styleUrl: './generation-history.scss'
})
export class GenerationHistory implements OnInit {
  generations = signal<GenerationResponse[]>([]);
  isLoading = signal(true);
  errorMessage = signal('');

  searchTopic = '';
  filterStatus = '';

  constructor(private generationService: GenerationService, private router: Router) {}

  ngOnInit(): void {
    this.loadHistory();
  }

  loadHistory(): void {
    this.isLoading.set(true);
    this.generationService.getHistory().subscribe({
      next: (data) => {
        this.generations.set(data);
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Impossible de charger l\'historique.');
        this.isLoading.set(false);
      }
    });
  }

  applyFilters(): void {
    this.isLoading.set(true);
    this.generationService.search(this.searchTopic, this.filterStatus).subscribe({
      next: (data) => {
        this.generations.set(data);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }

  resetFilters(): void {
    this.searchTopic = '';
    this.filterStatus = '';
    this.loadHistory();
  }

  schedule(gen: GenerationResponse, dateInput: HTMLInputElement): void {
    const value = dateInput.value;
    if (!value) return;
    const scheduledDate = value.length === 16 ? `${value}:00` : value;

    this.generationService.schedule(gen.id, { scheduledDate }).subscribe({
      next: () => this.loadHistory(),
      error: (err) => alert('Erreur lors de la planification : ' + (err.error?.error || err.message))
    });
  }

  publish(gen: GenerationResponse): void {
    this.generationService.publish(gen.id).subscribe({
      next: () => this.loadHistory(),
      error: (err) => alert('Erreur lors de la publication : ' + (err.error?.error || err.message))
    });
  }

  deleteGen(gen: GenerationResponse): void {
    if (!confirm(`Supprimer la génération "${gen.topic}" ? Cette action est irréversible.`)) return;

    this.generationService.deleteGeneration(gen.id).subscribe({
      next: () => this.loadHistory(),
      error: (err) => alert('Erreur lors de la suppression : ' + (err.error?.error || err.message))
    });
  }

  goToGenerate(): void {
    this.router.navigate(['/generate']);
  }
}