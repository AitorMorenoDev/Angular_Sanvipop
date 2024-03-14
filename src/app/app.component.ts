import {Component, OnInit} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MenuTopComponent } from './menu-top/menu-top.component';
import {AuthService} from "./auth/services/auth.service";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MenuTopComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  constructor(private authService: AuthService) {}

  // Avoids loosing the logged status when refreshing the page
  ngOnInit(): void {
    this.authService.isLogged().subscribe();
  }
}
