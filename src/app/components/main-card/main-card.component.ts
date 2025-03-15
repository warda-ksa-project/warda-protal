import { NgStyle } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-main-card',
  standalone: true,
  imports: [NgStyle],
  templateUrl: './main-card.component.html',
  styleUrl: './main-card.component.scss'
})
export class MainCardComponent {
  @Input() imageUrl: string = '';
  @Input() title: string = '';
}
