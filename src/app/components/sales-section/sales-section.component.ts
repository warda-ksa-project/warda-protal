import { Component, inject } from '@angular/core';
import { MainCardComponent } from '../main-card/main-card.component';
import { CardData } from '../main-card/main-card.interface';
import { OffersTimerComponent } from '../offers-timer/offers-timer.component';
import { ApiService } from '../../services/api.service';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { NgFor, NgIf } from '@angular/common';
import { environment } from '../../../environments/environment';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-sales-section',
  standalone: true,
  imports: [MainCardComponent, TranslatePipe, OffersTimerComponent, CarouselModule, NgFor, NgIf],
  templateUrl: './sales-section.component.html',
  styleUrl: './sales-section.component.scss'
})
export class SalesSectionComponent {


  customOptions: OwlOptions = {
    loop: true,
    margin: 10,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    rtl: true,
    dots: true,
    navSpeed: 700,
    center: false,
    responsive: {
      0: { items: 1 },
      600: { items: 2 },
      1000: { items: 4 }
    },
    nav: false
  };


  nearestExpireDate: string | null = null;

  productsList: CardData[] = [];

  api = inject(ApiService);

  ngOnInit(): void {
    this.getOffersList();
  }

  onBuyNow(productId: number) {
    console.log('تم الضغط على شراء الآن للمنتج:', productId);
  }

  onAddToWishlist(productId: number) {
    console.log('تمت الإضافة إلى المفضلة للمنتج:', productId);
  }

  getOffersList() {
    this.api.get('Portal/GetOfferProduct').subscribe((res: any) => {
      console.log(res);
      let allData: any;
      let limitedData: any;
      let updatedData: any;
      if (res.data) {
        allData = res.data as CardData[];
        limitedData = allData.length > 10 ? allData.slice(0, 10) : allData;
        // this.nearestExpireDate = this.getNearestExpireDate(limitedData) ?? null;
        updatedData = limitedData.map((item: any) => {
          if (item.image && item.image.length) {
            item.image = item.image.map((imgObj: any) => {
              const isFullUrl = imgObj.image.startsWith('http');
              return {
                ...imgObj,
                image: isFullUrl ? imgObj.image : `${environment.baseImageUrl}/${imgObj.image}`
              };
            });
          }
          return item;
        });
      }
      this.productsList = updatedData;
      console.log(this.productsList);
    });
  }

  // getNearestExpireDate(data: CardData[]): string | null {
  //   const now = new Date().getTime();

  //   const sorted = data
  //     .filter(item => item.endDate)
  //     .sort((a, b) => {
  //       const aTime = new Date(a.endDate!).getTime();
  //       const bTime = new Date(b.endDate!).getTime();
  //       return Math.abs(aTime - now) - Math.abs(bTime - now);
  //     });

  //   return sorted.length ? sorted[0].endDate || null : null;
  // }
}
