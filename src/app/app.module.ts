import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ResortListComponent } from './pages/resort-list/resort-list.component';
import { ResortDetailComponent } from './pages/resort-detail/resort-detail.component';
import { CityComponent } from './pages/city/city.component';
import { DetailComponent } from './pages/detail/detail.component';
import { ResortCardComponent } from './shared/components/resort-card/resort-card.component';
import { LanguageSwitcherComponent } from './shared/components/language-switcher/language-switcher.component';
import { LocationSearchComponent } from './shared/components/location-search/location-search.component';
import { LocationMapComponent } from './shared/components/location-map/location-map.component';

// თარგმანები იტვირთება ფაილებიდან: assets/i18n/ka.json, en.json, ru.json
export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    ResortListComponent,
    ResortDetailComponent,
    CityComponent,
    DetailComponent,
    ResortCardComponent,
    LanguageSwitcherComponent,
    LocationSearchComponent,
    LocationMapComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    TranslateModule.forRoot({
      defaultLanguage: 'ka',
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
      }
    })
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
