import { NgStyle, NgIf, NgFor } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { ProgressBarModule } from 'primeng/progressbar';
import { SkeletonModule } from 'primeng/skeleton';
import { TooltipModule } from 'primeng/tooltip';
import { OffersTimerComponent } from '../offers-timer/offers-timer.component';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { ToasterService } from '../../services/toaster.service';
import { CardData } from '../main-card/main-card.interface';
import { PieceProductService } from '../../services/piece-products.service';
import { LoginSignalUserDataService } from '../../services/login-signal-user-data.service';

@Component({
  selector: 'app-piece-cards',
  standalone: true,
  imports: [NgStyle, NgIf, NgFor, TooltipModule, SkeletonModule, TranslatePipe, ProgressBarModule, InputIconModule, IconFieldModule, OffersTimerComponent],
  templateUrl: './piece-cards.component.html',
  styleUrl: './piece-cards.component.scss'
})
export class PieceCardsComponent {

  @Input() cardData: CardData = {};
  @Input() isOfferCardType: boolean = false;
  @Output() buyNow = new EventEmitter<number>();
  @Output() addToWishlist = new EventEmitter<number>();
  @Output() viewProduct = new EventEmitter<number>();
  backgroundImageUrl: string = 'url(../../../../../assets/images/background/no-image.png)';
  @Input() loading: boolean = false;
  router = inject(Router);
  api = inject(ApiService);
  toaster = inject(ToasterService);
  pieceProduct = inject(PieceProductService)
  authService = inject(LoginSignalUserDataService);


  ngOnInit() {
    this.resolveImage();
    setTimeout(() => {
      this.loading = false;
    }, 2000);
  }


  ngOnDestroy(): void {
  }

  get displayName(): string {
    return localStorage.getItem('lang') === 'ar' ? this.cardData?.arName || '' : this.cardData?.enName || '';
  }

  get displayDescription(): string {
    return localStorage.getItem('lang') === 'ar' ? this.cardData?.arDescription || '' : this.cardData?.enDescription || '';
  }

  get displayPrice(): string {
    return this.cardData?.hasDiscount && this.cardData?.priceAfterDiscount !== undefined
      ? `${this.cardData?.priceAfterDiscount} ر.س`
      : `${this.cardData?.price || 0} ر.س`;
  }

  get hasOldPrice(): boolean {
    return !!this.cardData?.hasDiscount && this.cardData?.price !== undefined;
  }

  get oldPrice(): string {
    return `${this.cardData?.price || 0} ر.س`;
  }

  addToCart() {
    if (this.cardData?.id !== undefined) {
      this.buyNow.emit(this.cardData.id);
      const cartObject = {
        "productId": this.cardData.id,
        "quantity": 1
      }
      this.api.post('portal/ShoppingCart/AddToCart', cartObject).subscribe((res: any) => {
        this.toaster.successToaster(res.message);
        this.authService.updateCartCount();
      })
    }
  }

  onViewProduct() {
    if (this.cardData?.id !== undefined) {
      this.viewProduct.emit(this.cardData.id);
      this.router.navigate(['product_details', this.cardData.id]);
    }
  }

  onAddToWishlist() {
    if (this.cardData?.id !== undefined) {
      this.addToWishlist.emit(this.cardData.id);
      const cartObject = {
        "productId": this.cardData.id,
        "quantity": 1
      }
      this.api.post('portal/ShoppingCart/AddtoWish', cartObject).subscribe((res: any) => {
        this.toaster.successToaster(res.message);
        this.authService.updateFavoriteCount();
      })
    }
  }

  get subCategoryName(): string {
    return localStorage.getItem('lang') === 'ar'
      ? this.cardData?.subCategoryNameAr || ''
      : this.cardData?.subCategoryNameEn || '';
  }

  getImageUrl(): string {
    const images = this.cardData?.image;

    if (images && images.length) {
      const image = images.find(img => img.mediaTypeEnum === 1);
      if (image) {
        return `url(${image.image})`; // ✅ no quotes!
      }
    }

    return "url(/assets/images/background/no-image.png)";
  }

  resolveImage() {
    const images = this.cardData?.image;

    if (images && images.length) {
      const image = images.find(img => img.mediaTypeEnum === 1);
      if (image) {
        const img = new Image();
        img.onload = () => {
          this.backgroundImageUrl = `url(${image.image})`;
        };
        img.onerror = () => {
          this.backgroundImageUrl = 'url(/assets/images/background/no-image.png)';
        };
        img.src = image.image;
        return;
      }
    }

    // No image found
    this.backgroundImageUrl = 'url(/assets/images/background/no-image.png)';
  }

  addTestItem() {
    this.pieceProduct.addItem({
      id: this.cardData.id,
      productId: this.cardData.id,
      traderId: this.cardData.traderId,
      nameAr: this.cardData.arName,
      nameEn: this.cardData.enName,
      image: this.cardData.image?.[0]?.image || 'assets/images/background/no-image.png',
      quantity: 0,
      price: this.cardData.price,
      priceAfterDiscount: this.cardData.priceAfterDiscount || 0
    });
  }


}

