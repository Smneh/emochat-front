import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-custom-button',
  templateUrl: './custom-button.component.html',
  styleUrls: ['./custom-button.component.scss']
})
export class CustomButtonComponent implements OnInit {
  constructor() { }
  ngOnInit(): void {
  }
  @Input() text = 'Button';
  @Input() isFullWidth = false;
  @Input() isDisabled = false;
  @Input() isLarge = false;
  @Input() isSmall = false;
  @Input() bgColor = '';
  @Input() textColor = '';
  @Input() direction = '';
  @Input() margin = '';
  @Input() green = false;
}
