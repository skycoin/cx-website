import { Component, OnInit } from '@angular/core';
import { ContentService } from '../../../services/content.service';
import { Header } from '../../../services/markdown.service';
import { linkable } from '../../../utils/string';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss']
})
export class ContentComponent implements OnInit {
  content: string;
  headers: Header[];

  constructor(
    private contentService: ContentService,
  ) { }

  ngOnInit() {
    this.content = this.contentService.getContent();
    this.headers = this.contentService.headers;
  }

  href(text: string) {
    return '' + linkable(text);
  }
}
