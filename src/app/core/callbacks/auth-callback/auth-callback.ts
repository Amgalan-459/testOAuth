import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import {AuthService} from '../../services/auth-service';

@Component({
  selector: 'app-auth-callback',
  template: `<p>Завершаем авторизацию...</p>`,
})
export class AuthCallback {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private auth: AuthService,
    private http: HttpClient
  ) {
    this.handleCallback();
  }

  private async handleCallback() {
    const provider = this.route.snapshot.paramMap.get('provider');
    const params = this.route.snapshot.queryParams;

    if (!provider) {
      await this.router.navigate(['/']);
      return;
    }

    try {
      if (provider === 'google') {
        const code = params['code'];

        if (!code) {
          await this.router.navigate(['/']);
          return;
        }

        // Отправляем code на сервер
        const result: any = await firstValueFrom(
          this.http.post('/api/auth/google', {
            code,
            redirectUri: window.location.origin + '/auth/callback/google'
          })
        );

        // Сохраняем JWT от сервера
        this.auth.saveToken(result.token);

        await this.router.navigate(['/']);
      }

      // Можно добавить VK аналогично
    } catch (err) {
      console.error('OAuth error', err);
      await this.router.navigate(['/']);
    }
  }
}
