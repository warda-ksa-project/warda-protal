import { NgClass, NgFor, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ApiService } from '../../services/api.service';
import { LanguageService } from '../../services/language.service';
import { ToasterService } from '../../services/toaster.service';
import { LoginSignalUserDataService } from '../../services/login-signal-user-data.service';

@Component({
  selector: 'app-fav-items',
  standalone: true,
  imports: [BreadcrumbModule, NgFor, NgIf, TranslatePipe, NgClass],
  templateUrl: './fav-items.component.html',
  styleUrl: './fav-items.component.scss'
})
export class FavItemsComponent {

  toaster = inject(ToasterService);
  api = inject(ApiService);
  router = inject(Router);
  route = inject(ActivatedRoute);
  languageService = inject(LanguageService);
  selectedLang: string = localStorage.getItem('lang') || 'ar';
  breadcrumb: any;
  wishList: any;
authService = inject(LoginSignalUserDataService)

  constructor(private translate: TranslateService) {
  }

  ngOnInit(): void {
    this.breadcrumb = [
      { label: 'Home', routerLink: '/' },
      { label: 'Wish List' },
    ];
    this.getWishList();
    this.selectedLang = this.languageService.translationService.currentLang || 'ar';
    this.languageService.translationService.onLangChange.subscribe(lang => {
      this.selectedLang = lang.lang;
    });
  }

  getWishList() {
    this.api.get('portal/ShoppingCart/GetAll/1').subscribe((res: any) => {
      this.wishList = res.data;
    })
  }
  fallbackImages: { [productId: number]: boolean } = {};

  onImageError(event: Event, productId: number) {
    const imgElement = event.target as HTMLImageElement;
    if (!imgElement.src.includes('no-image.png')) {
      imgElement.src = 'assets/images/background/no-image.png';
      this.fallbackImages[productId] = true;
    }
  }

  addToCart(productId: any) {
    const cartObject = {
      "productId": productId,
      "quantity": 1
    }
    this.api.post('portal/ShoppingCart/AddToCart', cartObject).subscribe((res: any) => {
      this.toaster.successToaster('Item Addedd Auccesfully')
    })
  }

  removeWishItem(productId: any) {
    this.api.post(`portal/ShoppingCart/AddToAndRemoveFromWish?productId=${productId}` , {}).subscribe((res: any) => {
      this.toaster.successToaster('Products Removed');
      this.getWishList();
       this.authService.updateFavoriteCount();
    })
  }

  isDatePassedOrToday(dateToCheck: Date): boolean {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const checkDate = new Date(dateToCheck);
    checkDate.setHours(0, 0, 0, 0);
    return checkDate <= today;
  }
}
