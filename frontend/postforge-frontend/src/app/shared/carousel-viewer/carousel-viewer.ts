import { Component, Input, signal, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Slide } from '../../core/models/generation.model';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

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
  @Input() topic = '';

  @ViewChild('slideFrame') slideFrame!: ElementRef<HTMLDivElement>;

  currentIndex = signal(0);
  isExporting = signal(false);

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
        await new Promise(resolve => setTimeout(resolve, 150)); // laisser Angular re-render
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