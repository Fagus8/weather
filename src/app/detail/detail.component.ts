import { Component, OnInit } from '@angular/core';
import { MainService } from '../main.service';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DetailComponent implements OnInit {
  newObjData: any[] = [];
  days: any[] = [];
  g: any;
 new:any[] = []
 

  constructor(private mainService: MainService) {}

  ngOnInit(): void {
    console.log(this.days);
    this.newObjData = this.mainService.newObjData;
    this.days = this.mainService.day;
 
   
    
    console.log(this.newObjData);
    
  
  
  }
}
