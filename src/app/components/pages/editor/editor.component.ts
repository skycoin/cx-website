import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { fromEvent, Unsubscribable } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import hljs = require('highlight.js/lib/highlight');
import { restoreSelection, saveSelection } from '../../../utils/cursor';
import { programs } from '../../../utils/examples';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnInit, OnDestroy {
  @ViewChild('code') codeElement: ElementRef;

  examplePrograms = programs;

  private subscription: Unsubscribable;

  ngOnInit() {
    this.subscription = fromEvent(this.codeElement.nativeElement, 'input')
      .pipe(debounceTime(500))
      .subscribe(() => this.highlight());

    setTimeout(() => this.highlight(false), 100);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  private highlight(preserveSelection = true) {
    let selection;

    if (preserveSelection) {
      selection = saveSelection(this.codeElement.nativeElement);
    }

    this.codeElement.nativeElement.innerHTML = hljs.highlight('go', this.codeElement.nativeElement.innerText).value;

    if (preserveSelection) {
      restoreSelection(this.codeElement.nativeElement, selection);
    }
  }
}
