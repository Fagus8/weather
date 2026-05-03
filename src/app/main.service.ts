import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MainService {
  newObjData: any[] = [];

  storeNewObjData(data: any[]) {
    this.newObjData = data;
  }
}