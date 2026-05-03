import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { DetailComponent } from './detail/detail.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent }, // აუცილებელია ეს ხაზი
  { path: 'detail', component: DetailComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' }, // საწყისი გადამისამართება
  { path: '**', redirectTo: '/home' } // ნებისმიერი სხვა არასწორი ლინკი
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }