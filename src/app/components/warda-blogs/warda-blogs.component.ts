import { NgClass, NgFor, NgIf, NgStyle } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { ApiService } from '../../services/api.service';
import { LanguageService } from '../../services/language.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-warda-blogs',
  standalone: true,
  imports: [NgFor, NgClass, NgStyle, TranslatePipe, NgIf],
  templateUrl: './warda-blogs.component.html',
  styleUrl: './warda-blogs.component.scss'
})
export class WardaBlogsComponent {
  api = inject(ApiService);
  languageService = inject(LanguageService);

  selectedLang = signal<string>(localStorage.getItem('lang') || 'ar');
  private langSubscription: Subscription | null = null;
  blogsList: any[] = [];
  manCategory: any[] = [];
  selectedArticle: any = null;
  imageUrl = environment.baseImageUrl;

  ngOnInit(): void {
    this.getAllBlogs();

    this.langSubscription = this.languageService.translationService.onLangChange.subscribe(() => {
      console.log('Language changed:', localStorage.getItem('lang'));
      this.selectedLang.set(localStorage.getItem('lang') || 'ar');
    });
  }

  getCateg(id: number) {
    if (!this.manCategory || this.manCategory.length === 0) return;


    this.manCategory.forEach(category => {
      category.active = category.id === id;
    });

    this.selectedArticle = this.blogsList.find(blog => blog.id === id) || null;


    this.manCategory = [...this.manCategory];
  }


  getAllBlogs() {
    this.api.get('Portal/GetAllArticles').subscribe((res: any) => {
      if (!res || !res.data || res.data.length === 0) {
        console.error('No data received from API');
        this.manCategory = [];
        return;
      }

      this.blogsList = res.data;

      this.manCategory = (res.data || []).map((data: any, index: number) => ({
        id: data.id,
        enTitle: data.enTitle,
        arTitle: data.arTitle,
        active: index === 0
      }));

      this.selectedArticle = this.blogsList.length > 0 ? { ...this.blogsList[0] } : null;
    });
  }

  trackByFn(index: number, item: any): number {
    return item.id;
  }

  getShortDescription(description: string | null): string {
    if (!description) return '';

    const plainText = description.replace(/<\/?[^>]+(>|$)/g, "");

    return plainText.length > 50 ? plainText.substring(0, 50) + "..." : plainText;
  }
}
