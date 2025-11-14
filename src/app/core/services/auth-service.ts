import {inject, Injectable} from '@angular/core';
import {AuthConfig, OAuthService} from 'angular-oauth2-oidc';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private oauth = inject(OAuthService);
  private http = inject(HttpClient)

  private googleConfig: AuthConfig = {
    issuer: 'https://accounts.google.com',
    clientId: '247628970102-c3n855t3t5k53vvlaqu1omb7ufgn1307.apps.googleusercontent.com',
    redirectUri: window.location.origin + '/auth/callback/google',
    responseType: 'code',
    scope: 'openid profile email',
    strictDiscoveryDocumentValidation: false,
    disableAtHashCheck: true,
    showDebugInformation: true,
  };

  initGoogle() {
    this.oauth.configure(this.googleConfig);
    return this.oauth.loadDiscoveryDocumentAndTryLogin();
  }

  googleLogin() {
    this.oauth.initCodeFlow();
  }

  vkLogin() {
    const client_id = '54322212';
    const redirect = encodeURIComponent(window.location.origin + '/auth/callback/vk');
    const scope = 'email';
    const state = Math.random().toString(36).slice(2);

    sessionStorage.setItem('vk_state', state);

    const params = new URLSearchParams({
      client_id,
      redirect_uri: redirect,
      response_type: 'code',
      scope,
      v: '5.131',
      state
    });

    window.location.href = `https://oauth.vk.com/authorize?${params.toString()}`;
  }

  login(email: string, password: string) {
    return this.http.post<{ token: string }>('/api/auth/login', {
      email,
      password
    });
  }

  register(email: string, password: string) {
    return this.http.post('/api/auth/register', {
      email,
      password
    });
  }

  saveToken(token: string) {
    localStorage.setItem('access_token', token);
  }

  getToken() {
    return localStorage.getItem('access_token');
  }

  logout() {
    localStorage.removeItem('access_token');
    this.oauth.logOut();
  }
}
