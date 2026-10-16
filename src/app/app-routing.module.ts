import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ResortListComponent } from './pages/resort-list/resort-list.component';
import { ResortDetailComponent } from './pages/resort-detail/resort-detail.component';
import { CityComponent } from './pages/city/city.component';
import { DetailComponent } from './pages/detail/detail.component';

const routes: Routes = [
  { path: '', component: ResortListComponent },             // მთავარი: კურორტები
  { path: 'resort/:id', component: ResortDetailComponent }, // მაგ. /resort/gudauri
  { path: 'city', component: CityComponent },               // ძებნით ნაპოვნი ქალაქი
  { path: 'detail', component: DetailComponent },           // ქალაქის ერთი დღე საათებით
  { path: '**', redirectTo: '' }                            // ნებისმიერი სხვა არასწორი ლინკი
];

@NgModule({
  // გვერდის შეცვლისას ზემოთ ავიდეს
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'top' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
