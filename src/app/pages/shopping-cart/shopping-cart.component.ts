import { NgClass, NgFor, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ApiService } from '../../services/api.service';
import { LanguageService } from '../../services/language.service';
import { ToasterService } from '../../services/toaster.service';

@Component({
  selector: 'app-shopping-cart',
  standalone: true,
  imports: [BreadcrumbModule, NgFor, NgIf, TranslatePipe, NgClass],
  templateUrl: './shopping-cart.component.html',
  styleUrl: './shopping-cart.component.scss'
})
export class ShoppingCartComponent {
  toaster = inject(ToasterService);
  api = inject(ApiService);
  router = inject(Router);
  route = inject(ActivatedRoute);
  languageService = inject(LanguageService);
  selectedLang: string = localStorage.getItem('lang') || 'ar';
  breadcrumb: any;
  shoppingCartList: any;
  itemCount: number = 1;


  constructor(private translate: TranslateService) {
  }

  ngOnInit(): void {
    this.breadcrumb = [
      { label: 'Home', routerLink: '/' },
      { label: 'Shopping Cart' },
    ];
    this.getShoppingCartList();
    this.selectedLang = this.languageService.translationService.currentLang || 'ar';
    this.languageService.translationService.onLangChange.subscribe(lang => {
      this.selectedLang = lang.lang;
    });
  }

  getShoppingCartList() {
    this.api.get('portal/ShoppingCart/GetAll/2').subscribe((res: any) => {
      this.shoppingCartList = res.data;
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

  addToFav(productId: any) {
    this.api.post(`portal/ShoppingCart/AddToAndRemoveFromWish?productId=${productId}`, {}).subscribe((res: any) => {
     this.toaster.successToaster(res.message);
     this.getShoppingCartList();

    })
  }

  removeShoppingCart(productId: any) {
    this.api.deleteWithoutParam(`portal/ShoppingCart/RemoveItem/${productId}`).subscribe((res: any) => {
      this.getShoppingCartList();
    })
  }

  deleteAllCarts() {
    this.api.deleteWithoutParam(`portal/ShoppingCart/RemoveCart`).subscribe((res: any) => {
      this.getShoppingCartList();
    })
  }

  itemMinus() {
    if (this.itemCount > 1) {
      this.itemCount--;
    }
  }

  itemPlus() {
    this.itemCount++;
  }

}
