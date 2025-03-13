import { NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { PanelModule } from 'primeng/panel';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-faqs-section',
  standalone: true,
  imports: [PanelModule, NgFor, TranslatePipe],
  templateUrl: './faqs-section.component.html',
  styleUrl: './faqs-section.component.scss'
})
export class FaqsSectionComponent {

  questionsList = [
    { id: '1', title: 'FAQS.QUESTION_1', desc: 'FAQS.ANSWER_1' },
    { id: '2', title: 'FAQS.QUESTION_2', desc: 'FAQS.ANSWER_2' },
    { id: '3', title: 'FAQS.QUESTION_3', desc: 'FAQS.ANSWER_3' }
  ];

}
