import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Toast } from 'primeng/toast';
import { LanguageService } from '../../services/language.service';
import { ToasterService } from '../../services/toaster.service';
import { NavbarComponent } from "../../shared/navbar/navbar.component";
import { FooterComponent } from '../../shared/footer/footer.component';
@Component({
  selector: 'app-home-layout',
  standalone: true,
  imports: [RouterOutlet, Toast, FooterComponent, NavbarComponent],
  templateUrl: './home-layout.component.html',
  styleUrl: './home-layout.component.scss'
})

export class HomeLayoutComponent {
  showMenuIcon:boolean=false
  selectedLang: any;
  languageService = inject(LanguageService);
  toaster = inject(ToasterService);

  ngOnInit(): void {
    this.selectedLang = this.languageService.translationService.currentLang;
    this.languageService.translationService.onLangChange.subscribe(() => {
      this.selectedLang = this.languageService.translationService.currentLang;
    })
  }

  onClickMenuIcon(){
    this.showMenuIcon=!this.showMenuIcon
  }

  onClickOutSideCompleted(event:boolean){
   if(event)
     this.showMenuIcon=false
  }

}
