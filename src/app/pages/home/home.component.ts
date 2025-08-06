import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { WardaDetailsComponent } from '../../components/warda-details/warda-details.component';
import { WardaSecondDetailsComponent } from '../../components/warda-second-details/warda-second-details.component';
import { WardaBestMomentComponent } from '../../components/warda-best-moment/warda-best-moment.component';
import { WardaBlogsComponent } from '../../components/warda-blogs/warda-blogs.component';
import { FaqsSectionComponent } from '../../components/faqs-section/faqs-section.component';
import { LatestProductsComponent } from '../../components/latest-products/latest-products.component';
import { SalesSectionComponent } from '../../components/sales-section/sales-section.component';
import { TradersSectionComponent } from '../../components/traders-section/traders-section.component';
import { PieceProductService } from '../../services/piece-products.service';
import { PieceProductsListComponent } from "../../components/piece-products-list/piece-products-list.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule, WardaDetailsComponent, WardaSecondDetailsComponent, SalesSectionComponent, TradersSectionComponent, WardaBestMomentComponent, WardaBlogsComponent, FaqsSectionComponent, LatestProductsComponent, PieceProductsListComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  constructor(private pieceProduct: PieceProductService) {}

  addTestItem() {
    const id = Math.floor(Math.random() * 10000);
    this.pieceProduct.addItem({
      id,
      name: `Item-${id}`,
      price: Math.floor(Math.random() * 100) + 50
    });
  }
}
