import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

interface Message {
  id: number;
  role: 'user' | 'assistant' | 'system';
  text: string;
  time: string;
}

@Component({
  selector: 'app-playground',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="max-w-4xl mx-auto px-4 py-12">
      <div class="flex items-center justify-between mb-6">
        <div>
          <a routerLink="/" class="text-sm text-slate-500 hover:text-slate-700">← Back</a>
          <h1 class="text-2xl sm:text-3xl font-extrabold mt-2">Skunk AI Playground</h1>
          <p class="text-sm text-slate-500 mt-1">Chat with Skunk AI — quick, clever replies with sources when needed.</p>
        </div>
        <div class="flex items-center gap-2">
          <button class="btn-ghost" (click)="clearConversation()">Reset</button>
        </div>
      </div>

      <div class="rounded-2xl border border-slate-200/70 dark:border-slate-800/70 bg-white/70 dark:bg-slate-900/40 p-4 sm:p-6 mb-6 shadow">
        <div class="h-[60vh] sm:h-[65vh] overflow-auto p-2 flex flex-col gap-4" id="chat-window">

          <div *ngFor="let m of messages" class="flex" [ngClass]="{'justify-end': m.role === 'user'}">
            <div class="max-w-[78%]">
              <div class="inline-flex items-center gap-3 mb-2">
                <div *ngIf="m.role==='assistant'" class="w-8 h-8 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-bold">AI</div>
                <div *ngIf="m.role==='user'" class="w-8 h-8 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-semibold">U</div>
                <div class="text-xs text-slate-400">{{m.time}}</div>
              </div>

              <div class="px-4 py-3 rounded-2xl" [ngClass]="{'bg-brand-600 text-white shadow-lg': m.role==='user','bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100': m.role==='assistant'}">
                <div style="white-space:pre-wrap; word-break:break-word;">{{m.text}}</div>
              </div>

            </div>
          </div>

          <div *ngIf="isTyping" class="flex">
            <div class="max-w-[78%]">
              <div class="inline-flex items-center gap-3 mb-2">
                <div class="w-8 h-8 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-bold">AI</div>
                <div class="text-xs text-slate-400">...</div>
              </div>
              <div class="px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 animate-pulse">
                <div>Skunk AI is composing a reply…</div>
              </div>
            </div>
          </div>

        </div>

        <form (submit)="onSubmit($event)" class="mt-4 flex items-center gap-3">
          <input [(ngModel)]="input" name="prompt" class="flex-1 rounded-xl border border-slate-200/60 dark:border-slate-800/60 bg-white/90 dark:bg-slate-900/30 px-4 py-3 focus:ring-2 focus:ring-brand-300 outline-none" placeholder="Ask Skunk AI anything — try: 'Summarize this article in 3 bullets'" />
          <button type="submit" class="btn-primary" [disabled]="!input || isTyping">Send</button>
        </form>

        <div class="mt-3 text-xs text-slate-400">Tip: Press Enter to send. Responses are simulated locally in this demo.</div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div class="rounded-2xl border border-slate-200/70 dark:border-slate-800/70 bg-white/70 dark:bg-slate-900/40 p-4">
          <div class="badge mb-3">Example</div>
          <p class="text-slate-700 dark:text-slate-200">Try: "Summarize this article in 3 bullet points"</p>
        </div>
        <div class="rounded-2xl border border-slate-200/70 dark:border-slate-800/70 bg-white/70 dark:bg-slate-900/40 p-4">
          <div class="badge mb-3">Tone</div>
          <p class="text-slate-700 dark:text-slate-200">You can ask Skunk AI to be witty, formal, or concise.</p>
        </div>
        <div class="rounded-2xl border border-slate-200/70 dark:border-slate-800/70 bg-white/70 dark:bg-slate-900/40 p-4">
          <div class="badge mb-3">Privacy</div>
          <p class="text-slate-700 dark:text-slate-200">This demo runs locally. Connect an API or database for production usage.</p>
        </div>
      </div>
    </div>
  `
})
export class PlaceholderPageComponent {
  input = '';
  messages: Message[] = [];
  isTyping = false;
  private id = 1;

  constructor() {
    // seed with a friendly system message
    this.pushMessage({ role: 'assistant', text: 'Hey — I\'m Skunk AI. What can I help you with today?', time: this.now() });
  }

  now() { return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); }

  pushMessage(partial: { role: Message['role']; text: string; time?: string }) {
    this.messages.push({ id: this.id++, role: partial.role, text: partial.text, time: partial.time ?? this.now() });
    setTimeout(() => this.scrollToBottom(), 10);
  }

  clearConversation() {
    this.messages = [];
    this.id = 1;
    this.pushMessage({ role: 'assistant', text: 'Conversation cleared. Ready when you are.' , time: this.now()});
  }

  onSubmit(e: Event) {
    e.preventDefault();
    this.sendMessage();
  }

  sendMessage() {
    const text = this.input.trim();
    if (!text) return;
    this.pushMessage({ role: 'user', text });
    this.input = '';
    this.simulateAssistantResponse(text);
  }

  async simulateAssistantResponse(prompt: string) {
    this.isTyping = true;
    // small delay before starting
    await this.delay(600);

    const reply = this.generateMockReply(prompt);

    // streaming effect
    const message: Message = { id: this.id++, role: 'assistant', text: '', time: this.now() };
    this.messages.push(message);
    this.scrollToBottom();

    for (let i = 0; i < reply.length; i++) {
      message.text += reply[i];
      // every few characters, wait to mimic streaming
      if (i % 6 === 0) await this.delay(20 + Math.random() * 50);
    }

    this.isTyping = false;
    this.scrollToBottom();
  }

  generateMockReply(prompt: string) {
    const p = prompt.toLowerCase();
    if (p.includes('summarize')) {
      return '\n• Fast, accurate summaries\n• A dash of personality\n• Citations you can trust\n';
    }
    if (p.includes('joke')) {
      return "Why did the AI cross the road? To optimize the chicken's commute. 😄";
    }
    if (p.includes('analyze') || p.includes('insight')) {
      return 'Here are a few insights:\n1) Key trend detected.\n2) Recommendation: A/B test headline.\n3) Follow up with user research.';
    }
    return "I\'m Skunk AI — I can summarize, rewrite, and reason. Try asking me to summarize a doc, write a short email, or explain a concept.";
  }

  delay(ms: number) { return new Promise((r) => setTimeout(r, ms)); }

  scrollToBottom() {
    setTimeout(() => {
      const el = document.getElementById('chat-window');
      if (el) el.scrollTop = el.scrollHeight;
    }, 50);
  }
}
