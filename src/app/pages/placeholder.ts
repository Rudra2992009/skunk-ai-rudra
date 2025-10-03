import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { scrapeUrl } from '../services/web-scraper';

interface Message {
  id: number;
  role: 'user' | 'assistant' | 'system';
  text: string;
  time: string;
}

interface Conversation {
  id: number;
  title: string;
  messages: Message[];
  updatedAt: string;
}

@Component({
  selector: 'app-playground',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="max-w-7xl mx-auto px-4 py-8">
      <div class="flex items-start gap-6">
        <!-- Sidebar: Conversations -->
        <aside class="w-80 hidden lg:block">
          <div class="sticky top-20">
            <div class="flex items-center justify-between mb-4">
              <div>
                <h2 class="text-lg font-semibold">Conversations</h2>
                <p class="text-xs text-slate-400">Organize your chats with Skunk AI</p>
              </div>
              <button class="btn-ghost" (click)="newConversation()">New</button>
            </div>

            <div class="space-y-3">
              <div *ngFor="let c of conversations" class="relative">
                <button (click)="selectConversation(c.id)" class="w-full text-left p-3 rounded-2xl border transition flex items-start gap-3" [ngClass]="{'border-brand-300 bg-gradient-to-r from-white to-brand-50 dark:from-slate-900 dark:to-slate-900/60 shadow-lg': c.id === activeConversationId, 'border-slate-200 dark:border-slate-800': c.id !== activeConversationId}">
                  <div class="flex-shrink-0">
                    <div class="w-10 h-10 rounded-lg bg-gradient-to-br from-brand-100 to-brand-200 text-brand-700 flex items-center justify-center font-bold">SK</div>
                  </div>
                  <div class="flex-1">
                    <div class="flex items-center justify-between">
                      <div class="font-semibold text-slate-800 dark:text-slate-100">{{c.title}}</div>
                      <div class="text-xs text-slate-400">{{c.updatedAt}}</div>
                    </div>
                    <div class="text-sm text-slate-500 mt-1 line-clamp-2">{{c.messages[c.messages.length-1]?.text || 'No messages yet'}}</div>
                  </div>
                </button>
                <button (click)="deleteConversation(c.id)" title="Delete" class="absolute right-1 top-1 text-xs text-red-500">×</button>
              </div>
            </div>

            <div class="mt-6 text-xs text-slate-500">Tip: Create separate conversations for different projects or topics.</div>
          </div>
        </aside>

        <!-- Main chat area -->
        <div class="flex-1 min-h-[65vh] flex flex-col">
          <div class="mb-4 flex items-center justify-between">
            <div>
              <a routerLink="/" class="text-sm text-slate-500 hover:text-slate-700">← Back</a>
              <h1 class="text-2xl sm:text-3xl font-extrabold mt-3">Skunk AI Playground</h1>
              <p class="text-sm text-slate-500 mt-1">Chat with Skunk AI — quick, clever replies with sources when needed.</p>
            </div>
            <div class="flex items-center gap-3">
              <button class="btn-ghost" (click)="clearConversation()">Reset</button>
              <button class="btn-primary" (click)="newConversation()">New Conversation</button>
            </div>
          </div>

          <div class="flex-1 rounded-2xl border border-slate-200/70 dark:border-slate-800/70 bg-white/70 dark:bg-slate-900/40 p-0 overflow-hidden shadow">

            <!-- Fancy header -->
            <div class="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-800/60 bg-gradient-to-r from-white/60 to-brand-50/30 dark:from-slate-900/40">
              <div class="flex items-center gap-3">
                <div class="w-12 h-12 rounded-md bg-gradient-to-tr from-brand-500 to-brand-300 text-white flex items-center justify-center font-bold text-lg">SK</div>
                <div>
                  <div class="font-semibold">{{activeConversation?.title || 'New Conversation'}}</div>
                  <div class="text-xs text-slate-400">{{activeConversation?.updatedAt}}</div>
                </div>
              </div>
              <div class="flex items-center gap-3">
                <button class="btn-ghost" (click)="shareTranscript()">Share</button>
                <button class="btn-ghost" (click)="exportTranscript()">Export</button>
              </div>
            </div>

            <!-- Messages -->
            <div id="chat-window" class="h-[56vh] sm:h-[62vh] overflow-auto p-6 flex flex-col gap-4 bg-[linear-gradient(180deg,#fff,rgba(0,0,0,0))]">
              <div *ngIf="!activeConversation || activeConversation.messages.length===0" class="text-center text-slate-400 mt-12">
                Start by asking something — try: "Summarize this article in 3 bullet points"
              </div>

              <div *ngFor="let m of activeConversation?.messages" class="flex" [ngClass]="{'justify-end': m.role === 'user'}">
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

            <!-- Composer -->
            <div class="px-4 py-4 border-t border-slate-100 dark:border-slate-800/60 bg-white/60 dark:bg-slate-900/30">
              <form (submit)="onSubmit($event)" class="flex items-center gap-3">
                <div class="flex-1 relative">
                  <input [(ngModel)]="input" name="prompt" class="w-full rounded-full border border-slate-200/60 dark:border-slate-800/60 bg-white/90 dark:bg-slate-900/30 px-4 py-3 pr-4 focus:ring-2 focus:ring-brand-300 outline-none" placeholder="Ask Skunk AI anything — try: 'Summarize this article in 3 bullets'" />
                                  </div>
                <button type="submit" class="btn-primary" [disabled]="!input || isTyping">Send</button>
              </form>
              <div class="mt-2 text-xs text-slate-400">Tip: Use quick prompts for common tasks. This demo simulates responses locally.</div>
            </div>

          </div>

        </div>
      </div>
    </div>
  `
})
export class PlaceholderPageComponent {
  input = '';
  isTyping = false;
  private msgId = 1;
  conversations: Conversation[] = [];
  activeConversationId: number | null = null;

  constructor() {
    // seed with one conversation
    const now = this.now();
    const conv: Conversation = {
      id: 1,
      title: 'Welcome Chat',
      messages: [
        { id: this.msgId++, role: 'assistant', text: "Hey — I'm Skunk AI. What can I help you with today?", time: now }
      ],
      updatedAt: now
    };
    this.conversations.push(conv);
    this.activeConversationId = conv.id;
  }

  get activeConversation() {
    return this.conversations.find((c) => c.id === this.activeConversationId) || null;
  }

  now() { return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); }

  selectConversation(id: number) {
    this.activeConversationId = id;
    setTimeout(() => this.scrollToBottom(), 50);
  }

  newConversation() {
    const id = (this.conversations[this.conversations.length - 1]?.id || 0) + 1;
    const now = this.now();
    const conv: Conversation = { id, title: `Conversation ${id}`, messages: [], updatedAt: now };
    this.conversations.unshift(conv);
    this.activeConversationId = conv.id;
    setTimeout(() => this.scrollToBottom(), 50);
  }

  deleteConversation(id: number) {
    this.conversations = this.conversations.filter((c) => c.id !== id);
    if (this.activeConversationId === id) {
      this.activeConversationId = this.conversations[0]?.id ?? null;
    }
  }

  clearConversation() {
    const conv = this.activeConversation;
    if (!conv) return;
    conv.messages = [];
    conv.updatedAt = this.now();
    this.scrollToBottom();
  }

  onSubmit(e: Event) {
    e.preventDefault();
    this.sendMessage();
  }

  async sendMessage() {
    const text = this.input.trim();
    if (!text || !this.activeConversation) return;
    const conv = this.activeConversation;

    // Detect first URL in the message
    const urlMatch = text.match(/https?:\/\/\S+/i);
    if (urlMatch) {
      // push the user's message
      conv.messages.push({ id: this.msgId++, role: 'user', text, time: this.now() });
      conv.updatedAt = this.now();
      this.input = '';
      // fetch the URL and insert content or a summary
      await this.fetchUrlAndInsert(urlMatch[0], conv);
      setTimeout(() => this.scrollToBottom(), 50);
      return;
    }

    conv.messages.push({ id: this.msgId++, role: 'user', text, time: this.now() });
    conv.updatedAt = this.now();
    this.input = '';
    this.simulateAssistantResponse(text, conv);
    setTimeout(() => this.scrollToBottom(), 50);
  }

  quickPrompt(text: string) {
    this.input = text;
    this.sendMessage();
  }

  async simulateAssistantResponse(prompt: string, conv: Conversation) {
    this.isTyping = true;
    await this.delay(500 + Math.random() * 400);

    const reply = this.generateMockReply(prompt);

    const message: Message = { id: this.msgId++, role: 'assistant', text: '', time: this.now() };
    conv.messages.push(message);
    conv.updatedAt = this.now();
    this.scrollToBottom();

    for (let i = 0; i < reply.length; i++) {
      message.text += reply[i];
      if (i % 6 === 0) await this.delay(20 + Math.random() * 40);
    }

    this.isTyping = false;
    conv.updatedAt = this.now();
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
    if (p.includes('email')) {
      return 'Here is a friendly follow-up email:\n\nHi there,\n\nThanks for your time. I wanted to follow up on...\n\nBest regards,';
    }
    return "I\'m Skunk AI — I can summarize, rewrite, and reason. Try asking me to summarize a doc, write a short email, or explain a concept.";
  }

  // If a URL is provided, fetch and insert its content or a quick local summary
  async fetchUrlAndInsert(url: string, conv: Conversation) {
    // insert a system message about fetching
    conv.messages.push({ id: this.msgId++, role: 'system', text: `Fetching content from ${url}...`, time: this.now() });
    this.isTyping = true;
    this.scrollToBottom();

    const result = await scrapeUrl(url).catch((e) => ({ error: String(e) }));

    // remove the last system fetching message
    const lastIndex = conv.messages.findIndex((m) => m.role === 'system' && m.text.startsWith('Fetching content'));
    if (lastIndex >= 0) conv.messages.splice(lastIndex, 1);

    if (result.error) {
      conv.messages.push({ id: this.msgId++, role: 'assistant', text: `Unable to fetch URL: ${result.error}`, time: this.now() });
      this.isTyping = false;
      this.scrollToBottom();
      return;
    }

    const title = result.title || url;
    const content = result.text || '';

    // If model unavailable, we create a local summary from the content
    const summary = this.localSummarize(content || `Content could not be extracted from ${url}`);

    conv.messages.push({ id: this.msgId++, role: 'assistant', text: `Fetched: ${title}\n\n${summary}`, time: this.now() });
    this.isTyping = false;
    this.scrollToBottom();
  }

  // Very small, local summarizer: picks top sentences and returns 3 bullets
  localSummarize(text: string) {
    if (!text) return 'No extractable text found.';
    // Split into sentences (naive) and pick the first few meaningful ones
    const sentences = text.replace(/\n+/g, ' ').split(/(?<=[.!?])\s+/).map(s => s.trim()).filter(Boolean);
    if (sentences.length === 0) return 'No extractable text found.';
    const bullets = sentences.slice(0, 6).sort((a,b)=>b.length - a.length).slice(0,3);
    return bullets.map(b => `• ${b}`).join('\n');
  }

  // Create a plain-text transcript from a conversation
  generateTranscript(conv: Conversation) {
    const header = `${conv.title} - Updated: ${conv.updatedAt}`;
    const lines = conv.messages.map((m) => {
      const who = m.role === 'user' ? 'User' : m.role === 'assistant' ? 'Skunk AI' : 'System';
      return `[${m.time}] ${who}: ${m.text}`;
    });
    return `${header}\n\n${lines.join('\n\n')}\n`;
  }

  exportTranscript() {
    const conv = this.activeConversation;
    if (!conv) return;
    const text = this.generateTranscript(conv);
    const filename = `skunk-ai-${conv.id}-${new Date().toISOString().replace(/[:.]/g, '-')}.txt`;
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  async shareTranscript() {
    const conv = this.activeConversation;
    if (!conv) return;
    const text = this.generateTranscript(conv);
    const filename = `skunk-ai-${conv.id}-${new Date().toISOString().replace(/[:.]/g, '-')}.txt`;
    const blob = new Blob([text], { type: 'text/plain' });
    const file = new File([blob], filename, { type: 'text/plain' });

    // Preferred: Web Share API with files
    try {
      const nav: any = navigator;
      if (nav.share && nav.canShare && nav.canShare({ files: [file] })) {
        await nav.share({ files: [file], title: conv.title, text: 'Skunk AI conversation' });
        return;
      }
      // Fallback: share plain text via navigator.share
      if (nav.share) {
        await nav.share({ title: conv.title, text });
        return;
      }
    } catch (err) {
      console.warn('Share failed:', err);
    }

    // Final fallback: copy to clipboard and trigger download
    try {
      await this.copyToClipboard(text);
    } catch (e) {
      console.warn('Clipboard copy failed', e);
    }
    this.exportTranscript();
    alert('Transcript downloaded and copied to clipboard. Use your device to share the file.');
  }

  async copyToClipboard(text: string) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text);
    }
    return new Promise<void>((resolve) => {
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      ta.remove();
      resolve();
    });
  }

  delay(ms: number) { return new Promise((r) => setTimeout(r, ms)); }

  scrollToBottom() {
    setTimeout(() => {
      const el = document.getElementById('chat-window');
      if (el) el.scrollTop = el.scrollHeight;
    }, 60);
  }
}
