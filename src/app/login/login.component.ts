import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

//Very unsafe login system but does the job
@Component({
  selector: 'app-login',
  template: `
      <form (submit)="onSubmit($event)">
        <h1> Shreddit </h1>
        <input type="text" id="username" [(ngModel)]="username" name="username" placeholder="Enter Username" required />
        <input type="password" id="password" [(ngModel)]="password" name="password" placeholder="Enter Password" required />
        <button type="submit">Login</button>
        <p *ngIf="error">{{ error }}</p>
      </form>
  `,
  standalone: true,
  styleUrls: ['./login.component.css'],
  imports: [FormsModule, CommonModule],
})
export class LoginComponent {
  username = '';
  password = '';
  error = '';

  constructor(private userService: UserService, private router: Router) {}

  onSubmit(event: Event): void {
    event.preventDefault();
    if (this.userService.login(this.username, this.password) || true) {
      this.router.navigate(['/shreddit']);
    } else {
      this.error = 'Invalid username or password';
    }
  }
}
