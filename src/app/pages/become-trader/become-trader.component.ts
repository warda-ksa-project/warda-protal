import { CommonModule, NgClass, NgFor, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ApiService } from '../../services/api.service';
import { LanguageService } from '../../services/language.service';
import { ToasterService } from '../../services/toaster.service';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { FileUploadModule } from 'primeng/fileupload';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { FileUpload, UploadEvent } from 'primeng/fileupload';
import { InputNumberModule } from 'primeng/inputnumber';
import { MapComponent } from '../../components/map/map.component';


@Component({
  selector: 'app-become-trader',
  standalone: true,
  imports: [
    BreadcrumbModule,
    NgFor,
    NgIf,
    CommonModule,
    TranslatePipe,
    NgClass,
    FormsModule,
    ReactiveFormsModule,
    DropdownModule,
    FileUploadModule,
    FloatLabelModule,
    InputTextModule,
    SelectModule,
    FileUpload,
    InputNumberModule,
    MapComponent
  ],
  templateUrl: './become-trader.component.html',
  styleUrl: './become-trader.component.scss',
})
export class BecomeTraderComponent {
  toaster = inject(ToasterService);
  api = inject(ApiService);
  router = inject(Router);
  route = inject(ActivatedRoute);
  languageService = inject(LanguageService);
  fb = inject(FormBuilder);

  selectedLang: string = localStorage.getItem('lang') || 'ar';
  breadcrumb: any;

  merchantForm!: FormGroup;
  cities: any[] = [];

  fileFields = ['cr', 'license', 'iban', 'image'];

  ngOnInit(): void {
    this.breadcrumb = [
      { label: 'الرئيسية', routerLink: '/' },
      { label: 'انضم كتاجر' },
    ];

    this.initForm();
    this.getCitesList();
    this.selectedLang = this.languageService.translationService.currentLang || 'ar';
    this.languageService.translationService.onLangChange.subscribe(lang => {
      this.selectedLang = lang.lang;
      this.breadcrumb = [
        { label: 'الرئيسية', routerLink: '/' },
        { label: 'انضم كتاجر' },
      ];
    });
  }

  initForm() {
    this.merchantForm = this.fb.group({
      storeName: ['', Validators.required],
      numberOfBranches: [1, [Validators.required, Validators.min(1)]],
      cr: [''],
      license: [''],
      iban: [''],
      image: [''],
      addresses: this.fb.array([
        this.fb.group({
          expalinedAddress: ['', Validators.required],
          logitude: ['', Validators.required],
          latitude: ['', Validators.required],
          cityId: [null, Validators.required],
          userId: localStorage.getItem('userId'),
        }),
      ]),
    });
  }

  get addresses(): FormArray {
    return this.merchantForm.get('addresses') as FormArray;
  }

  submitForm() {
    if (this.merchantForm.invalid) {
      this.toaster.errorToaster('Please fill all required fields.');
      this.merchantForm.markAllAsTouched();
      return;
    }

    console.log(this.merchantForm.value);

    this.api.post('Portal/BecomeTrader', this.merchantForm.value).subscribe({
      next: (res) => {
        this.toaster.successToaster('Registration successful');
        this.router.navigate(['/home']);
      },
      error: () => {
        this.toaster.errorToaster('Failed to register trader.');
      }
    });
  }

  onSelect(event: any, field: string) {
    const file = event.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = (reader.result as string).split(',')[1];
        const control = this.merchantForm.get(field);
        if (control) {
          control.setValue(base64);
        } else {
          console.warn(`⚠️ No control found for field: ${field}`);
        }
      };
      reader.readAsDataURL(file);
    }
  }

  get firstAddress(): FormGroup {
    return this.addresses.at(0) as FormGroup;
  }

  getCitesList() {
    this.api.get('api/City/GetAll').subscribe((res: any) => {
      console.log(res);
      res.data.forEach((data: any) => {
        data.fullName = data.arName + ' - ' + data.enName
      })
      this.cities = res.data
      console.log(this.cities);
    })
  }

  onChangeLocation(data: any) {
    console.log(data);
  }

}
