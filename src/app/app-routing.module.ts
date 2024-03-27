import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Path } from 'leaflet';
import { HomeComponent } from './home/home.component';
import { DetailComponent } from './detail/detail.component';




const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'detail', component: DetailComponent }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }