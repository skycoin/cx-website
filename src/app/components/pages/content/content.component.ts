import { Component, OnInit } from '@angular/core';
import { ContentService } from '../../../services/content.service';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss']
})
export class ContentComponent implements OnInit {
  content: string;

  constructor(
    private contentService: ContentService,
  ) { }

  ngOnInit() {
    this.content = this.contentService.getContent();
  }
}
