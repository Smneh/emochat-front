import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';

@Component({
  selector: 'app-custom-input',
  templateUrl: './custom-input.component.html',
  styleUrls: ['./custom-input.component.scss']
})
export class CustomInputComponent implements OnInit {

  @ViewChild('inputElement') inputElement: ElementRef;
  @Input() customPlaceholder = '';
  @Input() showIcon = false;
  @Input() inputType = 'text';
  @Input() inputValue: number | string = '';
  @Output() onInputChange = new EventEmitter<string>();
  @Output() onEnterKeyPress = new EventEmitter();

  constructor() {
    if (this.inputElement) {
      setTimeout(() => {
        this.inputElement.nativeElement.focus();
      }, 50);
    }
  }

  ngOnInit(): void {
  }

  inputChanged(event: any) {
    this.onInputChange.emit(event.target.value);
  }

  onEnterKey(event: any)  {
    this.onEnterKeyPress.emit(event);
  }

}
