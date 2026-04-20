import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterLink } from "@angular/router";
import { AuthService } from '../../services/auth.service'; // ✅ أضف ده
import Swal from 'sweetalert2';                            // ✅ أضف ده

@Component({
  selector: 'app-sign-in-page',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './sign-in-page.html',
  styleUrl: './sign-in-page.css',
})
export class SignInComponent {

  form: FormGroup;
  showPassword = false;
  loading = false;

  constructor(private fb: FormBuilder, private authService: AuthService) {
    // ✅ اعمل signout اول ما الصفحة تتفتح
    this.authService.signOut();

    this.form = this.fb.group({
      email:    ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      remember: [false]
    });
  }

  isInvalid(field: string): boolean {
    const ctrl = this.form.get(field);
    return !!(ctrl && ctrl.invalid && ctrl.touched);
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  async onSubmit(): Promise<void> {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;

    this.loading = true;
    const { email, password } = this.form.value;

    try {
      // ✅ استخدم الـ AuthService الحقيقي
      await this.authService.signIn(email, password);
    } catch (error: any) {
      let message = 'Something went wrong';
      if (error.code === 'auth/invalid-credential' ||
          error.code === 'auth/wrong-password') {
        message = 'Wrong email or password';
      } else if (error.code === 'auth/user-not-found') {
        message = 'No account found with this email';
      } else if (error.code === 'auth/invalid-email') {
        message = 'Invalid email format';
      }
      Swal.fire({ icon: 'error', title: 'Error', text: message });
    } finally {
      this.loading = false;
    }
  }

  onForgot(event: Event): void {
    event.preventDefault();
  }

  signInWith(provider: 'google' | 'facebook'): void {
    console.log(`Sign in with ${provider}`);
  }
}
