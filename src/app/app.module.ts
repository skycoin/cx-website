import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  MAT_DIALOG_DEFAULT_OPTIONS, MAT_SNACK_BAR_DEFAULT_OPTIONS, MatButtonModule,
  MatDialogModule, MatInputModule, MatSnackBarModule,
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
import { SafePipe } from './pipes/safe.pipe';
import { FooterComponent } from './components/layout/footer/footer.component';
import { ScrollToTopComponent } from './components/pages/content/scroll-to-top/scroll-to-top.component';
import { SidebarComponent } from './components/layout/sidebar/sidebar.component';
import { MenuComponent } from './components/layout/menu/menu.component';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ContentComponent,
    HeaderComponent,
    SidebarComponent,
    EditorComponent,
    ShareComponent,
    ExamplesComponent,
    DialogComponent,
    BookComponent,
    SafePipe,
    FooterComponent,
    ScrollToTopComponent,
    MenuComponent
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
    MatSnackBarModule,
  ],
  entryComponents: [
    DialogComponent,
    ShareComponent,
    ExamplesComponent,
  ],
  providers: [
    { provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: { width: '500px', hasBackdrop: true }},
    { provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: { duration: 3000 }},
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
