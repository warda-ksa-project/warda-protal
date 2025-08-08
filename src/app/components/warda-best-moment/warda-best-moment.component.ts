import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-warda-best-moment',
  standalone: true,
  imports: [TranslatePipe , RouterModule],
  templateUrl: './warda-best-moment.component.html',
  styleUrl: './warda-best-moment.component.scss'
})
export class WardaBestMomentComponent {

}
