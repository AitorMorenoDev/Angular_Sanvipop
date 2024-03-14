import {Component, computed, inject} from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import {AuthService} from "../auth/services/auth.service";

@Component({
  selector: 'menu-top',
  standalone: true,
  imports: [ RouterLink, RouterLinkActive ],
  templateUrl: './menu-top.component.html',
  styleUrl: './menu-top.component.css'
})
export class MenuTopComponent {
  title = 'Angular SanviPop';

  #authService = inject(AuthService);
  logged = computed(() => this.#authService.logged());

  logout() {
    this.#authService.logout();
  }
}
