import { Injectable } from '@angular/core';
import * as MarkdownIt from 'markdown-it';
import { headerAnchors } from '../utils/markdown/header-anchors';
import { headerNavigation } from '../utils/markdown/header-navigation';
import { imagePath } from '../utils/markdown/image-path';
import hljs = require('highlight.js/lib/highlight');
import go = require('highlight.js/lib/languages/go');

hljs.registerLanguage('go', go);

@Injectable({
  providedIn: 'root'
})
export class MarkdownService {
  private md;

  constructor() {
    this.md = new MarkdownIt({
      html: true,
      highlight: this.highlight.bind(this),
    });

    this.md.use(headerAnchors);
    this.md.use(headerNavigation);
    this.md.use(imagePath);
  }

  markdownToHtml(text: string): string {
    const env = {};
    const tokens = this.md.parse(text, env);

    return this.md.renderer.render(tokens, this.md.options, env);
  }

  private highlight(str, lang) {
    if (lang) {
      if (lang === 'cx') {
        lang = 'go';
      }

      return `<pre class="hljs"><code>${hljs.highlight(lang, str).value}</code></pre>`;
    }

    return `<pre class="hljs"><code>${this.md.utils.escapeHtml(str)}</code></pre>`;
  }
}
