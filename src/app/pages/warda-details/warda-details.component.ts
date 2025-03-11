import { NgFor } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-warda-details',
  standalone: true,
  imports: [NgFor],
  templateUrl: './warda-details.component.html',
  styleUrl: './warda-details.component.scss'
})
export class WardaDetailsComponent {

detailsList = [
  {
    image: 'assets/images/icons-svg/stat1.svg',
    title: 'التخصيص',
    desc:'صمّم باقتك بأسلوبك الخاص'
  },
  {
    image: 'assets/images/icons-svg/stat2.svg',
    title: 'الثقة والموثوقية',
    desc:'شراء آمن وتوصيل دقيق'
  },
  {
    image: 'assets/images/icons-svg/stat3.svg',
    title: 'رضا العملاء',
    desc:'تجربة مميزة تلبي توقعاتك.'
  },
  {
    image: 'assets/images/icons-svg/stat4.svg',
    title: 'ضمان الجودة',
    desc:'ورود طازجة مختارة بعناية تدوم طويلًا.'
  }
]

}
