import { Injectable } from '@angular/core';
import { MarkdownService } from './markdown.service';

@Injectable({
  providedIn: 'root'
})
export class ContentService {
  content: string;

  constructor(
    private markdownService: MarkdownService,
  ) { }

  loadContent(name: string) {
    return import(`../../assets/content/${name}`)
      .then((md) => this.content = md);
  }

  renderContent() {
    return this.markdownService.markdownToHtml(this.content);
  }
}
