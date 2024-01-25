import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {Component, Input, OnInit} from '@angular/core';
import {environment} from 'src/environments/environment';
import {OnlineUsersService} from '../../services/online-users.service';
import {PhotosView} from '../photos-view/photos-view.component';
import {StorageService} from "../../services/storage.service";

@Component({
  selector: 'profile-picture',
  templateUrl: './profile-picture.component.html',
  styleUrls: ['./profile-picture.component.scss']
})
export class ProfilePicture implements OnInit {
  constructor(public onlineUsersService: OnlineUsersService,
              private storageService: StorageService,
              private modalService: NgbModal) {
  }

  ngOnInit(): void {
  }

  modalRef: NgbModalRef
  _attachmenAddress: string = "";
  _username: string = "";
  _title = '-';
  backgroundColor = "5e6c84";
  colors = [
    '#3683d3',
    '#023360',
    '#bebbbb',
    '#3d3d3d',
    '#66727c',
    '#ab1ee8',
    '#061b38',
    '#1c79ad',
    '#a91507',
    '#108f44',
    '#d79008',
    '#dc5e0c',
    '#2d7968',
    '#2980b9',
    '#32e50a',
    '#b048c5',
    '#ad893d',
    '#23599d',
    '#075d2e',
    '#e7af26',
    '#b20806',
    '#107c66',
    '#731e98',
    '#72042e',
    '#b73d92',
    '#0c5e4d',
    '#d93e05',
    '#0b2333',
    '#0b2d18',
    '#b7391d',
    '#004235',
    '#612381',
    '#b04800',
    '#15405b',
    '#155b31',
    '#ffc600',
    '#ff1400',
    '#117360',
    '#a918c5',
    '#50ef14',
  ]
  @Input() preview: boolean = false;
  @Input() width: string = "";
  @Input() borderRadius: string = "";
  @Input() isChannel = false;
  @Input() mark: boolean = false;
  @Input() showOnlineStatus: boolean = false;

  @Input() set username(value: string) {
    this._username = value;
  }

  @Input() set title(text) {
    this.setProfileColor(text);
  }

  @Input() set color(color) {
    this.backgroundColor = "var(" + color + ")"
  }

  @Input() set attachmentId(value: string) {
    if (value == "-" || value == undefined || value == "") {
      this._attachmenAddress = '';
    }
    else if (value.includes('.')) {
      let params = value.split('.')[0] + '?token='+ this.storageService.retrieve('accessToken') + '&inLine=true';
      this._attachmenAddress = environment.Web_Api_Url + environment.Download_Path + params;
    }
    else {
      let params2 = value + '?token='+ this.storageService.retrieve('accessToken') + '&inLine=true';
      this._attachmenAddress = environment.Web_Api_Url + environment.Download_Path + params2 ;
    }
  }

  check() {
    this.onlineUsersService.checkOnlineStatus(this._username);
  }

  filePreview() {
    this.modalRef = this.modalService.open(PhotosView, { size: 'xl', centered: true, animation: false, windowClass: "image-modal" })
    this.modalRef.componentInstance.attachmentAddress = this._attachmenAddress
  }

  setProfileColor(text) {
    if (text) {
      let fullname = text.split(" ");
      let firstName: string = fullname[0] ? fullname[0] : '-';
      let lastName: string = fullname[1] ? fullname[1] : '';
      this._title = firstName.charAt(0) + ' ' + lastName.charAt(0);
      this.backgroundColor = this.colors[Math.floor(Math.random() * this.colors.length)];
    }
  }
}
