import { NgIf, NgFor, NgClass } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TraderCardComponent } from '../../../components/trader-card/trader-card.component';
import { MainHeaderComponent } from '../../../shared/main-header/main-header.component';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { ApiService } from '../../../services/api.service';
import { LanguageService } from '../../../services/language.service';
import { ToasterService } from '../../../services/toaster.service';
import { BannerData } from '../../../shared/main-header/main-header.interface';
import { SubcategorySliderComponent } from '../../../components/subcategory-slider/subcategory-slider.component';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { MainCardComponent } from '../../../components/main-card/main-card.component';
import { PieceCardsComponent } from "../../../components/piece-cards/piece-cards.component";

@Component({
  selector: 'app-trader-details',
  standalone: true,
  imports: [MainHeaderComponent, NgClass, NgIf, NgFor, MainCardComponent, CarouselModule, TraderCardComponent, RouterModule, SubcategorySliderComponent, TranslatePipe, PieceCardsComponent],
  templateUrl: './trader-details.component.html',
  styleUrl: './trader-details.component.scss'
})

export class TraderDetailsComponent {
  bannerInfo: BannerData | undefined;

  toaster = inject(ToasterService);
  api = inject(ApiService);
  router = inject(Router);
  route = inject(ActivatedRoute);
  languageService = inject(LanguageService);
  selectedLang: string = localStorage.getItem('lang') || 'ar';

  traderData: any;
  subCategoryList: any;

  allProductSearch: {
    pageNumber: number;
    pageSize: number;
    categoryId: string | null | number;
    traderId: string | null | number;
  } = {
      pageNumber: 0,
      pageSize: 10,
      categoryId: 0,
      traderId: null
    };

  offersProductSearch: any;

  allProductsList: any[] = [];
  offersProductsList: any[] = [];
  pieceProductsList: any[] = [];

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
  traderId: any;

  constructor(private translate: TranslateService) {
  }

  ngOnInit(): void {
    this.traderId = this.route.snapshot.paramMap.get('id');
    this.traderData =
    {
      id: 4,
      name: "Omar",
      storeName: "omar",
      image: null,
      enDescription: 'test test test test test test test ',
      arDescription: ' تجربه تجربه تجربه تجربه تجربه تجربه تجربه تجربه تجربه',
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

    // this.subCategoryList = [
    //   {
    //     "id": 8,
    //     "arName": "اختار1 sub",
    //     "enName": "test1 sub",
    //     "parentCategoryId": 6,
    //     "image": "https://wardaweb-001-site1.qtempurl.com/images/Categories/5743fe16-75ef-488e-ba40-5f71656c3707.jpeg"
    //   }
    // ]


    if (this.traderId) {
      this.offersProductSearch = {
        pageNumber: 0,
        pageSize: 10,
        traderId: +this.traderId
      };

      this.getTradersById(this.traderId);
      this.getSubcategoryByTraderid(this.traderId)
      this.setBannerInfo();
      this.allProductSearch.traderId = +this.traderId;
      this.getProductsByTraderIdCategoryId(this.allProductSearch);
      this.getOffersProductsByTraderIdCategoryId(this.offersProductSearch);
      this.getPieceProductsByTraderIdCategoryId(this.offersProductSearch)
    }

    this.languageService.translationService.onLangChange.subscribe((lang: any) => {
      console.log(lang);
      this.selectedLang = lang.lang;
      this.setBannerInfo();
    });
  }

  setBannerInfo() {
    this.bannerInfo = {
      titleKey: this.traderData.storeName,
      descriptionKey: this.selectedLang == 'ar' ? this.traderData.arDescription : this.traderData.enDescription,
      imageUrl: '../../../assets/images/background/main-frame.png',
      breadcrumb: [
        { label: this.translate.instant('TRADERS_DETAILS.HOME'), routerLink: '/' },
        { label: this.translate.instant('TRADERS_DETAILS.TRADERS_LIST'), routerLink: '/traders_list' },
        { label: this.traderData.storeName }
      ]
    };
  }

  getTradersById(id: string) {
    this.api.get(`Portal/PortalGetTraderById?Id=${id}`).subscribe({
      next: (res: any) => {
        // this.traderData = res.data;
      }
    });
  }

  onTraderClick(id: number) {
    console.log('Selected Trader ID:', id);
    this.router.navigate(['trader_details', id]);
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
      this.subCategoryList.unshift(allObject);
    });
  }

  getProductsByTraderIdCategoryId(search: any) {
    this.api.post('Portal/GetProductByCategoryIdAndTraderId', search).subscribe((res: any) => {
      console.log(res);
      this.allProductsList = res.data.dataList;
    })
  }

  getOffersProductsByTraderIdCategoryId(search: any) {
    this.api.post('Portal/GetOfferProductByTraderId', search).subscribe((res: any) => {
      console.log(res);
      this.offersProductsList = res.data.dataList;
    })
  }


  getPieceProductsByTraderIdCategoryId(search: any) {
    this.api.post('Portal/GetAllByTraderIdWithPagination', search).subscribe((res: any) => {
      console.log(res);
      this.pieceProductsList = res.data.dataList;
    })
  }

  onSubcategoryId(categoryId: any) {
    console.log(categoryId);
    this.subCategoryList = this.subCategoryList.map((item: any) => ({
      ...item,
      status: item.id === categoryId
    }));
    this.allProductSearch.categoryId = categoryId;
    this.allProductSearch.categoryId = categoryId;
    this.getProductsByTraderIdCategoryId(this.allProductSearch);
  }


  goAllProduct(type: string) {
    this.router.navigate(['/trader_all_details',  this.traderId, type])
  }

  onBuyNow(productId: number) {
    console.log('تم الضغط على شراء الآن للمنتج:', productId);
  }

  onAddToWishlist(productId: number) {
    console.log('تمت الإضافة إلى المفضلة للمنتج:', productId);
  }
}
