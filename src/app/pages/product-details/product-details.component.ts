import { DatePipe, NgClass, NgFor, NgIf, NgStyle } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ApiService } from '../../services/api.service';
import { LanguageService } from '../../services/language.service';
import { ToasterService } from '../../services/toaster.service';
import { TabsModule } from 'primeng/tabs';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [NgFor, NgIf, TranslatePipe, BreadcrumbModule, NgStyle, NgClass, TabsModule],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss'
})

export class ProductDetailsComponent {

  toaster = inject(ToasterService);
  api = inject(ApiService);
  router = inject(Router);
  route = inject(ActivatedRoute);
  languageService = inject(LanguageService);
  selectedLang: string = localStorage.getItem('lang') || 'ar';
  breadcrumb: any;
  productId: any;
  traderId: any;
  ProductDetails: any;
  mainImage: any;
  selectedImageId: any;
  zoomVisible = false;
  zoomLensStyle: any = {};
  zoomResultStyle: any = {};
  itemCount: number = 1;
  now = new Date();


  descriptionObject: any;

  // data = {
  //   "id": 2,
  //   "arName": "890890",
  //   "enName": "908",
  //   "enDescription": "<p>0980980</p>",
  //   "arDescription": "<p>098</p>",
  //   "mainCategoryNameAr": "مان",
  //   "mainCategoryNameEn": "Main",
  //   "subCategoryNameAr": "89089",
  //   "subCategoryNameEn": "9843",
  //   "categoryId": 4,
  //   "image": [
  //     {
  //       "id": 1,
  //       "productId": 2,
  //       "image": "https://images.pexels.com/photos/674010/pexels-photo-674010.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  //       "mediaTypeEnum": 1
  //     },
  //     {
  //       "id": 2,
  //       "productId": 2,
  //       "image": "https://wardaweb-001-site1.qtempurl.com/images/Products/046a7bff-bfe9-4ff4-8db9-2610defcddee.png",
  //       "mediaTypeEnum": 1
  //     },
  //     {
  //       "id": 3,
  //       "productId": 2,
  //       "image": "https://images.pexels.com/photos/1133957/pexels-photo-1133957.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  //       "mediaTypeEnum": 1
  //     },
  //     {
  //       "id": 1,
  //       "productId": 2,
  //       "image": "https://images.pexels.com/photos/674010/pexels-photo-674010.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  //       "mediaTypeEnum": 1
  //     },
  //     {
  //       "id": 2,
  //       "productId": 2,
  //       "image": "https://wardaweb-001-site1.qtempurl.com/images/Products/046a7bff-bfe9-4ff4-8db9-2610defcddee.png",
  //       "mediaTypeEnum": 1
  //     },
  //     {
  //       "id": 3,
  //       "productId": 2,
  //       "image": "https://images.pexels.com/photos/1133957/pexels-photo-1133957.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  //       "mediaTypeEnum": 1
  //     }
  //   ],
  //   "productReviews": [
  //     {
  //       "prodcutId": 2,
  //       "userId": 9,
  //       "userName": "test",
  //       "userImage": 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=2080&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  //       "addedDate": "2025-03-29T08:25:44.3392569",
  //       "reviews": 0.00,
  //       "note": "تجربتي مع وردة كانت مثالية من البداية!  الطلب تم بكل سهولة، والتوصيل كان سريعًا وفي الموعد المحدد. الزهور وصلت بجودة رائعة تمامًا كما توقعتها – طازجة، مرتبة بعناية، ورائحتها مذهلة! فريقهم محترف ومتعاون جدًا، ولم أواجه أي مشكلة خلال العملية. بكل بساطة، تجربة رائعة وسأطلب منهم مرة أخرى بالتأكيد!"
  //     },
  //     {
  //       "prodcutId": 2,
  //       "userId": 4,
  //       "userName": "Essam",
  //       "userImage": '',
  //       "addedDate": "2025-03-29T17:51:12.7332154",
  //       "reviews": 4.00,
  //       "note": "تجربتي مع وردة كانت مثالية من البداية!  الطلب تم بكل سهولة، والتوصيل كان سريعًا وفي الموعد المحدد. الزهور وصلت بجودة رائعة تمامًا كما توقعتها – طازجة، مرتبة بعناية، ورائحتها مذهلة! فريقهم محترف ومتعاون جدًا، ولم أواجه أي مشكلة خلال العملية. بكل بساطة، تجربة رائعة وسأطلب منهم مرة أخرى بالتأكيد!"
  //     },
  //     {
  //       "prodcutId": 2,
  //       "userId": 10,
  //       "userName": "new user",
  //       "userImage": 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=2080&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  //       "addedDate": "2025-03-29T08:56:45.5376769",
  //       "reviews": 4.00,
  //       "note": ""
  //     }

  //   ],
  //   "reviewAverage": 2.67,
  //   "startDate": null,
  //   "endDate": null,
  //   "stockQuantity": 98098.00,
  //   "hasDiscount": false,
  //   "discountType": 0,
  //   "amount": 0.00,
  //   "price": 32.00,
  //   "traderId": 0,
  //   "priceAfterDiscount": 32.00
  // }
  data: any;


  constructor(private translate: TranslateService) {
  }

  ngOnInit(): void {
    this.productId = this.route.snapshot.paramMap.get('productId');
    this.traderId = this.route.snapshot.paramMap.get('traderId');
    this.descTransaltion()
    this.getProductDetails(+this.productId);
    this.breadcrumb = [
      { label: this.translate.instant('TRADERS_DETAILS.HOME'), routerLink: '/' },
      { label: this.translate.instant('TRADERS_DETAILS.TRADERS_LIST') },
    ]

    this.selectedLang = this.languageService.translationService.currentLang || 'ar';
    this.languageService.translationService.onLangChange.subscribe(lang => {
      this.selectedLang = lang.lang;
      this.descTransaltion()
    });
  }

  descTransaltion() {
    this.descriptionObject = [
      { title: this.translate.instant('PRODUCT_DETAILS.FEATURE_1_TITLE'), desc: this.translate.instant('PRODUCT_DETAILS.FEATURE_1_DESC') },
      { title: this.translate.instant('PRODUCT_DETAILS.FEATURE_2_TITLE'), desc: this.translate.instant('PRODUCT_DETAILS.FEATURE_2_DESC') },
      { title: this.translate.instant('PRODUCT_DETAILS.FEATURE_3_TITLE'), desc: this.translate.instant('PRODUCT_DETAILS.FEATURE_3_DESC') },
      { title: this.translate.instant('PRODUCT_DETAILS.FEATURE_4_TITLE'), desc: this.translate.instant('PRODUCT_DETAILS.FEATURE_4_DESC') },
      { title: this.translate.instant('PRODUCT_DETAILS.FEATURE_5_TITLE'), desc: this.translate.instant('PRODUCT_DETAILS.FEATURE_5_DESC') }
    ];
  }

  getProductDetails(productId: number) {
    // this.mainImage = this.data.image[0].image;
    this.api.get(`Portal/GetProductById?Id=${productId}`).subscribe((item: any) => {
      console.log(item.data);
      this.data = item.data;
      this.mainImage = item.data.image[0].image;
    })
  }

  onImageClick(id: number) {
    this.selectedImageId = id;
    const selectedImg = this.data.image.find((img: any) => img.id === id);
    if (selectedImg) {
      this.mainImage = selectedImg.image;
    }
  }

  onMouseMove(event: MouseEvent, imageWrapper: HTMLElement, zoomImage: HTMLImageElement) {
    this.zoomVisible = true;

    const zoomFactor = 2;
    const lensWidth = 120;
    const lensHeight = 120;

    const rect = imageWrapper.getBoundingClientRect();
    const imageRect = zoomImage.getBoundingClientRect();

    let x = event.clientX - rect.left - lensWidth / 2;
    let y = event.clientY - rect.top - lensHeight / 2;

    x = Math.max(0, Math.min(x, rect.width - lensWidth));
    y = Math.max(0, Math.min(y, rect.height - lensHeight));

    this.zoomLensStyle = {
      top: `${y}px`,
      left: `${x}px`,
      width: `${lensWidth}px`,
      height: `${lensHeight}px`
    };
    this.zoomResultStyle = {
      'background-image': `url(${this.mainImage})`,
      'background-size': `${imageRect.width * zoomFactor}px ${imageRect.height * zoomFactor}px`,
      'background-position': `-${x * zoomFactor}px -${y * zoomFactor}px`,
      'background-repeat': 'no-repeat',
      'border': '1px solid #ddd',
      'width': '300px',
      'height': '300px',
      'border-radius': '8px'
    };
  }

  onMouseLeave() {
    this.zoomVisible = false;
  }

  itemMinus() {
    if (this.itemCount > 1) {
      this.itemCount--;
    }
  }

  itemPlus() {
    this.itemCount++;
  }

  ormatDateToDDMMYYYY(dateInput: string | Date): string {
    const date = new Date(dateInput);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
  }

}
