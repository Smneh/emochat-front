import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'custom-header',
  templateUrl: './custom-header.component.html',
  styleUrls: ['./custom-header.component.scss']
})
export class CustomHeader implements OnInit {

  constructor(private modal: NgbActiveModal) { }

  @Input() showHeader: boolean = true
  @Input() mt6: boolean = false
  ngOnInit(): void {
  }

  close() {
    this.modal.close();
  }
}
