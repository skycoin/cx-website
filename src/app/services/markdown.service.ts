import { Injectable } from '@angular/core';
import * as MarkdownIt from 'markdown-it';
import * as MarkdownItMeta from 'markdown-it-meta';
import hljs = require('highlight.js/lib/highlight');
import go = require('highlight.js/lib/languages/go');
import Token = require('markdown-it/lib/token');

hljs.registerLanguage('go', go);

export interface Header {
  text: string;
  level: number;
  children: Header[]|null;
}

@Injectable({
  providedIn: 'root'
})
export class MarkdownService {
  private headers: Header[] = [];
  private md;

  constructor() {
    this.md = new MarkdownIt({ highlight: this.highlight.bind(this) });

    this.md.use(MarkdownItMeta);
  }

  markdownToHtml(text: string): string {
    const env = {};
    const tokens = this.md.parse(text, env);
    console.log(tokens);
    this.processHeaders(tokens);
    return this.md.renderer.render(tokens, this.md.options, env);
  }

  getHeaders() {
    return this.headers;
  }

  private processHeaders(tokens: Token[]) {
    const buffer: Header[] = [];

    tokens.forEach((token, index) => {
      const match = token.tag.match(/h([12])/);

      if (match && token.type === 'heading_open') {
        buffer.push({
          text: tokens[index + 1].content,
          level: parseInt(match[1], 10),
          children: [],
        });
      }
    });

    let lastHeader: Header = null;

    buffer.forEach(header => {
      if (header.level === 1) {
        this.headers.push(header);
        lastHeader = header;
      } else {
        lastHeader.children.push(header);
      }
    });
  }

  private highlight(str, lang) {
    if (lang) {
      return `<pre class="hljs"><code>${hljs.highlight(lang, str).value}</code></pre>`;
    }

    return `<pre class="hljs"><code>${this.md.utils.escapeHtml(str)}</code></pre>`;
  }
}
