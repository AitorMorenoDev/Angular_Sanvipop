import {Component, OnInit} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {MenuTopComponent} from './menu-top/menu-top.component';
import {AuthService} from "./auth/services/auth.service";
import {animate, group, query, style, transition, trigger} from "@angular/animations";

// Animation constants
  // For swipe animations
  const commonStyles = style({ position: 'absolute', width: '100%' });
  const enterAnimation = animate('0.5s', style({ transform: 'none' }));
  const leaveAnimation = [animate('0.4s', style({ transform: 'translateX(-100%)' })),
    animate('0.2s', style({ opacity: 0 }))];
  const leaveAnimation2 = [animate('0.4s', style({ transform: 'translateX(100%)' })),
    animate('0.2s', style({ opacity: 0 }))];

  //For enterPage animations
  const enterForEnterPage = [style({ opacity: 0, transform: 'scale(0)' }), animate('0.5s ease-in-out', style({ opacity: 1, transform: 'scale(1)' }))];
  const leaveForEnterPage = [animate('0.5s ease-in-out', style({ opacity: 0, transform: 'opacity(0)' }))];

  // For leavePage animations
  const enterForLeavePage = [style({ opacity: 0 }), animate('1s ease-in-out', style({ opacity: 1 }))];
  const leaveForLeavePage = [animate('1s ease-in-out', style({ opacity: 0, transform: 'scale(0)' }))];

// Transition functions
function LeftToRight(fromState: string, toState: string) {
  return transition(`${fromState} => ${toState}`, [
    query(':enter, :leave', commonStyles),
    query(':enter', style({ transform: 'translateX(100%)' })),
    group([
      query(':leave', leaveAnimation),
      query(':enter', [enterAnimation]),
    ]),
  ]);
}

function RightToLeft(fromState: string, toState: string) {
  return transition(`${fromState} => ${toState}`, [
    query(':enter, :leave', commonStyles),
    query(':enter', style({ transform: 'translateX(-100%)' })),
    group([
      query(':leave', leaveAnimation2),
      query(':enter', [enterAnimation]),
    ]),
  ]);
}

function EnterPage(fromState: string, toState: string) {
  return transition(`${fromState} => ${toState}`, [
    query(':enter, :leave', style({ position: 'absolute', width: '100%' })),
    group([
      query(':enter', enterForEnterPage),
      query(':leave', leaveForEnterPage),
    ]),
  ])
}

function LeavePage(fromState: string, toState: string) {
  return transition(`${fromState} => ${toState}`, [
    query(':enter, :leave', commonStyles),
    group([
      query(':leave', leaveForLeavePage),
      query(':enter', enterForLeavePage),
    ]),
  ]);
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MenuTopComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  animations: [
    trigger('routeAnimation', [

      // Left to right
        //Menu1 a Menu2
        LeftToRight('productsPage', 'productForm'),
        // Menu2 a Menu 3
        LeftToRight('productForm', 'profile'),
        // Menu1 a Menu3
        LeftToRight('productsPage', 'profile'),

      // Right to left
        // Menu3 a Menu2
        RightToLeft('profile', 'productForm'),
        // Menu2 a Menu1
        RightToLeft('productForm', 'productsPage'),
        // Menu3 a Menu1
        RightToLeft('profile', 'productsPage'),

      //Enter Page
      EnterPage('productsPage', 'productDetail'),

      //Leave Page
      LeavePage('productDetail', 'productsPage'),
      LeavePage('productDetail', 'productForm'),
      LeavePage('productDetail', 'profile'),
    ]),
  ],
})


export class AppComponent implements OnInit {
  constructor(private authService: AuthService) {}
  // Avoids loosing the logged status when refreshing the page
  ngOnInit(): void {
    this.authService.isLogged().subscribe();
  }

  // Animation for the router outlet
  getState(routerOutlet: RouterOutlet) {
    return routerOutlet.activatedRouteData['animation'] || 'None';
  }
}
