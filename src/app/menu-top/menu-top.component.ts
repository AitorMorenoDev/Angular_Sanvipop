import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'menu-top',
  standalone: true,
  imports: [ RouterLink, RouterLinkActive ],
  templateUrl: './menu-top.component.html',
  styleUrl: './menu-top.component.css'
})
export class MenuTopComponent {
  title = 'Angular SanviPop';

}
