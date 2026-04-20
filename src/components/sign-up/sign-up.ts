import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: '../sign-up/sign-up.html',
  styleUrl: '../sign-up/sign-up.css',
})
export class SignupComponent {
  email    = '';
  password = '';
  confirm  = '';
  loading  = false;

  constructor(private authService: AuthService) {}

  async signup(): Promise<void> {
    if (!this.email || !this.password) return;
    if (this.password !== this.confirm) {
      Swal.fire({ icon: 'warning', title: 'Passwords do not match' });
      return;
    }
    this.loading = true;
    try {
      await this.authService.signUp(this.email, this.password);
    } catch (error: any) {
      Swal.fire({ icon: 'error', title: 'Error', text: error.message });
    } finally {
      this.loading = false;
    }
  }
}
