import { Component, inject, signal } from '@angular/core';
import { PieceProductService } from '../../services/piece-products.service';
import { DrawerModule } from 'primeng/drawer';
import { ButtonModule } from 'primeng/button';
import { NgFor, NgIf } from '@angular/common';
import { ToasterService } from '../../services/toaster.service';
import { ApiService } from '../../services/api.service';
@Component({
  selector: 'app-piece-products-list',
  standalone: true,
  imports: [DrawerModule, ButtonModule, NgIf, NgFor],
  templateUrl: './piece-products-list.component.html',
  styleUrl: './piece-products-list.component.scss'
})
export class PieceProductsListComponent {

  visible = signal(false);
  pieceProduct = inject(PieceProductService)
  items = this.pieceProduct.items;
  selectedLang: string = localStorage.getItem('lang') || 'ar';
  toaster = inject(ToasterService);
  api = inject(ApiService);

  toggleDrawer() {
    this.visible.update(v => !v);
  }

  removeItem(id: number) {
    this.pieceProduct.removeItem(id);
  }

  plus(id: number) {
    this.pieceProduct.increaseQuantity(id);
  }

  minus(id: number) {
    this.pieceProduct.decreaseQuantity(id);
  }


  clearCart() {
    this.pieceProduct.clear(); // or this._items.set([]); if it's internal
    this.toaster.successToaster('تم إفراغ السلة بنجاح');
  }


  addToCart() {
    this.api.post('portal/ShoppingCart/AddGroup', this.items()).subscribe((res: any) => {
      this.toaster.successToaster(res.message)
    })
  }

}
