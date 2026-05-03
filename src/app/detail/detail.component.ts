import { Component, OnInit } from '@angular/core';
import { MainService } from '../main.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DetailComponent implements OnInit {
  newObjData: any[] = [];
  
  constructor(
    private mainService: MainService, 
    private router: Router
  ) {}

  ngOnInit(): void {
    // მონაცემების წამოღება სერვისიდან
    this.newObjData = this.mainService.newObjData;
    
    // უსაფრთხოების შემოწმება: თუ მონაცემები არ არის (მაგალითად რეფრეშის დროს),
    // მომხმარებელი ავტომატურად ბრუნდება მთავარ გვერდზე
    if (!this.newObjData || this.newObjData.length === 0) {
      this.backToHome();
    }
  }

  // ფუნქცია Home-ზე დასაბრუნებლად
  backToHome(): void {
    this.router.navigate(['/home']);
  }
}