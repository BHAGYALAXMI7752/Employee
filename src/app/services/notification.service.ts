import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly messageSubject = new BehaviorSubject<string | null>(null);
  readonly message$ = this.messageSubject.asObservable();

  showMessage(message: string): void {
    this.messageSubject.next(message);
  }

  clearMessage(): void {
    this.messageSubject.next(null);
  }
}
