import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ResortListComponent } from './pages/resort-list/resort-list.component';
import { ResortDetailComponent } from './pages/resort-detail/resort-detail.component';
import { CityComponent } from './pages/city/city.component';
import { DetailComponent } from './pages/detail/detail.component';
import { PlaceComponent } from './pages/place/place.component';

const routes: Routes = [
  { path: '', component: ResortListComponent },             // მთავარი: კურორტები
  { path: 'resort/:id', component: ResortDetailComponent }, // მაგ. /resort/gudauri
  { path: 'place', component: PlaceComponent },             // ძებნით ნაპოვნი ადგილი: აღწერა და ამინდი
  { path: 'city', component: CityComponent },               // ქალაქის 5 დღის პროგნოზი (OpenWeatherMap)
  { path: 'detail', component: DetailComponent },           // ქალაქის ერთი დღე საათებით
  { path: '**', redirectTo: '' }                            // ნებისმიერი სხვა არასწორი ლინკი
];

@NgModule({
  // გვერდის შეცვლისას ზემოთ ავიდეს
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'top' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
