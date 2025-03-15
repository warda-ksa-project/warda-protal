import { Component, inject, OnDestroy } from '@angular/core';
import { MainHeaderComponent } from '../../shared/main-header/main-header.component';
import { BannerData } from '../../shared/main-header/main-header.interface';
import { TranslateService, LangChangeEvent, TranslatePipe } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { NgFor, NgIf } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { FloatLabelModule } from 'primeng/floatlabel';
import { LanguageService } from '../../services/language.service';
import { ToasterService } from '../../services/toaster.service';
import { InputNumberModule } from 'primeng/inputnumber';

@Component({
  selector: 'app-about-us',
  standalone: true,
  imports: [MainHeaderComponent, NgIf, NgFor,  InputNumberModule, FloatLabelModule, TranslatePipe, ReactiveFormsModule, InputTextModule, TextareaModule],
  templateUrl: './about-us.component.html',
  styleUrl: './about-us.component.scss'
})
export class AboutUsComponent implements OnDestroy {

  bannerInfo: BannerData | undefined;
  private langChangeSub: Subscription;
  toaster = inject(ToasterService);
  languageService = inject(LanguageService);
  detailsList = [
    {
      image: 'assets/images/icons-svg/stat1.svg',
      title: 'WARDA_DETAILS.CUSTOMIZATION',
      desc: 'WARDA_DETAILS.CUSTOMIZATION_DESC'
    },
    {
      image: 'assets/images/icons-svg/stat2.svg',
      title: 'WARDA_DETAILS.TRUST',
      desc: 'WARDA_DETAILS.TRUST_DESC'
    },
    {
      image: 'assets/images/icons-svg/stat3.svg',
      title: 'WARDA_DETAILS.SATISFACTION',
      desc: 'WARDA_DETAILS.SATISFACTION_DESC'
    },
    {
      image: 'assets/images/icons-svg/stat4.svg',
      title: 'WARDA_DETAILS.QUALITY',
      desc: 'WARDA_DETAILS.QUALITY_DESC'
    }
  ];

  contactForm: FormGroup;

  constructor(private translate: TranslateService, private fb: FormBuilder) {
    this.setBannerInfo();

    this.langChangeSub = this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.setBannerInfo();
    });

    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/)]],
      mobileNumber: [null, [Validators.required, Validators.pattern(/^(5)[0-9]{8}$/)]],
      message: ['', Validators.required]
    });
  }

  socailMedia =[
    {
      icon: 'pi pi-facebook',
      routing: ''
    },
    {
      icon: 'pi pi-twitter',
      routing: ''
    },
    {
      icon: 'pi pi-instagram',
      routing: ''
    },
    {
      icon: 'pi pi-whatsapp',
      routing: ''
    },
  ]

  private setBannerInfo() {
    this.bannerInfo = {
      titleKey: this.translate.instant('ABOUTUS.WELCOME_TITLE'),
      descriptionKey: this.translate.instant('ABOUTUS.WELCOME_DESCRIPTION'),
      imageUrl: '../../../assets/images/flowers/main-header.png',
      breadcrumb: [
        { label: this.translate.instant('ABOUTUS.HOME'), routerLink: '/' },
        { label: this.translate.instant('ABOUTUS.PAGE_TITLE') }
      ]
    };
  }

  onSubmit() {
    if (this.contactForm.valid) {
      console.log(this.contactForm.value);
    } else {
      this.toaster.errorToaster(this.translate.instant('signup.error_message'));
    }
  }

  ngOnDestroy(): void {
    if (this.langChangeSub) {
      this.langChangeSub.unsubscribe(); // Prevent memory leaks
    }
  }
}
