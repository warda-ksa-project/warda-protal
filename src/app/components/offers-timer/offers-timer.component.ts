import { NgIf } from '@angular/common';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-offers-timer',
  standalone: true,
  imports: [TranslatePipe, NgIf],
  templateUrl: './offers-timer.component.html',
  styleUrl: './offers-timer.component.scss'
})
export class OffersTimerComponent implements OnInit, OnDestroy {
  @Input() targetDateInput!: string | Date;
  days: number = 0;
  hours: number = 0;
  minutes: number = 0;

  private timerInterval: any;
  private targetDate!: Date;

  ngOnInit(): void {
    this.targetDate = new Date(this.targetDateInput);
    this.calculateTime();
    this.timerInterval = setInterval(() => {
      this.calculateTime();
    }, 60000); // update every minute
  }

  ngOnDestroy(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }

  private calculateTime(): void {
    const now = new Date().getTime();
    const target = this.targetDate.getTime();
    const diff = target - now;

    if (diff > 0) {
      this.days = Math.floor(diff / (1000 * 60 * 60 * 24));
      this.hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      this.minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    } else {
      this.days = this.hours = this.minutes = 0;
    }
  }
}