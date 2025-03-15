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


@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    TranslatePipe, NgIf, FloatLabelModule, InputTextModule,
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

  constructor(
    private fb: FormBuilder,
    @Inject(DOCUMENT) private document: Document,
    private api: ApiService,
    private translate: TranslateService,
    private router: Router
  ) {
    this.signup = this.fb.group({
      email: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/)]],
      mobileNumber: [null, [Validators.required, Validators.pattern(/^(5)[0-9]{8}$/)]],
      userName: ['', [Validators.required]],
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
      this.onRegister(this.signup.value);
    } else {
      this.toaster.errorToaster(this.translate.instant('signup.error_message'));
    }
  }

  onRegister(signupData: any) {
    console.log('User registered:', signupData);
    this.toaster.successToaster(this.translate.instant('signup.success_message'));
    this.router.navigate(['/dashboard']);
  }
}
