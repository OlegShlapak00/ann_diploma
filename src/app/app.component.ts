import {Component, inject} from '@angular/core';
import {FormBuilder, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatSelectModule} from "@angular/material/select";
import {MatButtonModule} from "@angular/material/button";
import {MatTableModule} from "@angular/material/table";
import {MatPaginatorModule} from "@angular/material/paginator";
import {ITableData} from "./interfaces";
import {ApiService} from "./api.service";
import {toSignal} from "@angular/core/rxjs-interop";
import {CommonModule} from "@angular/common";
import {take} from "rxjs";
import {Region} from "./models";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    CommonModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  private api = inject(ApiService);
  regExInteger = '^[0-9]*$';
  regExDecimal = /^[0-9]+(\.[0-9]{1,2})?$/;

  title = 'Розрахунок ціни квартири';
  form;
  searchedData: ITableData[] = [];
  displayedColumns = [
    'price',
    'region',
    'metro',
    'roomFloor',
    'allFloors',
    'rooms',
    'allArea',
    'livingArea',
    'kitchenArea'
  ];

  regions = toSignal(this.api.getRegions());


  constructor(public fb: FormBuilder) {
    this.form = this.fb.group({
      region: ['', Validators.required],
      metro: ['', Validators.required],
      roomFloor: ['', [Validators.required, Validators.pattern(this.regExInteger)]],
      allFloors: ['', [Validators.required, Validators.pattern(this.regExInteger)]],
      rooms: ['', [Validators.required, Validators.pattern(this.regExInteger)]],
      allArea: ['', [Validators.required, Validators.pattern(this.regExDecimal)]],
      livingArea: ['', [Validators.required, Validators.pattern(this.regExDecimal)]],
      kitchenArea: ['', [Validators.required, Validators.pattern(this.regExDecimal)]],
    });

    this.searchedData = JSON.parse(localStorage.getItem('data') as string) as ITableData[] || [];
  }

  sendForm() {
    const formData = this.form.value as any;
    this.api.getPrice(formData).pipe(take(1)).subscribe((result) => {
      this.updateTable(result);
      this.resetForm();
    });
  }

  getRegionByIndex(index: number): string {
    return (this.regions() as any)?.find((region: Region) => region.index === index).name;
  }

  updateTable(result: { price: string }): void {
    this.searchedData.unshift({...(this.form.value as any), price: result.price});
    this.searchedData = [...this.searchedData];
    this.checkForLength();

    localStorage.setItem('data', JSON.stringify(this.searchedData));
  }

  resetForm(): void {
    this.form.reset();
    Object.values(this.form.controls).forEach((control: any) => control.setErrors(null));
    this.form.setErrors({'incorrect': true});
  }

  checkForLength(): void {
    if (this.searchedData.length > 10) {
      this.searchedData = this.searchedData.slice(0, 9);
      this.searchedData = [...this.searchedData]
    }
  }
}
