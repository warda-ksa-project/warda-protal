import { NgFor, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { RouterModule } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { WardaDetailsComponent } from '../warda-details/warda-details.component';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NgFor, RouterModule, NgIf, TranslatePipe , WardaDetailsComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  private ApiService = inject(ApiService);

  staticDetails: any;

  ngOnInit(): void {
  }

}
