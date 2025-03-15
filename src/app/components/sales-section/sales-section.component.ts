import { Component } from '@angular/core';
import { MainCardComponent } from '../main-card/main-card.component';

@Component({
  selector: 'app-sales-section',
  standalone: true,
  imports: [MainCardComponent],
  templateUrl: './sales-section.component.html',
  styleUrl: './sales-section.component.scss'
})
export class SalesSectionComponent {

}
