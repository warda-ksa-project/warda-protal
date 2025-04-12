import { NgFor, NgStyle, NgClass, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { TranslateService, TranslatePipe } from '@ngx-translate/core';
import { CarouselModule, OwlOptions, SlidesOutputData } from 'ngx-owl-carousel-o';
import { ApiService } from '../../services/api.service';
import { LanguageService } from '../../services/language.service';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import { ToasterService } from '../../services/toaster.service';

interface ProductCard {
  id: number;
  arName: string;
  enName: string;
  price: number;
  priceAfterDiscount: number;
  hasDiscount: boolean;
  image: string | null; // after mapping we make it a flat string
  reviewAverage: number;
  arDescription: string | null;
  enDescription: string | null;
  imageFailed?: boolean;

}

@Component({
  selector: 'app-latest-products',
  standalone: true,
  imports: [NgFor, TranslatePipe, CarouselModule, NgStyle, NgClass , NgIf],
  templateUrl: './latest-products.component.html',
  styleUrl: './latest-products.component.scss'
})
export class LatestProductsComponent {

  activeIndex: number = 1; // Set the default center slide index
  router = inject(Router);

  customOptions: OwlOptions = {
    loop: true,
    margin: 10,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    rtl: true,
    dots: true,
    navSpeed: 700,
    center: true, // Center active slide
    responsive: {
      0: { items: 1 },
      600: { items: 2 },
      1000: { items: 3 }
    },
    nav: false, // Remove navigation arrows
  };
      toaster = inject(ToasterService);
  

  selectedLang: string = localStorage.getItem('lang') || 'ar';

  api = inject(ApiService);
  languageService = inject(LanguageService);

  constructor(private translate: TranslateService) { }

  latestProducts: ProductCard[] = [];

  ngOnInit(): void {
    this.getLatestProducts();
    this.languageService.translationService.onLangChange.subscribe((lang: any) => {
      this.selectedLang = lang.lang;
    });
  }

  getLatestProducts() {
    const dataObject = {
      pageNumber: 0,
      pageSize: 10,
      mainCategoryId: null,
    };

    this.api.post('Portal/GetNewProducts', dataObject).subscribe((res: any) => {
      const allProducts = res.data?.dataList || [];
      const fallbackImage = 'assets/images/background/no-image.png';

      const imageChecks = allProducts.map((item: any) => {
        return new Promise<any>((resolve) => {
          if (Array.isArray(item.image)) {
            const validImage = item.image.find((img: any) => img.mediaTypeEnum === 1);
            if (validImage?.image) {
              const fullUrl = `${validImage.image}`;
              const img = new Image();

              img.onload = () =>
                resolve({ ...item, image: fullUrl, imageFailed: false }); // ✅ Valid image
              img.onerror = () =>
                resolve({ ...item, image: fallbackImage, imageFailed: true }); // ❌ Broken image
              img.src = fullUrl;

              return;
            }
          }

          // ❌ No valid image found
          resolve({ ...item, image: fallbackImage, imageFailed: true });
        });
      });

      Promise.all(imageChecks).then((results) => {
        this.latestProducts = results;
        console.log('Processed Products:', this.latestProducts);
      });
    });
  }


  onViewProduct(id: any) {
    this.router.navigate(['product_details', id])
  }

  addToCart(id: any) {
      const cartObject = {
        "productId": id,
        "quantity": 1
      }
      this.api.post('portal/ShoppingCart/AddToCart' ,cartObject).subscribe((res: any) => {
        this.toaster.successToaster(res.message)
      })
  }


}
