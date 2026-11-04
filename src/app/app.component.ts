import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';
import { NotificationService } from './services/notification.service';

@Component({ selector: 'app-root', standalone: true, imports: [AsyncPipe, RouterLink, RouterOutlet], template: `
  <header class="topbar"><a class="brand" routerLink="/employees"><span class="brand-mark">E</span> People<span class="brand-light">Desk</span></a><nav><a routerLink="/employees" routerLinkActive="nav-active">Employees</a></nav><span class="topbar-caption">Employee management</span></header>
  <router-outlet />
  @if (notificationService.message$ | async; as message) { <div class="toast" role="status"><span>{{ message }}</span><button type="button" aria-label="Dismiss notification" (click)="notificationService.clearMessage()">×</button></div> }
  ` })
export class AppComponent { readonly notificationService = inject(NotificationService); }
