import { Component, inject, signal } from '@angular/core';
import { PieceProductService } from '../../services/piece-products.service';
import { DrawerModule } from 'primeng/drawer';
import { ButtonModule } from 'primeng/button';
import { NgFor, NgIf } from '@angular/common';
@Component({
  selector: 'app-piece-products-list',
  standalone: true,
  imports: [DrawerModule, ButtonModule, NgIf , NgFor],
  templateUrl: './piece-products-list.component.html',
  styleUrl: './piece-products-list.component.scss'
})
export class PieceProductsListComponent {

  visible = signal(false);

  pieceProduct = inject(PieceProductService)

  items = this.pieceProduct.items;

  toggleDrawer() {
    this.visible.update(v => !v);
  }

  removeItem(id: number) {
    this.pieceProduct.removeItem(id);
  }

}
