import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { WardaDetailsComponent } from '../../components/warda-details/warda-details.component';
import { WardaSecondDetailsComponent } from '../../components/warda-second-details/warda-second-details.component';
import { WardaBestMomentComponent } from '../../components/warda-best-moment/warda-best-moment.component';
import { WardaBlogsComponent } from '../../components/warda-blogs/warda-blogs.component';
import { FaqsSectionComponent } from '../../components/faqs-section/faqs-section.component';
import { LatestProductsComponent } from '../../components/latest-products/latest-products.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ RouterModule , WardaDetailsComponent , WardaSecondDetailsComponent , WardaBestMomentComponent , WardaBlogsComponent , FaqsSectionComponent , LatestProductsComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {}
