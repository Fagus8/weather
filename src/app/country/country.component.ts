import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CountryService {
  constructor(private http: HttpClient) { }

  fetchCountryData(): Observable<any[]> {
    return this.http.get<any>('https://countriesnow.space/api/v0.1/countries/state/cities');
  }
}