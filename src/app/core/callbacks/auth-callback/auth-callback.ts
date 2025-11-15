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

    const code = params['code'];

    if (!code) {
      await this.router.navigate(['/']);
      return;
    }

    try {
      if (provider === 'google') {
        // Отправляем code на сервер
        const result: any = await firstValueFrom(
          this.http.post('http://95.165.74.42:8080/api/auth/google', {
            code,
            redirectUri: window.location.origin + '/auth/callback/google'
          })
        );

        // Сохраняем JWT от сервера
        this.auth.saveToken(result.token);

        await this.router.navigate(['/']);
      }

      if (provider === 'vk') {
        try {
          const result: any = await this.http
            .post('http://95.165.74.42:8080/api/auth/vk', {
              code,
              redirectUri: window.location.origin + '/auth/callback/vk'
            })
            .toPromise();

          localStorage.setItem('access_token', result.access_token);
          await this.router.navigate(['/']);
        } catch (err) {
          console.error(err);
          await this.router.navigate(['/']);
        }
      }
    } catch (err) {
      console.error('OAuth error', err);
      await this.router.navigate(['/']);
    }
  }
}
