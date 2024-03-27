import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { WeatherMapComponent } from './weather-map/weather-map.component';
import { DetailComponent } from './detail/detail.component';



@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    WeatherMapComponent,
    DetailComponent,
  
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
// Provide correct service
  bootstrap: [AppComponent]
})
export class AppModule { }