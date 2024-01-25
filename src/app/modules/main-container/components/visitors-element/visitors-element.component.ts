import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {MessagesApiService} from '../../services/messages.api.service';

@Component({
  selector: 'visitors-element',
  templateUrl: './visitors-element.component.html',
  styleUrls: ['./visitors-element.component.scss']
})
export class VisitorsElement implements OnInit {

  constructor(private apiService: MessagesApiService, private ngbActiveModal: NgbActiveModal) { }

  ngOnInit(): void {
  }

  visitors: any[] = []

  close() {
    this.ngbActiveModal.close();
  }

  @Input() set sourceId(id: number) {
    if (id > 0) {
      this.apiService.getVisitLog(id).subscribe(res => {
        this.visitors = res;
      })
    }
  }

  @Input() set visitorList(visitors: any) {
    if (visitors) {
      this.visitors = visitors;
    }
  }
}
