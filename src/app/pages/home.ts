import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="relative overflow-hidden">
      <div class="absolute inset-0 hero-gradient pointer-events-none"></div>
      <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-16 sm:pb-24">
        <div class="flex flex-col items-center text-center">
          <div class="badge mb-4">
            <span class="text-brand-700">New</span>
            <span class="text-slate-500">Skunk AI v1.0</span>
          </div>
          <h1 class="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white max-w-3xl">
            Skunk AI <span class="align-middle">🦨</span>
          </h1>
          <p class="mt-6 text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl">
            A sharp, stylish AI assistant that never stinks. Write, analyze, and automate with remarkable precision and personality.
          </p>
          <div class="mt-8 flex flex-col sm:flex-row gap-3">
            <a routerLink="/playground" class="btn-primary">Try Skunk AI</a>
            <a href="#features" class="btn-ghost">Learn more</a>
          </div>
        </div>

        <div class="mt-14 rounded-2xl border border-slate-200/70 dark:border-slate-800/70 bg-white/70 dark:bg-slate-900/40 backdrop-blur overflow-hidden shadow-xl">
          <div class="px-4 sm:px-6 py-3 border-b border-slate-200/60 dark:border-slate-800/60 flex items-center gap-2">
            <span class="size-2 rounded-full bg-red-400"></span>
            <span class="size-2 rounded-full bg-yellow-400"></span>
            <span class="size-2 rounded-full bg-green-400"></span>
            <span class="ml-auto text-xs text-slate-500">skunk-ai.ts</span>
          </div>
          <div class="p-4 sm:p-8 bg-slate-50/80 dark:bg-slate-950/30">
            <pre class="text-left text-[13px] leading-relaxed text-slate-800 dark:text-slate-100 overflow-auto"><code>
const prompt = "Summarize this article in 3 bullet points";
const result = await skunkAI.generate(&#123; prompt, tone: "witty" &#125;);
console.log(result);
// • Fast, accurate summaries
// • A dash of personality
// • Citations you can trust
            </code></pre>
          </div>
        </div>

        <section id="features" class="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6">
          <article class="rounded-2xl border border-slate-200/70 dark:border-slate-800/70 bg-white/70 dark:bg-slate-900/40 p-6 backdrop-blur">
            <div class="size-10 rounded-xl bg-brand-100 text-brand-700 flex items-center justify-center font-bold">1</div>
            <h3 class="mt-4 text-lg font-semibold">Sniff-smart Context</h3>
            <p class="mt-2 text-slate-600 dark:text-slate-300">Understands your intent and adapts to your style for on-point responses.</p>
          </article>
          <article class="rounded-2xl border border-slate-200/70 dark:border-slate-800/70 bg-white/70 dark:bg-slate-900/40 p-6 backdrop-blur">
            <div class="size-10 rounded-xl bg-brand-100 text-brand-700 flex items-center justify-center font-bold">2</div>
            <h3 class="mt-4 text-lg font-semibold">Odorless Accuracy</h3>
            <p class="mt-2 text-slate-600 dark:text-slate-300">High-fidelity outputs with transparent sources and citations.</p>
          </article>
          <article class="rounded-2xl border border-slate-200/70 dark:border-slate-800/70 bg-white/70 dark:bg-slate-900/40 p-6 backdrop-blur">
            <div class="size-10 rounded-xl bg-brand-100 text-brand-700 flex items-center justify-center font-bold">3</div>
            <h3 class="mt-4 text-lg font-semibold">Built for Flow</h3>
            <p class="mt-2 text-slate-600 dark:text-slate-300">Seamless keyboard-first UX with reusable prompts and templates.</p>
          </article>
        </section>

        <section id="credits" class="mt-14 max-w-3xl mx-auto text-center">
          <div class="rounded-2xl border border-slate-200/70 dark:border-slate-800/70 bg-white/70 dark:bg-slate-900/40 p-6 backdrop-blur">
            <h2 class="text-2xl font-semibold">Credits</h2>
            <p class="mt-3 text-slate-600 dark:text-slate-300">Created by <strong>Rudra Pandey</strong>. Rudra began exploring AI programming as early as 7th grade and has grown his skills over the years. Now in 10th grade, Rudra built the core of Skunk AI — an assistant that blends sharp reasoning with a playful personality. This project celebrates curiosity, persistence, and a passion for building intelligent tools.</p>
            <p class="mt-3 text-sm text-slate-500">If you'd like to collaborate or learn from Rudra's journey, get in touch using the contact links.</p>
          </div>
        </section>
      </div>
    </section>
  `,
})
export class HomePageComponent {}
