import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { faSave } from '@fortawesome/free-solid-svg-icons';
import { FormBuilder } from '@angular/forms';
import { CovidData, CovidState } from '../../../data.service';

@Component({
  selector: 'app-data-modal',
  templateUrl: './data-modal.component.html',
  styleUrls: ['./data-modal.component.scss']
})
export class DataModalComponent implements OnInit {
  @Input()
  data: CovidData;

  @Input()
  level: 'alert' | 'warning' = 'warning';

  covidState = CovidState;

  faSave = faSave;
  form = this.fb.group({
    fiebre: false,
    cansancio: false,
    tosSeca: false,
    congestionNasal: false,
    rinorrea: false,
    dolorGarganta: false,
    diarrea: false,
    days: 1,
    state: ''
  });

  constructor(public activeModal: NgbActiveModal, private fb: FormBuilder) {}

  ngOnInit() {
    if (this.data?.metadata) {
      const data = this.data.metadata;
      delete (data as any).id;
      delete (data as any).createdAt;
      delete (data as any).updatedAt;
      this.form.setValue(data);
    }
  }

  save() {
    this.activeModal.close(this.form.value);
  }
}
