import { NgClass, NgFor, NgStyle } from '@angular/common';
import { Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-warda-blogs',
  standalone: true,
  imports: [NgFor , NgClass , NgStyle , TranslatePipe],
  templateUrl: './warda-blogs.component.html',
  styleUrl: './warda-blogs.component.scss'
})
export class WardaBlogsComponent {

  imageUrl = '../../../assets/images/flowers/flower6.png';

  manCategory = [
    {id: '1' , name: 'BLOGS.ALL', active: true},
    {id: '2' , name: 'BLOGS.FLOWER_CARE', active: false},
    {id: '3' , name: 'BLOGS.GIFT_GUIDE', active: false},
    {id: '4' , name: 'BLOGS.ARRANGEMENT_ART', active: false}
  ];

  getCateg(id: any) {
    this.manCategory.forEach(item => item.active = false);
    const selectedItem = this.manCategory.find(item => item.id === id);
    if (selectedItem) {
      selectedItem.active = true;
    }
  }
}
