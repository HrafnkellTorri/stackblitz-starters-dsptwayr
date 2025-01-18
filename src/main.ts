import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () =>
      import('./app/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'shreddit',
    loadComponent: () =>
      import('./app/shreddit/shreddit.component').then(
        (m) => m.ShredditComponent
      ),
  },
];

bootstrapApplication(AppComponent, {
  providers: [provideRouter(routes)],
}).catch((err) => console.error(err));
