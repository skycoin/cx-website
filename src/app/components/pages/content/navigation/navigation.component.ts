import { Component, Input, OnInit } from '@angular/core';
import { Header } from '../../../../services/markdown.service';
import { linkable } from '../../../../utils/string';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {
  @Input() headers: Header[];

  constructor() { }

  ngOnInit() {
  }

  href(text: string) {
    return linkable(text);
  }
}
