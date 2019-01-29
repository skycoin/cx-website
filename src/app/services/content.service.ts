import { Injectable } from '@angular/core';
import { Header, MarkdownService } from './markdown.service';

@Injectable({
  providedIn: 'root'
})
export class ContentService {
  content: string;
  headers: Header[];

  constructor(
    private markdownService: MarkdownService,
  ) { }

  setContent(input: string) {
    this.content = input;
  }

  renderContent() {
    this.content = this.markdownService.markdownToHtml(this.content);
    this.headers = this.markdownService.getHeaders();
  }

  getContent() {
    this.renderContent();

    return this.content;
  }
}
