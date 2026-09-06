import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.scss'
})
export class Register {
  email = '';
  password = '';
  fullName = '';
  errorMessage = signal('');
  successMessage = signal('');
  isLoading = signal(false);

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(): void {
    this.errorMessage.set('');
    this.successMessage.set('');
    this.isLoading.set(true);

    this.authService.register({
      email: this.email,
      password: this.password,
      fullName: this.fullName
    }).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.successMessage.set('Compte créé ! Vérifie ton email pour l\'activer, puis connecte-toi.');
      },
      error: (err) => {
        this.isLoading.set(false);
        if (err.error && typeof err.error === 'object' && !err.error.error) {
          const messages = Object.values(err.error).join(' ');
          this.errorMessage.set(messages as string);
        } else {
          this.errorMessage.set(err.error?.error || 'Une erreur est survenue.');
        }
      }
    });
  }
}