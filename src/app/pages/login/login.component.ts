
import { Component, Inject, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { DOCUMENT, NgIf } from '@angular/common';
import { ToasterService } from '../../services/toaster.service'; // Import here
import { ApiService } from '../../services/api.service';
import { Router, RouterModule } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../../services/language.service';
import { FloatLabelModule } from 'primeng/floatlabel';
import { LoginSignalUserDataService } from '../../services/login-signal-user-data.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [TranslatePipe, NgIf, FloatLabelModule, ReactiveFormsModule, InputTextModule, PasswordModule, ButtonModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  providers: [ApiService]
})

export class LoginComponent {


  loginForm: FormGroup;
  toaster = inject(ToasterService);
  otpValue: string = '';
  mobileNumber: string = '';
  openOtpModal: boolean = false;
  languageService = inject(LanguageService);
  currentLang = 'ar';
  selectedLang: string = localStorage.getItem('lang') || 'ar';



  constructor(private fb: FormBuilder, @Inject(DOCUMENT) private document: Document, private api: ApiService, private translate: TranslateService, private router: Router , private userDataSignals: LoginSignalUserDataService) {
    this.loginForm = this.fb.group({
      mobile: ['54985648', [Validators.required]],
      password: ['Pa$$w0rd', [Validators.required]],
    });

    this.translate.setDefaultLang('ar');
    this.translate.use('ar');  // You can change this dynamically
  }

  ngOnInit(): void {
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.onLogin(this.loginForm.value);
    } else {
      this.toaster.errorToaster(this.translate.instant('signup.error_message'));
    }
  }

  toggleLanguage() {
    this.selectedLang = this.selectedLang === 'en' ? 'ar' : 'en';
    this.currentLang = this.selectedLang;
    this.languageService.change(this.selectedLang);

    this.document.body.dir = this.selectedLang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.setAttribute('lang', this.selectedLang);
    document.documentElement.setAttribute('dir', this.selectedLang === 'ar' ? 'rtl' : 'ltr');
  }

  onLogin(data: any) {
    this.api.login(data).subscribe((res: any) => {
      console.log(res);
      this.mobileNumber = res.mobilePhone;
      const userData =  res.data;
      this.userDataSignals.setUser(userData);
      localStorage.setItem('token' , res.data.token);
      this.router.navigate(['/home'])
      if (!res.data.token) {
        localStorage.removeItem('token');
        this.userDataSignals.logout();
        this.toaster.errorToaster(res.message)
      }
    })
  }


  resendOtp(e: any) {
    this.onSubmit();
  }

}
