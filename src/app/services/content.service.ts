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

  setContent(input: string) {
    this.content = this.markdownService.markdownToHtml(input);
  }

  getContent() {
    return this.content;
  }
}
