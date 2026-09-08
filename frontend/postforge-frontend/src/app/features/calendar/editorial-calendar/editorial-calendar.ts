import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { GenerationService } from '../../../core/services/generation.service';
import { GenerationResponse } from '../../../core/models/generation.model';

interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  generations: GenerationResponse[];
}

@Component({
  selector: 'app-editorial-calendar',
  imports: [CommonModule],
  templateUrl: './editorial-calendar.html',
  styleUrl: './editorial-calendar.scss'
})
export class EditorialCalendar implements OnInit {
  currentDate = signal(new Date());
  generations = signal<GenerationResponse[]>([]);
  isLoading = signal(true);
  selectedDay = signal<CalendarDay | null>(null);

  monthLabel = computed(() => {
    return this.currentDate().toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
  });

  calendarDays = computed<CalendarDay[]>(() => {
    const date = this.currentDate();
    const year = date.getFullYear();
    const month = date.getMonth();

    const firstDay = new Date(year, month, 1);
    const startOffset = (firstDay.getDay() + 6) % 7; // lundi = 0
    const gridStart = new Date(year, month, 1 - startOffset);

    const today = new Date();
    const gens = this.generations();

    const days: CalendarDay[] = [];
    for (let i = 0; i < 42; i++) {
      const d = new Date(gridStart);
      d.setDate(gridStart.getDate() + i);

      const dayGens = gens.filter(g => {
        if (!g.scheduledDate) return false;
        const gd = new Date(g.scheduledDate);
        return gd.getFullYear() === d.getFullYear() &&
               gd.getMonth() === d.getMonth() &&
               gd.getDate() === d.getDate();
      });

      days.push({
        date: d,
        isCurrentMonth: d.getMonth() === month,
        isToday: d.toDateString() === today.toDateString(),
        generations: dayGens
      });
    }
    return days;
  });

  constructor(private generationService: GenerationService, private router: Router) {}

  ngOnInit(): void {
    this.loadMonth();
  }

  loadMonth(): void {
    this.isLoading.set(true);
    const date = this.currentDate();
    const start = new Date(date.getFullYear(), date.getMonth(), 1);
    const end = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59);

    this.generationService.getCalendar(
      this.toIsoLocal(start),
      this.toIsoLocal(end)
    ).subscribe({
      next: (data) => {
        this.generations.set(data);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }

  private toIsoLocal(d: Date): string {
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
  }

  prevMonth(): void {
    const d = new Date(this.currentDate());
    d.setMonth(d.getMonth() - 1);
    this.currentDate.set(d);
    this.loadMonth();
  }

  nextMonth(): void {
    const d = new Date(this.currentDate());
    d.setMonth(d.getMonth() + 1);
    this.currentDate.set(d);
    this.loadMonth();
  }

  selectDay(day: CalendarDay): void {
    if (day.generations.length > 0) {
      this.selectedDay.set(day);
    }
  }

  closeDetail(): void {
    this.selectedDay.set(null);
  }

  goToGenerate(): void {
    this.router.navigate(['/generate']);
  }

  goToHistory(): void {
    this.router.navigate(['/history']);
  }
}