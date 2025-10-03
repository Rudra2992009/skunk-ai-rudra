import { Routes } from '@angular/router';
import { HomePageComponent } from './pages/home';
import { PlaceholderPageComponent } from './pages/placeholder';

export const routes: Routes = [
  { path: '', component: HomePageComponent, pathMatch: 'full' },
  { path: 'playground', component: PlaceholderPageComponent },
  { path: '**', redirectTo: '' }
];
