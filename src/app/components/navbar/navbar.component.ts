import { Component, Inject, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { TranslateModule, TranslatePipe } from '@ngx-translate/core';
import { LanguageService } from '../../services/language.service';
import { ToasterService } from '../../services/toaster.service';
import { DOCUMENT, NgFor } from '@angular/common';
import { PrimeNG } from 'primeng/config';
import { InputGroup } from 'primeng/inputgroup';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { MenubarModule } from 'primeng/menubar';
import { MenuItem } from 'primeng/api';




@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [TranslateModule, TranslatePipe, MenubarModule, IconFieldModule, InputIconModule, RouterModule, FormsModule, InputGroup, InputTextModule, NgFor],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {

  langOptions = [
    { name: 'English', code: 'en', icon: 'assets/images/icons/en-lang.png' },
    { name: 'العربية', code: 'ar', icon: 'assets/images/icons/ar-lang.png' },
  ];
  selectedLang: string = localStorage.getItem('lang') || 'ar';
  languageService = inject(LanguageService);
  toaster = inject(ToasterService);
  currentLang = 'ar';
  items: MenuItem[] | undefined;



  constructor(@Inject(DOCUMENT) private document: Document, private primeng: PrimeNG, private router: Router) { }

  ngOnInit(): void {
    this.primeng.ripple.set(true);
    this.initAppTranslation();
    this.items = [
      {
        label: 'الرئيسية',
      },
      {
        label: 'الخصومات',
      },
      {
        label: 'تواصل معانا',
      },
      {
        label: 'المتاجر',
      },
      {
        label: 'المقالات',
      },
      {
        label: 'المنتجات',
        items: [
          {
            label: 'Features',
          },
          {
            label: 'Features',
          },
          {
            label: 'Features',
          }
        ]
      },
    ]
  }

  public initAppTranslation() {
    this.languageService.changeAppDirection(this.selectedLang);
    this.languageService.changeHtmlLang(this.selectedLang);
    this.languageService.use(this.selectedLang);
  }
  toggleLanguage() {
    this.selectedLang = this.selectedLang === 'en' ? 'ar' : 'en';
    this.currentLang = this.selectedLang;
    this.languageService.change(this.selectedLang);

    this.document.body.dir = this.selectedLang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.setAttribute('lang', this.selectedLang);
    document.documentElement.setAttribute('dir', this.selectedLang === 'ar' ? 'rtl' : 'ltr');
  }

  logout() {
    localStorage.removeItem('token');
  }
}
