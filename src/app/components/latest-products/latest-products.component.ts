import { NgFor, NgStyle, NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { CarouselModule, OwlOptions, SlidesOutputData } from 'ngx-owl-carousel-o';

@Component({
  selector: 'app-latest-products',
  standalone: true,
  imports: [NgFor , TranslatePipe , CarouselModule , NgStyle , NgClass],
  templateUrl: './latest-products.component.html',
  styleUrl: './latest-products.component.scss'
})
export class LatestProductsComponent {

  activeIndex: number = 1; // Set the default center slide index

  customOptions: OwlOptions = {
    loop: true,
    margin: 10,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    rtl: true,
    dots: true,
    navSpeed: 700,
    center: true, // Center active slide
    responsive: {
      0: { items: 1 },
      600: { items: 2 },
      1000: { items: 3 }
    },
    nav: false, // Remove navigation arrows
  };

  flowersList = [
    {id:'1' , title: 'ورد الجوري' , price: 450 , oldPrice: 600 , image:'../../../assets/images/flowers/flower7.png'},
    {id:'2' , title: 'الياسمين' , price: 350 , oldPrice: 500 , image:'../../../assets/images/flowers/flower8.png'},
    {id:'3' , title: 'الفل' , price: 300 , oldPrice: 450 , image:'../../../assets/images/flowers/flower9.png'},
    {id:'4' , title: 'اللافندر' , price: 550 , oldPrice: 700 , image:'../../../assets/images/flowers/flower7.png'},
    {id:'5' , title: 'التوليب' , price: 500 , oldPrice: 650 , image:'../../../assets/images/flowers/flower8.png'},
    {id:'6' , title: 'النرجس' , price: 400 , oldPrice: 550 , image:'../../../assets/images/flowers/flower9.png'}
  ];

  getActiveSlide(event: SlidesOutputData) {
    const currentIndex = event.startPosition;
    if (currentIndex !== null && currentIndex !== undefined) {
      this.activeIndex = currentIndex + 1; // Ensure middle detection
    }
  }
}
