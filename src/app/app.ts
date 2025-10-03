import { Component, signal } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HFModelService } from './services/hf-model.service';
import { HF_MODEL_LIST, HF_TOKENS_FROM_CODE } from './config/hf-config';

interface ModelOption { id: string; name: string; }

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, FormsModule, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  currentYear = new Date().getFullYear();
  theme = signal<'light' | 'dark' | 'system'>('system');

  // Model selector (loaded from config)
  models: ModelOption[] = [];
  selectedModel: string = '';
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
}
