import { Component, signal } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HFModelService } from './services/hf-model.service';

interface ModelOption { id: string; name: string; }

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, FormsModule, (await import('@angular/common')).CommonModule],
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
  tokensInput = '';

  constructor(private hf: HFModelService) {
    const saved = localStorage.getItem('theme') as 'light' | 'dark' | null;
    if (saved) {
      this.setTheme(saved);
    } else {
      this.applySystemTheme();
    }
  }

  get tokens() { return this.hf.getTokens(); }

  addToken() {
    const v = this.tokensInput.trim();
    if (!v) return;
    const arr = this.hf.getTokens();
    arr.push(v);
    this.hf.saveTokens(arr);
    this.tokensInput = '';
  }

  removeToken(i: number) {
    const arr = this.hf.getTokens();
    arr.splice(i, 1);
    this.hf.saveTokens(arr);
  }

  onModelChange(ev: any) {
    // selectedModel is two-way bound via ngModel
    // optionally persist
    localStorage.setItem('hf_selected_model', this.selectedModel);
  }

  closeTokenModal() { this.tokenModalOpen = false; }

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
