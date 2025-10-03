import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-placeholder-page',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="min-h-[60vh] flex items-center justify-center">
      <div class="text-center max-w-xl mx-auto px-4">
        <div class="badge mb-4">Coming soon</div>
        <h2 class="text-3xl sm:text-4xl font-bold">This page is not built yet</h2>
        <p class="mt-3 text-slate-600 dark:text-slate-300">
          Keep prompting to fill this page with the exact experience you want. Meanwhile, you can explore the homepage.
        </p>
        <div class="mt-6 flex items-center justify-center gap-3">
          <a routerLink="/" class="btn-ghost">Back to Home</a>
        </div>
      </div>
    </section>
  `
})
export class PlaceholderPageComponent {}
