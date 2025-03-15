import { NgFor, NgIf, NgStyle, NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { TranslateService, TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-traders-section',
  standalone: true,
  imports: [NgFor, NgIf, TranslatePipe, NgStyle, NgClass],
  templateUrl: './traders-section.component.html',
  styleUrl: './traders-section.component.scss'
})
export class TradersSectionComponent {

  cardsList = [
    { id: '1', title: 'TRADERS_SECTION.STORE_1', image: '../../../assets/images/background/trader.png', desc: 'TRADERS_SECTION.STORE_DESC' },
    { id: '2', title: 'TRADERS_SECTION.STORE_2', image: '../../../assets/images/background/trader.png', desc: 'TRADERS_SECTION.STORE_DESC' },
    { id: '3', title: 'TRADERS_SECTION.STORE_3', image: '../../../assets/images/background/trader.png', desc: 'TRADERS_SECTION.STORE_DESC' },
    { id: '4', title: 'TRADERS_SECTION.STORE_4', image: '../../../assets/images/background/trader.png', desc: 'TRADERS_SECTION.STORE_DESC' },
    { id: '5', title: 'TRADERS_SECTION.STORE_5', image: '../../../assets/images/background/trader.png', desc: 'TRADERS_SECTION.STORE_DESC' }
  ];

  title = 'TRADERS_SECTION.TITLE';
  imageUrl = "'../../../assets/images/flowers/flower3.svg'";
}
