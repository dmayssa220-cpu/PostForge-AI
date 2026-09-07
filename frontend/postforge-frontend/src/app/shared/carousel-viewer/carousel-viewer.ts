import { Component, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Slide } from '../../core/models/generation.model';

@Component({
  selector: 'app-carousel-viewer',
  imports: [CommonModule],
  templateUrl: './carousel-viewer.html',
  styleUrl: './carousel-viewer.scss'
})
export class CarouselViewer {
  @Input() slides: Slide[] = [];
  @Input() ctaSlide = '';
  @Input() hashtags: string[] = [];

  currentIndex = signal(0);

  private gradients = [
    'linear-gradient(135deg, #6366f1, #a855f7)',
    'linear-gradient(135deg, #ec4899, #f97316)',
    'linear-gradient(135deg, #06b6d4, #3b82f6)',
    'linear-gradient(135deg, #10b981, #059669)',
    'linear-gradient(135deg, #f59e0b, #ef4444)',
    'linear-gradient(135deg, #8b5cf6, #6366f1)',
    'linear-gradient(135deg, #1e293b, #475569)',
  ];

  get totalSlides(): number {
    return this.slides.length + 1; 
  }

  get isCtaSlide(): boolean {
    return this.currentIndex() === this.slides.length;
  }

  get currentSlide(): Slide | null {
    return this.isCtaSlide ? null : this.slides[this.currentIndex()];
  }

  getGradient(index: number): string {
    return this.gradients[index % this.gradients.length];
  }

  next(): void {
    if (this.currentIndex() < this.totalSlides - 1) {
      this.currentIndex.update(i => i + 1);
    }
  }

  prev(): void {
    if (this.currentIndex() > 0) {
      this.currentIndex.update(i => i - 1);
    }
  }

  goTo(index: number): void {
    this.currentIndex.set(index);
  }
}