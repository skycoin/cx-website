import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Routes } from '@angular/router';

import { HomeComponent } from './components/pages/home/home.component';
import { ContentComponent } from './components/pages/content/content.component';
import { ContentGuard } from './services/content.guard';
import { EditorComponent } from './components/pages/editor/editor.component';
import { BookComponent } from './components/pages/book/book.component';

export const routes: Routes = [
  { path: '', component: HomeComponent, canActivate: [ContentGuard] },
  { path: 'editor', component: EditorComponent },
  { path: 'books/:book', component: BookComponent },
  { path: '**', component: ContentComponent, canActivate: [ContentGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { anchorScrolling: 'enabled' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
