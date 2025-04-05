import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { LanguageService } from '../../services/language.service';
import { NgFor, NgIf, NgStyle } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';

@Component({
  selector: 'app-subcategory-slider',
  standalone: true,
  imports: [NgFor, NgIf, NgStyle, TranslatePipe , CarouselModule],
  templateUrl: './subcategory-slider.component.html',
  styleUrl: './subcategory-slider.component.scss'
})
export class SubcategorySliderComponent {

  @Input() data: any[] = [];
  @Output() subcategoryClicked = new EventEmitter<number>();

  selectedLang = 'ar';
  languageService = inject(LanguageService);

  customOptions: OwlOptions = {
    loop: true,
    margin: 10,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    rtl: true,
    dots: true,
    navSpeed: 700,
    center: false,
    responsive: {
      0: { items: 1 },
      600: { items: 3 },
      1000: { items: 5 }
    },
    nav: false
  };

  ngOnInit(): void {
    this.selectedLang = this.languageService.translationService.currentLang || 'ar';
    this.languageService.translationService.onLangChange.subscribe(lang => {
      this.selectedLang = lang.lang;
    });
  }

  getName(item: any): string {
    return this.selectedLang === 'ar' ? item.arName : item.enName;
  }

  onItemClick(id: number) {
    this.subcategoryClicked.emit(id);
  }
}