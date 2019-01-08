import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/pages/home/home.component';
import { ContentComponent } from './components/pages/content/content.component';
import { ContentGuard } from './services/content.guard';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: '**', component: ContentComponent, canActivate: [ContentGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
