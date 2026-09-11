import { Component, Input, Output, EventEmitter, signal, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Slide } from '../../core/models/generation.model';
import { GenerationService } from '../../core/services/generation.service';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-carousel-viewer',
  imports: [CommonModule, FormsModule],
  templateUrl: './carousel-viewer.html',
  styleUrl: './carousel-viewer.scss'
})
export class CarouselViewer {
  @Input() slides: Slide[] = [];
  @Input() ctaSlide = '';
  @Input() hashtags: string[] = [];
  @Input() topic = '';
  @Input() generationId = '';
  @Input() editable = false;

  @ViewChild('slideFrame') slideFrame!: ElementRef<HTMLDivElement>;

  currentIndex = signal(0);
  isExporting = signal(false);
  isEditing = signal(false);
  isSaving = signal(false);

  editableSlides: Slide[] = [];
  editableCta = '';

  private gradients = [
    'linear-gradient(135deg, #6366f1, #a855f7)',
    'linear-gradient(135deg, #ec4899, #f97316)',
    'linear-gradient(135deg, #06b6d4, #3b82f6)',
    'linear-gradient(135deg, #10b981, #059669)',
    'linear-gradient(135deg, #f59e0b, #ef4444)',
    'linear-gradient(135deg, #8b5cf6, #6366f1)',
    'linear-gradient(135deg, #1e293b, #475569)',
  ];

  constructor(private generationService: GenerationService) {}

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
    if (this.currentIndex() < this.totalSlides - 1) this.currentIndex.update(i => i + 1);
  }

  prev(): void {
    if (this.currentIndex() > 0) this.currentIndex.update(i => i - 1);
  }

  goTo(index: number): void {
    this.currentIndex.set(index);
  }

  startEditing(): void {
    this.editableSlides = JSON.parse(JSON.stringify(this.slides));
    this.editableCta = this.ctaSlide;
    this.isEditing.set(true);
  }

  cancelEditing(): void {
    this.isEditing.set(false);
  }

  saveEditing(): void {
    if (!this.generationId) return;
    this.isSaving.set(true);

    const editedOutput = {
      slides: this.editableSlides,
      cta_slide: this.editableCta,
      suggested_hashtags: this.hashtags
    };

    this.generationService.editGeneration(this.generationId, editedOutput).subscribe({
      next: () => {
        this.slides = JSON.parse(JSON.stringify(this.editableSlides));
        this.ctaSlide = this.editableCta;
        this.isSaving.set(false);
        this.isEditing.set(false);
      },
      error: (err) => {
        this.isSaving.set(false);
        alert('Erreur lors de la sauvegarde : ' + (err.error?.error || err.message));
      }
    });
  }

  async exportAsPNG(): Promise<void> {
    if (!this.slideFrame) return;
    this.isExporting.set(true);
    try {
      const canvas = await html2canvas(this.slideFrame.nativeElement, { scale: 2 });
      const link = document.createElement('a');
      link.download = `${this.topic || 'carousel'}-slide-${this.currentIndex() + 1}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } finally {
      this.isExporting.set(false);
    }
  }

  async exportAllAsPDF(): Promise<void> {
    if (!this.slideFrame) return;
    this.isExporting.set(true);
    const originalIndex = this.currentIndex();
    try {
      const pdf = new jsPDF({ unit: 'px', format: [1080, 1080] });
      for (let i = 0; i < this.totalSlides; i++) {
        this.currentIndex.set(i);
        await new Promise(resolve => setTimeout(resolve, 150));
        const canvas = await html2canvas(this.slideFrame.nativeElement, { scale: 2 });
        const imgData = canvas.toDataURL('image/png');
        if (i > 0) pdf.addPage([1080, 1080], 'portrait');
        pdf.addImage(imgData, 'PNG', 0, 0, 1080, 1080);
      }
      pdf.save(`${this.topic || 'carousel'}.pdf`);
    } finally {
      this.currentIndex.set(originalIndex);
      this.isExporting.set(false);
    }
  }
}