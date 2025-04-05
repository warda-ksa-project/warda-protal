import { NgStyle, NgIf, NgFor } from '@angular/common';
import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, inject } from '@angular/core';
import { ProgressBarModule } from 'primeng/progressbar';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { CardData } from './main-card.interface';
import { SkeletonModule } from 'primeng/skeleton';
import { TranslatePipe } from '@ngx-translate/core';
import { TooltipModule } from 'primeng/tooltip';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main-card',
  standalone: true,
  imports: [NgStyle, NgIf, NgFor,TooltipModule, SkeletonModule ,TranslatePipe,ProgressBarModule, InputIconModule, IconFieldModule],
  templateUrl: './main-card.component.html',
  styleUrl: './main-card.component.scss'
})
export class MainCardComponent implements OnInit, OnDestroy {
  @Input() cardData: CardData = {}; // ✅ Default empty object to prevent undefined errors

  @Output() buyNow = new EventEmitter<number>();
  @Output() addToWishlist = new EventEmitter<number>();
  @Output() viewProduct = new EventEmitter<number>();
  backgroundImageUrl: string = 'url(../../../../../assets/images/background/no-image.png)';
  @Input() loading: boolean = false;
  router = inject(Router);

  ngOnInit() {
    this.resolveImage();
    setTimeout(() => {
      this.loading = false;
    }, 2000); // Simulate 2 seconds loading
  }


  ngOnDestroy(): void {
    console.log(this.cardData);

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

  onBuyNow() {
    if (this.cardData?.id !== undefined) {
      this.buyNow.emit(this.cardData.id);
    }
  }

  onViewProduct() {
    if (this.cardData?.id !== undefined) {
      this.viewProduct.emit(this.cardData.id);
      this.router.navigate(['product_details' , this.cardData.id])

    }
  }

  onAddToWishlist() {
    if (this.cardData?.id !== undefined) {
      this.addToWishlist.emit(this.cardData.id);
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

    return "url(../../../../../assets/images/background/no-image.png)"; // ✅ also no quotes
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
          this.backgroundImageUrl = 'url(../../../../../assets/images/background/no-image.png)';
        };
        img.src = image.image;
        return;
      }
    }

    // No image found
    this.backgroundImageUrl = 'url(../../../../../assets/images/background/no-image.png)';
  }


}
