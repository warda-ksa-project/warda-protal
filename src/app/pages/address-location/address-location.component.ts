import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  inject,
  Input,
  Output,
} from "@angular/core";
import { MapComponent } from "../../components/map/map.component";
import { NgIf } from "@angular/common";
import { ApiService } from "../../services/api.service";
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { Validations } from "../../validations";
import { InputTextModule } from "primeng/inputtext";
import { SelectModule } from "primeng/select";
import { FloatLabelModule } from "primeng/floatlabel";
import { TranslateModule, TranslatePipe } from "@ngx-translate/core";
import { LanguageService } from "../../services/language.service";

@Component({
  selector: "app-address-location",
  standalone: true,
  imports: [
    MapComponent,
    NgIf,
    TranslatePipe,
    ReactiveFormsModule,
    InputTextModule,
    SelectModule,
    FloatLabelModule,
  ],
  templateUrl: "./address-location.component.html",
  styleUrl: "./address-location.component.scss",
})
export class AddressLocationComponent {
  @Output() confirmAddress: any = new EventEmitter();
  @Input() showMap = false;
  cities: any = [];
  apiService = inject(ApiService);
  selectedLang: any;
  languageService = inject(LanguageService);
  form = new FormGroup({
    expalinedAddress: new FormControl("", {
      validators: [Validators.required],
    }),
    cityId: new FormControl("", {
      validators: [Validators.required],
    }),

    street: new FormControl("", {
      validators: [Validators.required],
    }),
    district: new FormControl("", {
      validators: [Validators.required],
    }),
    buildNo: new FormControl<any>("", {
      validators: [Validations.onlyNumberValidator()],
    }),
    floorNo: new FormControl<any>("", {
      validators: [Validators.required, Validations.onlyNumberValidator()],
    }),
    flatNo: new FormControl<any>("", {
      validators: [Validators.required, Validations.onlyNumberValidator()],
    }),
    logitude: new FormControl("", {
      validators: [Validators.required, Validations.decimalNumberValidators()],
    }),
    latitude: new FormControl("", {
      validators: [Validators.required, Validations.decimalNumberValidators()],
    }),
    isDefault: new FormControl(false, {
      validators: [Validators.required],
    }),
    id: new FormControl(0),
  });
  ngOnInit() {
    this.getAllCity();
    this.languageService.translationService.onLangChange.subscribe(() => {
      this.selectedLang = this.languageService.translationService.currentLang;
      this.getAllCity();
    });
  }
  onDefault(event: any) {
    this.onChangeLocation(event);
  }
  getAllCity() {
    this.apiService.get("api/city/GetAll").subscribe((res: any) => {
      if (res.data) {
        this.cities = [];
        res.data.map((city: any) => {
          this.cities.push({
            name: this.selectedLang == "en" ? city.enName : city.arName,
            code: city.id,
          });
        });
      }
    });
  }
  onChangeLocation(event: any) {
    console.log(event);
    this.form.patchValue({
      latitude: String(event.lat),
      logitude: String(event.lng),
    });
  }

  addNewAddress() {
    this.apiService
      .post("Portal/AddressPortal/Create", this.form.value)
      .subscribe((res) => {
        if(res)
          this.confirmAddress.emit('success')
      });
  }
}
