import { NgClass, NgFor, NgIf, NgStyle } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { TraderCardData } from './trader-card.interface';
import { Subscription } from 'rxjs';
import { LanguageService } from '../../services/language.service';
import { TranslatePipe } from '@ngx-translate/core';
import { MainHeaderComponent } from '../../shared/main-header/main-header.component';

@Component({
  selector: 'app-trader-card',
  standalone: true,
  imports: [MainHeaderComponent, NgIf, NgFor, NgClass, NgStyle, TranslatePipe],
  templateUrl: './trader-card.component.html',
  styleUrl: './trader-card.component.scss'
})
export class TraderCardComponent {

  @Input() data?: TraderCardData;
  @Output() traderSelected = new EventEmitter<number>(); // ✅ OUTPUT for parent

  selectedLang: string = 'ar';
  private langSub?: Subscription;
  private languageService = inject(LanguageService);

  ngOnInit(): void {
    setTimeout(() => {
      console.log(this.data);
    }, 2000);
    this.selectedLang = this.languageService.translationService.currentLang || 'ar';
    this.langSub = this.languageService.translationService.onLangChange.subscribe(lang => {
      this.selectedLang = lang.lang;
    });
  }

  ngOnDestroy(): void {
    this.langSub?.unsubscribe();
  }

  get imageUrl(): string {
    return this.data?.image || 'assets/images/background/no-image.png';
  }

  get displayDescription(): string {
    const desc =
      this.selectedLang === 'ar'
        ? this.data?.arDescription
        : this.data?.enDescription;

    return desc?.length ? desc : (this.selectedLang === 'ar' ? 'لا يوجد وصف متاح' : 'No description available');
  }

  getTraderId(id: number | undefined) {
    if (id !== undefined) {
      this.traderSelected.emit(id);
    }
  }

  get isFallbackImage(): boolean {
    return this.imageUrl.includes('no-image.png');
  }
}