import { Component } from '@angular/core';
import { programs } from '../../../../utils/examples';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-examples',
  templateUrl: './examples.component.html',
  styleUrls: ['./examples.component.scss']
})
export class ExamplesComponent {
  examplePrograms = programs;
  selected = 1;

  constructor(
    private dialog: MatDialogRef<ExamplesComponent>,
  ) { }

  load() {
    this.dialog.close(this.examplePrograms.find(p => p.id === Number(this.selected)));
  }
}
