import { Component, computed, input } from '@angular/core';
import { SyntaxHighlighterDirective } from '../syntax-highlighter/syntax-highlighter.directive';
import { SupportedLanguages } from '../syntax-highlighter/syntax-highlighter.provider';

@Component({
  imports: [SyntaxHighlighterDirective],
  selector: 'app-code-block',
  preserveWhitespaces: true,
  template: `@let filename = fileName();
    <pre [class.pre-with-filename]="!!filename">@if (filename) {
    <span class="filename">{{ filename }}</span>
  }<code highlight [language]="_language()"><ng-content></ng-content></code></pre>`,
  styles: [
    `
      pre {
        code {
          display: block;
          padding: 0.25rem 1rem 1rem;
          background-color: var(--mat-sys-surface-container);
          border-radius: 0.5rem;
          border: 1px solid var(--mat-sys-surface-variant);
          line-height: 1.5;
          overflow-x: auto;
        }

        &.pre-with-filename {
          display: block;
          position: relative;
          padding: 0.75rem 0.5rem 0rem;
          background-color: var(--mat-sys-surface-container);
          border-radius: 0.5rem;
          border: 1px solid var(--mat-sys-surface-variant);

          .filename {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            padding: 0.75rem;
            display: block;
            text-align: left;
            background-color: var(--mat-sys-primary-container);
            border-bottom: 1px solid var(--mat-sys-surface-variant);
            border-top-left-radius: 0.5rem;
            border-top-right-radius: 0.5rem;
            font-family: sans-serif;
            font-style: italic;
            letter-spacing: 0.05rem;
            font-size: 0.85rem;
          }

          code {
            display: block;
            padding: 0;
            background-color: unset;
            border-radius: unset;
            border: unset;
          }
        }
      }
    `,
  ],
})
export class CodeBlockComponent {
  fileName = input<string>();
  language = input<SupportedLanguages>();
  _language = computed(() => {
    return this.language() ?? 'typescript';
  });
}
