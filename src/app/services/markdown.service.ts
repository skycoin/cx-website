import { Injectable } from '@angular/core';
import * as showdown from 'showdown';

@Injectable({
  providedIn: 'root'
})
export class MarkdownService {
  private converter;

  constructor() {
    this.converter = new showdown.Converter();
  }

  markdownToHtml(text: string): string {
    return this.converter.makeHtml(text);
  }
}
