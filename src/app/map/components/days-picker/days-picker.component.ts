import { Component, OnInit, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { faAngleUp, faAngleDown } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-days-picker',
  templateUrl: './days-picker.component.html',
  styleUrls: ['./days-picker.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DaysPickerComponent),
      multi: true
    }
  ]
})
export class DaysPickerComponent implements OnInit, ControlValueAccessor {
  @Input()
  disabled = false;

  faAngleUp = faAngleUp;
  faAngleDown = faAngleDown;
  value = 1;

  constructor() {}
  ngOnInit(): void {}

  onChange = (value: number) => {};
  onTouched = () => {};

  upCount() {
    this.value += 1;
    this.writeValue(this.value);
  }

  downCount() {
    if (this.value > 1) {
      this.value -= 1;
      this.writeValue(this.value);
    }
  }

  writeValue(value: number): void {
    this.onChange(this.value);
  }
  registerOnChange(fn: (value: number) => void): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
