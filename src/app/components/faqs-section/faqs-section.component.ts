import { NgFor } from '@angular/common';
import { Component, inject, OnInit, OnDestroy, signal, effect } from '@angular/core';
import { PanelModule } from 'primeng/panel';
import { TranslatePipe } from '@ngx-translate/core';
import { ApiService } from '../../services/api.service';
import { LanguageService } from '../../services/language.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-faqs-section',
  standalone: true,
  imports: [PanelModule, NgFor, TranslatePipe],
  templateUrl: './faqs-section.component.html',
  styleUrl: './faqs-section.component.scss'
})
export class FaqsSectionComponent implements OnInit, OnDestroy {
  api = inject(ApiService);
  languageService = inject(LanguageService);

  faqsList: any[] = []; // ✅ Ensure it's always an array
  selectedLang = signal<string>(localStorage.getItem('lang') || 'ar'); 
  private langSubscription: Subscription | null = null; 

  ngOnInit(): void {
    this.getAllFaqs();

    this.langSubscription = this.languageService.translationService.onLangChange.subscribe(() => {
      console.log('Language changed:', localStorage.getItem('lang'));
      this.selectedLang.set(localStorage.getItem('lang') || 'ar');
    });
  }

  getAllFaqs() {
    this.api.get('api/FAQ/GetAll').subscribe((res: any) => {
      if (!res || !res.data || !Array.isArray(res.data)) { // ✅ Ensure response is valid
        console.error('Invalid API response:', res);
        this.faqsList = []; // ✅ Prevents errors if response is empty
        return;
      }

      console.log('Fetched FAQs:', res.data);
      this.faqsList = res.data; // ✅ Assign only if valid
    });
  }

  ngOnDestroy(): void {
    if (this.langSubscription) {
      this.langSubscription.unsubscribe();
    }
  }
}
