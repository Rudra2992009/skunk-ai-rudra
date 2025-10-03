import { Component, signal } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';

interface ModelOption { id: string; name: string; }

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  currentYear = new Date().getFullYear();
  theme = signal<'light' | 'dark' | 'system'>('system');

  // Model selector
  models: ModelOption[] = [
    { id: 'facebook/opt-125m', name: 'OPT-125M' },
    { id: 'bigscience/bloom-560m', name: 'BLOOM-560M' },
    { id: 'gpt2', name: 'GPT-2' },
    { id: 'bigscience/bloom-1b1', name: 'BLOOM-1.1B' }
  ];
  selectedModel: string = this.models[0].id;
  tokenModalOpen = false;

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

  toggleTheme() {
    const isDark = document.documentElement.classList.contains('dark');
    this.setTheme(isDark ? 'light' : 'dark');
  }

  private applySystemTheme() {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    document.documentElement.classList.toggle('dark', prefersDark);
  }
}
