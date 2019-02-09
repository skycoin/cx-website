import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  MAT_DIALOG_DEFAULT_OPTIONS, MatButtonModule,
  MatDialogModule, MatInputModule,
  MatTooltipModule
} from '@angular/material';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/pages/home/home.component';
import { ContentComponent } from './components/pages/content/content.component';
import { HeaderComponent } from './components/layout/header/header.component';
import { EditorComponent } from './components/pages/editor/editor.component';
import { ShareComponent } from './components/pages/editor/share/share.component';
import { ExamplesComponent } from './components/pages/editor/examples/examples.component';
import { DialogComponent } from './components/layout/dialog/dialog.component';
import { BookComponent } from './components/pages/book/book.component';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ContentComponent,
    HeaderComponent,
    EditorComponent,
    ShareComponent,
    ExamplesComponent,
    DialogComponent,
    BookComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    MatTooltipModule,
    MatDialogModule,
    MatInputModule,
    MatButtonModule,
  ],
  entryComponents: [
    DialogComponent,
    ShareComponent,
    ExamplesComponent,
  ],
  providers: [
    { provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: { width: '500px', hasBackdrop: true }}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
