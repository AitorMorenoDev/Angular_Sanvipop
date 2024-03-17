import {inject, Injectable, PLATFORM_ID} from '@angular/core';
import {CLIENT_ID} from "./google-login.config";
import {Subject} from "rxjs";
import {isPlatformBrowser} from "@angular/common";

@Injectable({
  providedIn: 'root'
})
export class LoadGoogleApiService {
  #loader: Promise<void>;
  #credential$ = new Subject<google.accounts.id.CredentialResponse>();
  #clientId = inject(CLIENT_ID, { optional: true });
  platformId = inject(PLATFORM_ID);


  constructor() {
    if (this.#clientId === null) {
      throw new Error(
        'LoadGoogleApiService: You must call provideGoogleId in your providers array'
      );
    }
    this.#loader = this.#loadApi();
  }

  get credential$() {
    return this.#credential$;
  }

  async setGoogleBtn(btn: HTMLElement) {
    if (isPlatformBrowser(this.platformId)) {
      try {
        await this.#loadApi();

        google.accounts.id.renderButton(
          btn,
          { theme: 'filled_black', size: 'large', type: 'standard' }
        );
      } catch (error) {
        console.error(error);
      }
    }
  }

  async #loadApi(): Promise<void> {
    if (isPlatformBrowser(this.platformId)) {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      document.body.appendChild(script);

      // Return a promise that resolves when the script has loaded
      return new Promise((resolve, reject) => {
        script.onload = () => {
          if (typeof google !== 'undefined') {
            google.accounts.id.initialize({
              client_id: this.#clientId!,
              callback: (response) => {
                this.#credential$.next(response);
              },
            });
            resolve();
          } else {
            reject('Google API not loaded');
          }
        };
        script.onerror = () => {
          reject('Failed to load Google API script');
        };
      });
    }
  }
}
