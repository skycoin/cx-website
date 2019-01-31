import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { fromEvent, Unsubscribable } from 'rxjs';
import { debounceTime, filter } from 'rxjs/operators';
import hljs = require('highlight.js/lib/highlight');
import { restoreSelection, saveSelection } from '../../../utils/cursor';
import { programs } from '../../../utils/examples';
import { ApiService } from '../../../services/api.service';
import { MatDialog } from '@angular/material';
import { ShareComponent } from './share/share.component';
import { ExamplesComponent } from './examples/examples.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnInit, OnDestroy {
  @ViewChild('code') codeElement: ElementRef;

  examplePrograms = programs;
  output: string;

  private subscription: Unsubscribable;

  constructor(
    private apiService: ApiService,
    private dialog: MatDialog,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.route.queryParams
      .pipe(filter(params => params.code))
      .subscribe(params => {
        this.codeElement.nativeElement.innerText = window.atob(params.code);
      });

    this.subscription = fromEvent(this.codeElement.nativeElement, 'input')
      .pipe(debounceTime(500))
      .subscribe(() => this.highlight());

    setTimeout(() => this.highlight(false), 100);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  run() {
    this.apiService.executeCode(this.codeElement.nativeElement.innerText).subscribe((output) => {
      this.output = output;
    });
  }

  share() {
    this.dialog.open(ShareComponent, {
      data: window.btoa(this.codeElement.nativeElement.innerText),
    });
  }

  examples() {
    this.dialog.open(ExamplesComponent)
      .afterClosed()
      .pipe(filter(program => !!program))
      .subscribe(program => {
        this.codeElement.nativeElement.innerText = program.code.trim();
        this.highlight(false);
        this.output = null;
      });
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
