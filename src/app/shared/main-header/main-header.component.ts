import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { BannerData } from './main-header.interface';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-main-header',
  standalone: true,
  imports: [CommonModule, BreadcrumbModule , TranslatePipe],
  templateUrl: './main-header.component.html',
  styleUrl: './main-header.component.scss'
})
export class MainHeaderComponent {
  @Input() data!: BannerData;
}
