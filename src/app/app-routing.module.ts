import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClientComponent } from './client/client.component';
import { OverallComponent } from './overall/overall.component';

const routes: Routes = [
  { path: '', redirectTo: '/o', pathMatch: 'full' },
  { path: 'o', component: OverallComponent },
  { path: 'c', component: ClientComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
