import { NgFor, NgIf, NgStyle, NgClass } from '@angular/common';
import { Component, inject } from '@angular/core';
import { TranslateService, TranslatePipe } from '@ngx-translate/core';
import { ApiService } from '../../services/api.service';
import { LanguageService } from '../../services/language.service';
import { environment } from '../../../environments/environment';
import { Router, RouterModule } from '@angular/router';
interface TraderCard {
  id: number;
  name: string;
  storeName: string | null;
  image: string | null;
  enDescription: string | null;
  arDescription: string | null;
  reviewAverage: number;
  traderReviews: any[];
  categories: {
    categoryId: number;
    enName: string;
    arName: string;
  }[];
}
@Component({
  selector: 'app-traders-section',
  standalone: true,
  imports: [NgFor, NgIf, TranslatePipe, NgStyle, NgClass , RouterModule],
  templateUrl: './traders-section.component.html',
  styleUrl: './traders-section.component.scss'
})
export class TradersSectionComponent {
  cardsList: TraderCard[] = []; // ✅ Fix the typing here
router = inject(Router);
  selectedLang: string = localStorage.getItem('lang') || 'ar';

  api = inject(ApiService);
  languageService = inject(LanguageService);

  ngOnInit(): void {
    this.getTraderList();
    this.languageService.translationService.onLangChange.subscribe((lang: any) => {
      this.selectedLang = lang.lang;
    });
  }

  getTraderList() {
    this.api.get('Portal/GetAllTrader').subscribe((res: any) => {
      const allTraders = res.data as TraderCard[];

      const updated = allTraders.slice(0, 5).map((trader: TraderCard) => {
        return {
          ...trader,
          image: trader.image ? `${trader.image}` : null
        };
      });

      this.cardsList = updated;
    });
  }

  onTraderView(traderId: any) {
    this.router.navigate(['trader_details' , traderId])
  }
}