import {ConversationService} from '../../services/conversation.service';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {SnackbarMessageService} from '../../../../shared/services/snackbar-message.service';
import {GroupsDataRepositoryService} from '../../services/repositories/groups-data-repository.service';
import {GroupForm} from '../../models/group-form';
import {Component, OnInit} from '@angular/core';
import {UserService} from 'src/app/shared/services/user.service';
import {Router} from '@angular/router';
import {SharedService} from '../../services/groups.service';
import {Subject} from "rxjs";
import {UsersService} from '../../services/users.service';
import {ParticipantsFilter} from "../../models/participants-filter";
import {debounceTime, distinctUntilChanged} from "rxjs/operators";

@Component({
  selector: 'new-group-modal',
  templateUrl: './new-group-modal.html',
  styleUrls: ['./new-group-modal.scss']
})
export class NewGroupModal implements OnInit {

  selectedUsers: string[] = [];
  groupName: string = '';
  groupProfilePictureId;
  loading: boolean = false;
  usersSearchText = "";
  private userSearchSubhect = new Subject<string>();
  membersLoading: boolean = false
  mark: boolean = false;
  membersCount = 0;
  skip = 0;
  take = 50;
  members:string[] = [];

  constructor(
    private router: Router,
    public userService: UserService,
    private SnackbarMessageService: SnackbarMessageService,
    private modalService: NgbActiveModal,
    private chatListService: ConversationService,
    private groupRepositoryService: GroupsDataRepositoryService,
    private sharedService: SharedService,
    public usersSharedService:UsersService
  ) {
    this.userSearchSubhect.pipe(debounceTime(200), distinctUntilChanged()).subscribe(() => {
      this.getUsers();
    })
  }

  attachment(event) {
    this.groupProfilePictureId = event.attachments;
  }

  ngOnInit(): void {
    this.getUsers();
  }

  ngOnDestroy(): void {
    this.usersSharedService.members = [];
  }

  create() {
    if (this.groupName.trim() == ''){
      this.SnackbarMessageService.warning('Please enter a group name')
      return;
    }
    this.registerGroup();
  }

  registerGroup() {
    if (this.loading)
      return;
    this.loading = true;
    let group: GroupForm = new GroupForm();
    group.title = this.groupName;
    group.profilePictureId = this.groupProfilePictureId == undefined || null || '' ? '-' : this.groupProfilePictureId;
    group.members = this.members;
    this.groupRepositoryService.add(group).subscribe((res) => {
      this.sharedService.isFirstLoading = true;
      this.chatListService.getChatList();
    },
      error => {
        this.SnackbarMessageService.error('An error occurred while creating group')
      }
    )
    this.close();
  }

  close() {
    this.modalService.close();
  }

  onAllUsersSearchKeyUp($event) {
    this.loading = true;
    this.userSearchSubhect.next($event.target.value)
  }

  onUserClicked(user, userIndex) {
    let index = this.usersSharedService.members.findIndex(x => x.username == user.username);
    if (index > -1) {
      this.removeMember(user)
    } else {
      // if (this.mark) {
      //   this.selectedUser[userIndex] = !this.selectedUser[userIndex];
      //   this.selectUser.emit(user);
      // } else {
        this.addMember(user);
        // this.selectUser.emit(user);
      // }
    }
  }

  removeMember(user) {
    let index = this.usersSharedService.members.findIndex(x => x.username == user.username);
    if (index > -1) {
      this.usersSharedService.members[index].isSelected = 0;
      this.usersSharedService.members.splice(index, 1);
      var memberIndex = this.members.findIndex((x => x == user.username));
      this.members.splice(memberIndex, 1);
    }
  }

  addMember(user: any) {
    if (!this.membersLoading) {
      this.membersLoading = true;
      this.usersSharedService.members.push(user);
      let usrIndex = this.usersSharedService.members.findIndex((x) => x.username == user.username);
      if (usrIndex > -1) this.usersSharedService.members[usrIndex].isSelected = 1;
          this.membersCount++;
          this.membersLoading = false;
          this.members.push(user.username);
    }
  }
  getUsers() {
    let filter: ParticipantsFilter = <ParticipantsFilter>{}
    filter.searchText = `%${this.usersSearchText}%`
    filter.skip = this.skip
    filter.take = this.take
    this.groupRepositoryService.getAllUsers(filter).subscribe(res => {
      this.usersSharedService.users = res;
      this.loading = false;
    })
  }
}
