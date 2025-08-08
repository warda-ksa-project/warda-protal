import { NgIf, NgFor, NgClass } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { SliderModule } from 'primeng/slider';
import { FormsModule } from '@angular/forms';
import { TooltipModule } from 'primeng/tooltip';
import { MainCardComponent } from '../../components/main-card/main-card.component';
import { PaginationComponent } from '../../components/pagination/pagination.component';
import { SubcategorySliderComponent } from '../../components/subcategory-slider/subcategory-slider.component';
import { ApiService } from '../../services/api.service';
import { LanguageService } from '../../services/language.service';
import { ToasterService } from '../../services/toaster.service';
import { MainHeaderComponent } from '../../shared/main-header/main-header.component';
import { BannerData } from '../../shared/main-header/main-header.interface';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';
import { Subject } from 'rxjs';
@Component({
  selector: 'app-all-products',
  standalone: true,
  imports: [InputTextModule, IconFieldModule, InputIconModule, MainHeaderComponent, NgIf, NgFor, PaginationComponent, MainCardComponent, NgClass, SliderModule, TooltipModule, FormsModule, RouterModule, SubcategorySliderComponent, TranslatePipe],
  templateUrl: './all-products.component.html',
  styleUrl: './all-products.component.scss'
})
export class AllProductsComponent {

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
  searchValue: string = '';
  searchInputChanged = new Subject<string>();
  allProductSearch: {
    pageNumber: number;
    pageSize: number;
    categoryId: number | null;
    traderId: string | null | number;
    fromPrice: number;
    toPrice: number;
    rate: number, name: string;
  } = {
      pageNumber: 0,
      pageSize: 8,
      traderId: null,
      fromPrice: 0,
      toPrice: 0,
      categoryId: 0,
      rate: 0,
      name: ''
    };
  offersProductSearch: any;
  rangeValues: number[] = [20, 500];
  priceFromValue: number = 20;
  priceToValue: number = 500;
  selectedRating: number = 5;
  subCategoryList: any;
  totalCount: number = 0;
  mainTitle = {
    ar: '',
    en:''
  };


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
    // this.getSubcategoryByTraderid(this.traderId)

    this.route.queryParams.subscribe(params => {
      const searchQuery = params['search'];

      if (searchQuery) {
        this.allProductSearch.name = searchQuery
        this.searchValue = searchQuery;
        this.searchInputChanged.next(searchQuery);
      }
    });

    if (this.productType) {
      // this.getTradersById(this.traderId);
      // this.setBannerInfo();
      this.allProductSearch.traderId = 0

      if (this.productType == 'all') {
        this.mainTitle.ar = 'المنتجات';
        this.mainTitle.en = 'Products';
        this.getAllProducts(this.allProductSearch);
      } else if (this.productType == 'offers') {
        this.mainTitle.ar = 'العروض';
        this.mainTitle.en = 'Offers';
        this.getOffersProducts(this.allProductSearch);
      } else if (this.productType == 'new') {
        this.mainTitle.ar = 'المنتجات الجديدة';
        this.mainTitle.en = 'New Products';
        this.getNewProducts(this.allProductSearch)
      }
    }

    this.languageService.translationService.onLangChange.subscribe((lang: any) => {
      console.log(lang);
      this.selectedLang = lang.lang;
      // this.setBannerInfo();
    });

    this.searchInputChanged.pipe(
      debounceTime(300),
      map(value => value.trim()),
      distinctUntilChanged()
    ).subscribe(value => {
      this.searchValue = value;

      if (value.length >= 3) {
        this.allProductSearch.name = value;
        this.callSearchApi();
      } else if (value.length === 0) {
        this.allProductSearch.name = '';
        this.callSearchApi();
      }
    });
  }

  getAllProducts(search: any) {
    this.api.post('Portal/GetAllProductWithPaginationPortal', search).subscribe((res: any) => {
      console.log(res);
      this.productsList = res.data.dataList;
      this.totalCount = res.data.totalCount;
    })
  }

  getOffersProducts(search: any) {
    this.api.post('Portal/GetOfferProducts', search).subscribe((res: any) => {
      console.log(res);
      this.productsList = res.data.dataList;
      this.totalCount = res.data.totalCount;
    })
  }

  getNewProducts(search: any) {
    this.api.post('Portal/GetNewProducts', search).subscribe((res: any) => {
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
    // this.api.get(`SubCategory/GetAllWithPagination`).subscribe((res: any) => {
    //   const allObject = {
    //     id: 0,
    //     arName: "الكل",
    //     enName: "All",
    //     parentCategoryId: 0,
    //     image: "assets/images/flowers/all-flower.png",
    //     status: true
    //   };
    //   this.subCategoryList = res.data || [];
    //   this.subCategoryList.forEach((data: any) => {
    //     data.status = false;
    //   })
    //   this.subCategoryList.unshift(allObject);
    //   console.log(this.subCategoryList);

    // });
  }

  callSearchApi() {
    if (this.productType == 'all') {
      this.getAllProducts(this.allProductSearch);
    } else if (this.productType == 'offers') {
      this.getOffersProducts(this.allProductSearch);
    } else if (this.productType == 'new') {
      this.getNewProducts(this.allProductSearch)
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

  onSearchInputChange(event: Event): void {
    const input = (event.target as HTMLInputElement).value;
    this.searchInputChanged.next(input);
  }

}
