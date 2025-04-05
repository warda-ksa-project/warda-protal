import { NgIf, NgFor } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MainHeaderComponent } from '../../../shared/main-header/main-header.component';
import { BannerData } from '../../../shared/main-header/main-header.interface';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { ApiService } from '../../../services/api.service';
import { LanguageService } from '../../../services/language.service';
import { ToasterService } from '../../../services/toaster.service';
import { Subscription } from 'rxjs';
import { TraderCardData } from '../../../components/trader-card/trader-card.interface';
import { TraderCardComponent } from '../../../components/trader-card/trader-card.component';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-traders-list',
  standalone: true,
  imports: [MainHeaderComponent, NgIf, NgFor, TraderCardComponent, RouterModule],
  templateUrl: './traders-list.component.html',
  styleUrl: './traders-list.component.scss'
})
export class TradersListComponent {

  bannerInfo: BannerData | undefined;
  private langChangeSub: Subscription;
  toaster = inject(ToasterService);
  api = inject(ApiService)
  languageService = inject(LanguageService);
  traderList: TraderCardData[] = [];

  constructor(private translate: TranslateService , private router: Router) {
    this.setBannerInfo();

    this.langChangeSub = this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.setBannerInfo();
    });
  }

  ngOnInit(): void {
    this.getTraders();
    this.traderList = [];

  }

  setBannerInfo() {
    this.bannerInfo = {
      titleKey: this.translate.instant('TRADERS.WELCOME_TITLE'),
      descriptionKey: this.translate.instant('TRADERS.WELCOME_DESCRIPTION'),
      imageUrl: '../../../assets/images/flowers/main-header.png',
      breadcrumb: [
        { label: this.translate.instant('TRADERS.HOME'), routerLink: '/' },
        { label: this.translate.instant('TRADERS.PAGE_TITLE') }
      ]
    };
  }


  getTraders() {
    this.api.get('Portal/GetAllTrader').subscribe({
      next: (res: any) => {
        this.traderList = res.data || [];
      },
      error: () => {
        this.toaster.errorToaster(this.translate.instant('ERRORS.TRADERS_LIST_LOAD'));
      }
    });
  }


  onTraderClick(id: number) {
    console.log('Selected Trader ID:', id);
    this.router.navigate(['trader_details' , id])
  }

}
