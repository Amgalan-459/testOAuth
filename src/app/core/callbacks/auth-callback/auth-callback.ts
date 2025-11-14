import { Component } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {OAuthService} from 'angular-oauth2-oidc';

@Component({
  selector: 'app-auth-callback',
  imports: [],
  template: `
    <p>Авторизация</p>
  `,
  styleUrl: './auth-callback.css',
})
export class AuthCallback {

  constructor(private route: ActivatedRoute, private router: Router, private http: HttpClient, oauth: OAuthService) {
    route.queryParams.subscribe(async (params) => {
      const code = params['code'];

      const provider = this.route.snapshot.paramMap.get('provider');

      if (!code) await router.navigate(['/']);

      if (provider === 'google') {
        await oauth.tryLoginCodeFlow();
        await router.navigate(['/']);
      }

      if (provider === 'vk') {
        try {
          const result: any = await http
            .post('/api/auth/vk/exchange-code', {
              code,
              redirectUri: window.location.origin + '/auth/callback/vk'
            })
            .toPromise();

          localStorage.setItem('access_token', result.access_token);
          await router.navigate(['/']);
        } catch (err) {
          console.error(err);
          await router.navigate(['/']);
        }
      }
    })
  }
}
