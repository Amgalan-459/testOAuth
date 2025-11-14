import {Component, inject} from '@angular/core';
import {AuthService} from '../../../core/services/auth-service';
import {Router} from '@angular/router';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private auth = inject(AuthService)
  private router = inject(Router);
  private fb = inject(FormBuilder);

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  submit() {
    if (this.form.invalid) return;

    const { email, password } = this.form.value;

    this.auth.login(email!, password!).subscribe({
      next: (res) => {
        this.auth.saveToken(res.token);
        this.router.navigate(['/']);
      },
      error: (e) => console.error(e)
    });
  }

  google() {
    this.auth.googleLogin();
  }

  vk() {
    this.auth.vkLogin();
  }
}
