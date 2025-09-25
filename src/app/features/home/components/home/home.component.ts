import { Component , OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BannerComponent } from '../../../../shared/components/banner/banner.component';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, BannerComponent,MatCardModule, MatButtonModule, MatIconModule,],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})

export class HomeComponent{
  promotions = [
    { image: 'assets/images/banners/banner1.jpg', buttonText: 'Ver más', link: '/cart' },
    { image: 'assets/images/banners/banner3.jpg', buttonText: 'Ver más', link: '/cart' },
  ];

  information = [
    { image: 'assets/images/banners/banner2.jpg', buttonText: 'Ver más', link: '/productos' },
  ];
  
  recentproducts: any[] = []; 

  recommendedProducts: any[] = []; 

  constructor() {}

}
