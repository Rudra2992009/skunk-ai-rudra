import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  theme = signal<'light' | 'dark' | 'system'>('system');

  constructor() {
    const saved = localStorage.getItem('theme') as 'light' | 'dark' | null;
    if (saved) {
      this.setTheme(saved);
    } else {
      this.applySystemTheme();
    }
  }

  setTheme(mode: 'light' | 'dark' | 'system') {
    this.theme.set(mode);
    localStorage.setItem('theme', mode);
    if (mode === 'system') return this.applySystemTheme();
    document.documentElement.classList.toggle('dark', mode === 'dark');
  }

  private applySystemTheme() {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    document.documentElement.classList.toggle('dark', prefersDark);
  }
}
