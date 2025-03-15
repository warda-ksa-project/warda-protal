import { Component, Inject, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
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
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [TranslateModule, TranslatePipe, RouterModule, MenubarModule, IconFieldModule, InputIconModule, FormsModule, InputGroup, InputTextModule, NgFor],
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
  items: MenuItem[] | undefined = [];
  activeRoute: string = '';

  constructor(@Inject(DOCUMENT) private document: Document, private primeng: PrimeNG, private router: Router) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.activeRoute = event.url;
    });
  }

  ngOnInit(): void {
    this.primeng.ripple.set(true);
    this.initAppTranslation();
    this.languageService.translationService.onLangChange.subscribe(() => {
      this.updateMenuItems();
    });
    this.updateMenuItems();
  }

  get languageToggleText(): string {
    return this.selectedLang.toUpperCase() === 'AR' ? 'NAVBAR.ENGLISH' : 'NAVBAR.ARABIC';
  }

  updateMenuItems() {
    this.items = [
      { label: this.languageService.translate('NAVBAR.HOME'), routerLink: '/', routerLinkActiveOptions: { exact: true } },
      { label: this.languageService.translate('NAVBAR.CONTACT'), routerLink: '/aboutus' },
      { label: this.languageService.translate('NAVBAR.DISCOUNTS'), routerLink: '/discounts' },
      { label: this.languageService.translate('NAVBAR.STORES'), routerLink: '/stores' },
      { label: this.languageService.translate('NAVBAR.ARTICLES'), routerLink: '/articles' },
      {
        label: this.languageService.translate('NAVBAR.PRODUCTS'),
        items: [
          { label: this.languageService.translate('NAVBAR.FEATURES'), routerLink: '/products/features1' },
          { label: this.languageService.translate('NAVBAR.FEATURES'), routerLink: '/products/features2' },
          { label: this.languageService.translate('NAVBAR.FEATURES'), routerLink: '/products/features3' },
        ],
      },
    ];
  }

  public initAppTranslation() {
    this.languageService.changeAppDirection(this.selectedLang);
    this.languageService.changeHtmlLang(this.selectedLang);
    this.languageService.use(this.selectedLang);
  }

  toggleLanguage() {
    this.selectedLang = this.selectedLang === 'en' ? 'ar' : 'en';
    this.currentLang = this.selectedLang;

    localStorage.setItem('lang', this.selectedLang);

    this.languageService.change(this.selectedLang);
    this.languageService.use(this.selectedLang);
    this.languageService.changeAppDirection(this.selectedLang);
    this.languageService.changeHtmlLang(this.selectedLang);

    this.document.body.dir = this.selectedLang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.setAttribute('lang', this.selectedLang);
    document.documentElement.setAttribute('dir', this.selectedLang === 'ar' ? 'rtl' : 'ltr');

    this.updateMenuItems();
  }

  logout() {
    localStorage.removeItem('token');
  }
}
