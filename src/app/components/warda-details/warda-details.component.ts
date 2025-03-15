import { NgFor } from '@angular/common';
import { Component, inject } from '@angular/core';
import { LanguageService } from '../../services/language.service';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-warda-details',
  standalone: true,
  imports: [NgFor , TranslatePipe],
  templateUrl: './warda-details.component.html',
  styleUrl: './warda-details.component.scss'
})
export class WardaDetailsComponent {


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

ngOnInit(): void {
}

}
