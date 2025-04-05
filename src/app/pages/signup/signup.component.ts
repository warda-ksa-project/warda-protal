import { Component, Inject, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { DOCUMENT, NgIf } from '@angular/common';
import { ToasterService } from '../../services/toaster.service';
import { ApiService } from '../../services/api.service';
import { Router, RouterModule } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../../services/language.service';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputNumberModule } from 'primeng/inputnumber';
import { OtpModalComponent } from '../../components/otp-modal/otp-modal.component';


@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    TranslatePipe, OtpModalComponent, NgIf, FloatLabelModule, InputTextModule,
    PasswordModule, ButtonModule, RouterModule, ReactiveFormsModule, InputNumberModule
  ],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent {

  signup: FormGroup;
  toaster = inject(ToasterService);
  languageService = inject(LanguageService);
  selectedLang: string = localStorage.getItem('lang') || 'ar';
  openOtpModal: boolean = false;
  mobileNumber: string = '';

  constructor(
    private fb: FormBuilder,
    @Inject(DOCUMENT) private document: Document,
    private api: ApiService,
    private translate: TranslateService,
    private router: Router
  ) {
    this.signup = this.fb.group({
      email: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/)]],
      phone: [null, [Validators.required, Validators.pattern(/^(5)[0-9]{8}$/)]],
      name: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
    }, { validators: this.passwordsMatchValidator });
  }

  // ✅ Custom Validator for Matching Passwords
  passwordsMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordsMismatch: true };
  }

  // ✅ Helper Function for Checking Passwords
  get passwordsDoNotMatch(): boolean {
    return !!(this.signup.hasError('passwordsMismatch') && this.signup.get('confirmPassword')?.touched);
  }

  toggleLanguage() {
    this.selectedLang = this.selectedLang === 'en' ? 'ar' : 'en';
    this.languageService.change(this.selectedLang);

    this.document.body.dir = this.selectedLang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.setAttribute('lang', this.selectedLang);
    document.documentElement.setAttribute('dir', this.selectedLang === 'ar' ? 'rtl' : 'ltr');
  }

  onSubmit() {
    if (this.signup.valid) {
      this.signup.value.phone = this.signup.value.phone.toString();
      this.onRegister(this.signup.value);
    } else {
      this.toaster.errorToaster(this.translate.instant('signup.error_message'));
    }
  }

  onRegister(signupData: any) {
    console.log('User registered:', signupData);
    this.api.post('Portal/PortalRegister', signupData).subscribe((res: any) => {
      console.log(res);
      this.toaster.successToaster(this.translate.instant('signup.success_message'));
      this.mobileNumber = signupData.phone;
      this.openOtpModal = true
    },
      err => {
        this.openOtpModal = false;
      })
  }

  getOtpValue(e: any) {
    let otpObject = {
      "phone": this.mobileNumber,
      "otpCode": e.otpValue
    }
    this.api.post('api/Auth/ActivateAccount', otpObject).subscribe((data: any) => {
      console.log(data.data);
      if (data.message == 'Otp Is Not Valid') {
        this.toaster.errorToaster(data.message)
      } else {
        this.toaster.successToaster(data.message)
        this.router.navigate(['/auth/login']);
        this.openOtpModal = false;
      }
    })
  }

  onActiveUser() {

  }

  resendOtp(e: any) {
    this.onActiveUser();
  }
}
