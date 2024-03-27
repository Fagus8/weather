import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MainService {
  arrC: any[] = []; // Declare arrC property
  newObjData: any[] = []; // Initialize as an empty array
  day: any[] = []; // Initialize as an empty array

  constructor(private http: HttpClient) {}

  storeNewObjData(data: any[]): void {
    this.newObjData = data;
  }

  storeNewDay(datas: any[]): void {
    this.day = datas;
  }

  sendCountry(data: any[]): void {
    this.arrC = data; // Assign the fetched data to arrC
  }
}

