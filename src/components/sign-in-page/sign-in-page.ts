import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { form } from '@angular/forms/signals';
import { RouterLink } from "@angular/router";

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

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      email:    ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      remember: [false]
    });
  }

  /** Returns true when a field is touched and invalid (used for error styling) */
  isInvalid(field: string): boolean {
    const ctrl = this.form.get(field);
    return !!(ctrl && ctrl.invalid && ctrl.touched);
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;

    this.loading = true;

    // Simulate an API call (replace with your real AuthService call)
    setTimeout(() => {
      this.loading = false;
      const { email, password, remember } = this.form.value;
      console.log('Sign In payload:', { email, password, remember });
      // e.g. this.authService.signIn(email, password).subscribe(...)
    }, 1500);
  }

  onForgot(event: Event): void {
    event.preventDefault();
    console.log('Navigate to: /forgot-password');
    // this.router.navigate(['/forgot-password']);
  }

  signInWith(provider: 'google' | 'facebook'): void {
    console.log(`Sign in with ${provider}`);
    // e.g. this.authService.socialLogin(provider)
  }

  goToSignUp(event: Event): void {
    event.preventDefault();
    console.log('Navigate to: /sign-up');
    // this.router.navigate(['/sign-up']);
  }
}
