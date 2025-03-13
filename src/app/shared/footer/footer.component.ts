import { NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [NgFor , TranslatePipe],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {

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

  year = new Date().getFullYear();

}
