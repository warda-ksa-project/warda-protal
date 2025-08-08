import { CommonModule, NgClass, NgFor, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ApiService } from '../../services/api.service';
import { LanguageService } from '../../services/language.service';
import { ToasterService } from '../../services/toaster.service';
import { FormsModule } from '@angular/forms';
import { ModalComponent } from '../../components/modal/modal.component';
import { AddressLocationComponent } from '../address-location/address-location.component';
import { IDialog } from '../../components/modal/modal.interface';
import { forkJoin } from 'rxjs';
import { LoginSignalUserDataService } from '../../services/login-signal-user-data.service';

@Component({
  selector: 'app-shopping-cart',
  standalone: true,
  imports: [BreadcrumbModule, NgFor, CommonModule, NgIf, FormsModule, TranslatePipe, NgClass, ModalComponent, AddressLocationComponent],
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
  openAddressLocation: boolean = false;
  authService = inject(LoginSignalUserDataService);

  dialogAddressLocationProps: IDialog = {
    props: {
      header: 'add Address',
      visible: this.openAddressLocation,
      styles: { width: '100%' }

    },
    onHide: (e?: Event) => { },
    onShow: (e?: Event) => { }
  };
  shoppingCartListSingle: any;
  shoppingCartListGroup: any;
  itemCount: number = 1;
  promoCodeValue: any = '';
  addressList: any[] = []
  orderObject: {
    addressId: number | null;
    paymentWayId: number | null;
    totalPrice: number | null;
  } = {
      addressId: null,
      paymentWayId: null,
      totalPrice: null,
    };
  selectedAddressId!: number;
  paymentMethod: any[] = [
    {
      id: 1,
      enName: 'Visa',
      arName: 'فيزا',
      isEnabled: true
    },
    {
      id: 2,
      enName: 'Cash',
      arName: 'كاش',
      isEnabled: true
    }
  ];



  constructor(private translate: TranslateService) {
  }

  ngOnInit(): void {
    this.breadcrumb = [
      { label: this.translate.instant('CART_LIST.BREADCRUMB.HOME'), routerLink: '/' },
      { label: this.translate.instant('CART_LIST.BREADCRUMB.CART') }
    ];
    this.getClientAddress();
    this.getShoppingCartListSingleItems();
    this.getShoppingCartListGroupItems();
    this.onPaymentWayChoose();
    this.selectedLang = this.languageService.translationService.currentLang || 'ar';
    this.languageService.translationService.onLangChange.subscribe(lang => {
      this.selectedLang = lang.lang;
      this.breadcrumb = [
        { label: this.translate.instant('CART_LIST.BREADCRUMB.HOME'), routerLink: '/' },
        { label: this.translate.instant('CART_LIST.BREADCRUMB.CART') }
      ];
    });
  }

  getShoppingCartListSingleItems() {
    this.api.get('portal/ShoppingCart/GetAll/2').subscribe((res: any) => {
      if (res && res.data) {
        this.shoppingCartListSingle = res.data.map((data: any) => {
          if (data?.product) {
            data.product.productAmount = 1;
            data.product.totalPriceAmount = this.isDatePassedOrToday(data.product.endDate)
              ? data.product.priceAfterDiscount
              : data.product.price;
          }
          return data;
        });
        console.log(this.shoppingCartListSingle);

      }
    });
  }

  getShoppingCartListGroupItems() {
    this.api.get('portal/ShoppingCart/GetAllGroup/2').subscribe((res: any) => {
      if (res && res.data) {
        this.shoppingCartListGroup = res.data.map((data: any) => {
          if (data?.product) {
            data.product.productAmount = 1;
            data.product.totalPriceAmount = this.isDatePassedOrToday(data.product.endDate)
              ? data.product.priceAfterDiscount
              : data.product.price;
          }
          return data;
        });
        console.log(this.shoppingCartListGroup);

      }
    });
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
      this.getShoppingCartListSingleItems();
      this.getShoppingCartListGroupItems()

    })
  }

  removeShoppingCart(productId: any) {
    this.api.deleteWithoutParam(`portal/ShoppingCart/RemoveItem/${productId}`).subscribe((res: any) => {
      this.getShoppingCartListSingleItems();
      this.getShoppingCartListGroupItems()
    })
  }

  deleteAllCarts() {
    this.api.deleteWithoutParam(`portal/ShoppingCart/RemoveCart`).subscribe((res: any) => {
      this.getShoppingCartListSingleItems();
      this.getShoppingCartListGroupItems();
      this.authService.updateCartCount();
    })
  }

  itemPlus(productId: number) {
    const item = this.shoppingCartListSingle.find((x: any) => x.id === productId);
    if (item && item.product) {
      item.product.productAmount += 1;
      item.product.totalPriceAmount =
        item.product.productAmount *
        (this.isDatePassedOrToday(item.product.endDate)
          ? item.product.priceAfterDiscount
          : item.product.price);
    }
    this.onUpdateItemCount(productId, item.product.productAmount);
    console.log(this.shoppingCartListSingle);
  }

  itemMinus(productId: number) {
    const item = this.shoppingCartListSingle.find((x: any) => x.id === productId);
    if (item && item.product && item.product.productAmount > 1) {
      item.product.productAmount -= 1;
      item.product.totalPriceAmount =
        item.product.productAmount *
        (this.isDatePassedOrToday(item.product.endDate)
          ? item.product.priceAfterDiscount
          : item.product.price);
    }
    this.onUpdateItemCount(productId, item.product.productAmount);
    console.log(this.shoppingCartListSingle);
  }

  isDatePassedOrToday(dateToCheck: Date): boolean {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const checkDate = new Date(dateToCheck);
    checkDate.setHours(0, 0, 0, 0);
    return checkDate <= today;
  }

  loadShoppingCartData() {
    forkJoin({
      singleRes: this.api.get('portal/ShoppingCart/GetAll/2'),
      groupRes: this.api.get('portal/ShoppingCart/GetAllGroup/2')
    }).subscribe(({ singleRes, groupRes }) => {
      // Use type assertion (any) to safely access .data without TS error
      const singleData = (singleRes as any).data ?? [];
      const groupData = (groupRes as any).data ?? [];

      this.shoppingCartListSingle = singleData.map((data: any) => {
        if (data?.product) {
          data.product.productAmount = 1;
          data.product.totalPriceAmount = this.isDatePassedOrToday(data.product.endDate)
            ? data.product.priceAfterDiscount
            : data.product.price;
        }
        return data;
      });

      this.shoppingCartListGroup = groupData.map((data: any) => {
        if (data?.product) {
          data.product.productAmount = 1;
          data.product.totalPriceAmount = this.isDatePassedOrToday(data.product.endDate)
            ? data.product.priceAfterDiscount
            : data.product.price;
        }
        return data;
      });

      console.log('Single Cart:', this.shoppingCartListSingle);
      console.log('Group Cart:', this.shoppingCartListGroup);
    });
  }


  // Modified getTotalAmountForProducts to sum both lists
  getTotalAmountForProducts(): number {
    const allItems = [
      ...(this.shoppingCartListSingle ?? []),
      ...(this.shoppingCartListGroup ?? [])
    ];
    return allItems.reduce((total: number, item: any) => {
      return total + (item.product?.totalPriceAmount || 0);
    }, 0);
  }

  // If you want to count total productAmount (optional)
  getTotalProductCount(): number {
    const allItems = [
      ...(this.shoppingCartListSingle ?? []),
      ...(this.shoppingCartListGroup ?? [])
    ];
    return allItems.reduce((total: number, item: any) => {
      return total + (item.product?.productAmount || 0);
    }, 0);
  }


  // productItemsCount() {
  //   return this.shoppingCartListSingle?.reduce((total: number, item: any) => {
  //     return total + (item.product?.productAmount || 0);
  //   }, 0);
  // }

  // getTotalAmountForProducts(): number {
  //   return this.shoppingCartListSingle?.reduce((total: number, item: any) => {
  //     return total + (item.product?.totalPriceAmount || 0);
  //   }, 0);
  // }



  shippingFeeCalc() {
    return 50;
  }

  onUpdateItemCount(productId: number, number: number) {
    let updateObject = {
      itemId: +productId,
      quantity: +number
    }
    this.api.put('portal/ShoppingCart/UpdateItem', updateObject).subscribe((res: any) => {
      console.log(res);
    })
  }

  getClientAddress() {
    this.api.get('Portal/AddressPortal/GetAddressByUserId').subscribe((res: any) => {
      console.log(res);
      this.orderObject.addressId = res.data[0]?.id;
      this.addressList = res.data.forEach((data: any, i: number) => {
        if (i == 0) {
          data.check = true;
        } else {
          data.check = false;
        }
      })
      this.addressList = res.data;
    });
  }

  onAddNewAddress() {
    this.openAddressLocation = !this.openAddressLocation
    this.dialogAddressLocationProps.props.visible = this.openAddressLocation
  }

  onAddressSelected(id: number): void {
    this.orderObject.addressId = +id;
  }

  onConfirmAddress(event: string) {
    if (event == 'success') {
      this.openAddressLocation = false
      this.getClientAddress()
    }
  }

  onPaymentWayChoose() {
    this.api.get('api/PaymentWay/GetAll').subscribe((res: any) => {
      console.log(res);
      // this.paymentMethod = res.data;
    })
  }

  onPaymentMethod(paymentId: number) {
    console.log(paymentId);
    this.orderObject.paymentWayId = +paymentId;
  }

  onCreateOrder() {
    this.orderObject.totalPrice = this.getTotalAmountForProducts();
    if (this.orderObject.paymentWayId == null || this.orderObject.paymentWayId == undefined) {
      this.toaster.errorToaster(this.translate.instant('CART_LIST.ERRORS.SELECT_PAYMENT'));
    } else if (this.orderObject.addressId == null || this.orderObject.addressId == undefined) {
      this.toaster.errorToaster(this.translate.instant('CART_LIST.ERRORS.ADD_ADDRESS'));
    } else {
      console.log(this.orderObject);
      this.createOrderApi(this.orderObject);
    }
  }

  createOrderApi(orderObject: any) {
    this.api.post('Portal/OrderPortal/Create', orderObject).subscribe((res: any) => {
      console.log(res);
      this.authService.updateCartCount();
      if (this.orderObject.paymentWayId == 1) {
        this.toaster.successToaster('تم انشاء طلبكم ');
        setTimeout(() => {
          let paymentUrl = `https://payment.wrdah.com/payment/creditcardweb?orderid=${+res.data}`
          console.log(paymentUrl);
          window.location.href = paymentUrl;
        }, 1500);
      } else {
        this.toaster.successToaster('تم انشاء طلبكم ');
      }
    })
  }

}
