import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-custom-progress-bar',
  templateUrl: './custom-progress-bar.component.html',
  styleUrls: ['./custom-progress-bar.component.scss']
})
export class CustomProgressBarComponent {

  _progressValue: any = null;

  @Input() set progressValue(val: any) {
    if (val || val === 0) {
      this._progressValue = val;
    }
  }

  constructor() { }
}
