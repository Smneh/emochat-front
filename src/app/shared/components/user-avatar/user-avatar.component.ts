import {Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {OnlineUsersService} from "../../services/online-users.service";
import {NgbModal, NgbModalRef} from "@ng-bootstrap/ng-bootstrap";
import {PhotosView} from "../photos-view/photos-view.component";
import {environment} from "../../../../environments/environment";
import {StorageService} from "../../services/storage.service";
import {Subscription} from "rxjs";
import {ProfilePictureService} from "../../services/profile-picture.service";

@Component({
  selector: 'user-avatar',
  templateUrl: './user-avatar.component.html',
  styleUrls: ['./user-avatar.component.scss']
})
export class UserAvatar implements OnInit, OnChanges, OnDestroy{

  constructor(
    public onlineUsersService: OnlineUsersService,
    private modalService: NgbModal,
    private storageService: StorageService,
    private profilePictureService:ProfilePictureService
  ) {
  }

  ngOnInit(): void {
    this.profilePictureIdSubscription = this.profilePictureService.profilePictureId$.subscribe((profilePictureId: string) => {
      if (profilePictureId && profilePictureId !== this.guid) {
        this.guid = profilePictureId;
        this.getUserProfilePicture();
      }
    });

    if (this.profileUrl && this.profileUrl.length > 0) {
      this.imageUrl = this.profileUrl;
      this.showProfileImage = true;
    } else {
      this.getUserProfilePicture();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['profileUrl'] && changes['profileUrl'].currentValue) {
      this.imageUrl = changes['profileUrl'].currentValue;
      this.showProfileImage = true;
    } else {
      this.getUserProfilePicture();
    }
  }

  ngOnDestroy(): void {
    this.profilePictureIdSubscription.unsubscribe();
  }

  imageUrl: string = "";
  modalRef: NgbModalRef;
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
  @Input() width: string = "70px";
  @Input() borderRadius: string = "50%";
  @Input() mark: boolean = false;
  @Input() showOnlineStatus: boolean = false;
  @Input() color: string;
  @Input() title: string;
  @Input() profileUrl: string;
  @Input() guid: string;
  @Input() inline: true;
  showProfileImage: boolean = false;
  private profilePictureIdSubscription: Subscription;

  @Input() set username(value: string) {
    this._username = value;
  }

  check() {
    this.onlineUsersService.checkOnlineStatus(this._username);
  }

  private getUserProfilePicture() {
    if (!this.guid || this.guid == '' || this.guid == '-') {
      this.setProfileTitle();
      return;
    }
    let params = this.guid + '?token='+ this.storageService.retrieve('accessToken') + '&inLine=true';
    this.imageUrl = environment.Web_Api_Url + environment.Download_Path + params;
    this.showProfileImage = true;
  }

  filePreview() {
    this.modalRef = this.modalService.open(PhotosView, {
      size: 'xl',
      centered: true,
      animation: false,
      windowClass: "image-modal"
    })
    this.modalRef.componentInstance.attachmentAddress = this.imageUrl;
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

  private setProfileTitle() {
    if (this.title && this.title.length > 0) {
      if (this.color && this.color.length > 0) {
        this.backgroundColor = "var(" + this.color + ")";
        this.setProfileColor(this.title);
      } else {
        this.setProfileColor(this.title);
      }
    }
  }
}
