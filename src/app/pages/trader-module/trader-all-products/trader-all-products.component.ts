import { NgIf, NgFor, NgClass } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { MainCardComponent } from '../../../components/main-card/main-card.component';
import { SubcategorySliderComponent } from '../../../components/subcategory-slider/subcategory-slider.component';
import { MainHeaderComponent } from '../../../shared/main-header/main-header.component';
import { ApiService } from '../../../services/api.service';
import { LanguageService } from '../../../services/language.service';
import { ToasterService } from '../../../services/toaster.service';
import { BannerData } from '../../../shared/main-header/main-header.interface';
import { SliderModule } from 'primeng/slider';
import { FormsModule } from '@angular/forms';
import { TooltipModule } from 'primeng/tooltip';
import { PaginationComponent } from '../../../components/pagination/pagination.component';

@Component({
  selector: 'app-trader-all-products',
  standalone: true,
  imports: [MainHeaderComponent, NgIf, NgFor, PaginationComponent, MainCardComponent, NgClass, SliderModule, TooltipModule, FormsModule, RouterModule, SubcategorySliderComponent, TranslatePipe],
  templateUrl: './trader-all-products.component.html',
  styleUrl: './trader-all-products.component.scss'
})
export class TraderAllProductsComponent {

  bannerInfo: BannerData | undefined;

  toaster = inject(ToasterService);
  api = inject(ApiService);
  router = inject(Router);
  route = inject(ActivatedRoute);
  languageService = inject(LanguageService);
  selectedLang: string = localStorage.getItem('lang') || 'ar';
  traderData: any;
  traderId: any;
  productType: any;
  productsList: any[] = [];

  allProductSearch: {
    pageNumber: number;
    pageSize: number;
    categoryId: number | null;
    traderId: string | null | number;
    fromPrice: number;
    toPrice: number;
    rate: number
  } = {
      pageNumber: 0,
      pageSize: 8,
      traderId: null,
      fromPrice: 0,
      toPrice: 0,
      categoryId: 0,
      rate: 0
    };
  offersProductSearch: any;
  rangeValues: number[] = [20, 500];
  priceFromValue: number = 20;
  priceToValue: number = 500;
  selectedRating: number = 5;
  subCategoryList: any;
  totalCount: number = 0;


  ratingObjectList = [
    { id: 5, image: 'assets/images/rating-images/5.svg', status: true },
    { id: 4, image: 'assets/images/rating-images/4.svg', status: false },
    { id: 3, image: 'assets/images/rating-images/3.svg', status: false },
    { id: 2, image: 'assets/images/rating-images/2.svg', status: false },
    { id: 1, image: 'assets/images/rating-images/1.svg', status: false },
  ]



  constructor(private translate: TranslateService) { }

  ngOnInit(): void {
    this.traderId = this.route.snapshot.paramMap.get('id');
    this.productType = this.route.snapshot.paramMap.get('type');
    this.traderData =
    {
      id: 4,
      name: "Omar",
      storeName: "omar",
      image: null,
      enDescription: this.productType == 'p' ? this.translate.instant('TRADERS_DETAILS.ALL_PRODUCTS') : this.translate.instant('TRADERS_DETAILS.OFFERS_AND_DISCOUNTS'),
      arDescription: this.productType == 'p' ? this.translate.instant('TRADERS_DETAILS.ALL_PRODUCTS') : this.translate.instant('TRADERS_DETAILS.OFFERS_AND_DISCOUNTS'),
      categories: [],
      reviewAverage: 10.00,
      traderReviews: [
        {
          userId: 4,
          reviews: 10.00,
          note: "asd"
        }
      ]
    }
    this.getSubcategoryByTraderid(this.traderId)


    if (this.traderId && this.productType) {
      this.getTradersById(this.traderId);
      this.setBannerInfo();
      this.allProductSearch.traderId = +this.traderId

      if (this.productType == 'p') {
        this.getProductsByTraderIdCategoryId(this.allProductSearch);
      } else if (this.productType == 'o') {
        this.getOffersProductsByTraderIdCategoryId(this.allProductSearch);
      } else {
        this.getPieceProductsByTraderIdCategoryId(this.allProductSearch)
      }
    }

    this.languageService.translationService.onLangChange.subscribe((lang: any) => {
      console.log(lang);
      this.selectedLang = lang.lang;
      this.setBannerInfo();
    });
  }

  setBannerInfo() {
    this.bannerInfo = {
      titleKey: this.traderData.name,
      descriptionKey: this.selectedLang == 'ar' ? this.traderData.arDescription : this.traderData.enDescription,
      imageUrl: '../../../assets/images/background/main-frame.png',
      breadcrumb: [
        { label: this.translate.instant('TRADERS_DETAILS.HOME'), routerLink: '/' },
        { label: this.translate.instant('TRADERS_DETAILS.TRADERS_LIST'), routerLink: '/traders_list' },
        { label: this.traderData.name, routerLink: `/trader_details/${this.traderId}` },
        { label: this.productType == 'p' ? this.translate.instant('TRADERS_DETAILS.ALL_PRODUCTS') : this.translate.instant('TRADERS_DETAILS.OFFERS_AND_DISCOUNTS') }
      ]
    };
  }

  getTradersById(id: string) {
    this.api.get(`Portal/PortalGetTraderById?Id=${id}`).subscribe({
      next: (res: any) => {
        console.log(res);
        this.traderData = res.data;
      }
    });
  }

  getProductsByTraderIdCategoryId(search: any) {
    this.api.post('Portal/GetProductByCategoryIdAndTraderId', search).subscribe((res: any) => {
      console.log(res);
      this.productsList = res.data.dataList;
      this.totalCount = res.data.totalCount;
    })
  }

  getOffersProductsByTraderIdCategoryId(search: any) {
    this.api.post('Portal/GetOfferProductByTraderId', search).subscribe((res: any) => {
      console.log(res);
      this.productsList = res.data.dataList;
      this.totalCount = res.data.totalCount;
    })
  }

  getPieceProductsByTraderIdCategoryId(search: any) {
    this.api.post('Portal/GetAllByTraderIdWithPagination', search).subscribe((res: any) => {
      console.log(res);
      this.productsList = res.data.dataList;
      this.totalCount = res.data.totalCount;
    })
  }


  onBuyNow(productId: number) {
    console.log('تم الضغط على شراء الآن للمنتج:', productId);
  }

  onAddToWishlist(productId: number) {
    console.log('تمت الإضافة إلى المفضلة للمنتج:', productId);
  }

  onViewProduct(productId: number) {
    console.log('  يلا بينا   :', productId);
  }

  onSliderChange(data: any) {
    console.log(data.values);
    this.priceFromValue = data.values[0];
    this.priceToValue = data.values[1];
    this.allProductSearch.fromPrice = data.values[0];
    this.allProductSearch.toPrice = data.values[1];
  }

  onPriceSearch() {
    this.callSearchApi();
  }

  onRatingSelected(id: number) {
    this.selectedRating = id;
    this.allProductSearch.rate = id;
    this.callSearchApi();
  }

  getSubcategoryByTraderid(traderId: string) {
    this.api.get(`Portal/GetSubCategoryByTraderId/${traderId}`).subscribe((res: any) => {
      const allObject = {
        id: 0,
        arName: "الكل",
        enName: "All",
        parentCategoryId: 0,
        image: "assets/images/flowers/all-flower.png",
        status: true
      };
      this.subCategoryList = res.data || [];
      this.subCategoryList.forEach((data: any) => {
        data.status = false;
      })
      this.subCategoryList.unshift(allObject);
      console.log(this.subCategoryList);

    });
  }

  callSearchApi() {
    console.log(this.productType);

    if (this.productType == 'p') {
      this.getProductsByTraderIdCategoryId(this.allProductSearch);
    } else if (this.productType == 'o') {
      this.getOffersProductsByTraderIdCategoryId(this.allProductSearch);
    } else {
      this.getPieceProductsByTraderIdCategoryId(this.allProductSearch)
    }
  }

  selectCategory(id: any) {
    console.log(id);
    this.subCategoryList = this.subCategoryList.map((item: any) => ({
      ...item,
      status: item.id === id
    }));
    this.allProductSearch.categoryId = id;
    this.callSearchApi();
  }

  onPageChange(page: any) {
    this.allProductSearch.pageNumber = page;
    this.callSearchApi()
  }

}
