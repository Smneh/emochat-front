import {UserService} from '../../../../shared/services/user.service';
import {ConfigsService} from '../../../../shared/services/configs.service';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {UsersRepositoryService} from '../../services/repositories/users-repository.service';
import {UsersService} from '../../services/users.service';
import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {Subject} from 'rxjs';
import {debounceTime, distinctUntilChanged} from 'rxjs/operators';
import {SnackbarMessageService} from 'src/app/shared/services/snackbar-message.service';
import {ParticipantsFilter} from '../../models/participants-filter';

@Component({
  selector: 'app-users',
  templateUrl: './app-users.component.html',
  styleUrls: ['./app-users.component.scss']
})
export class AppUsers implements OnInit, OnDestroy {

  selectedUsers: string[] = [];
  private unsubscriber = new Subject<string>();
  private userSearchSubhect = new Subject<string>();
  membersCount = 0;
  usersSearchText = "";
  myUser: string
  membersLoading: boolean = false
  loading = false
  skip = 0;
  take = 50;

  @Input() setAdmin: boolean = false
  @Input() title = 'Users';
  @Input() showHeader: boolean = true;
  @Input() canEditByMembers
  @Input() sourceId: string
  @Input() canModify: boolean
  @Input() groupId: string
  @Input() sourceType;
  @Input() multipleSelect = false;
  @Input() set taskUsers(val: any[]) {
    if (val.length) {
      val.forEach((x) => {
        let index = this.sharedService.users.findIndex(user => user.id == x.id);
        if (index > -1) {
          this.selectedUsers.push(x.username)
        }
      })
    }
  }
  @Input() allowAddMember: boolean = false;
  @Input() mark: boolean = false;
  @Output() selectUser = new EventEmitter<{ selectedUser: string }>()
  @Output() membersChanged = new EventEmitter<{
    sourceType: string;
    operationType: "Add" | "Remove";
    member: {};
  }>();

  constructor(
    public sharedService: UsersService,
    private userService: UserService,
    private SnackbarMessageService: SnackbarMessageService,
    private userRepositoryService: UsersRepositoryService,
    private activeModalService: NgbActiveModal,
    public configurationService: ConfigsService
  ) {
    this.userSearchSubhect.pipe(debounceTime(200), distinctUntilChanged()).subscribe(() => {
      if (this.groupId == null || this.groupId == '' || this.groupId == undefined) {
        this.getUsers();
      }
    })
  }
  ngOnDestroy(): void {
    this.sharedService.members = [];
  }

  ngOnInit(): void {
    this.myUser = this.userService.userData.username;
    if (this.groupId == null || this.groupId == '' || this.groupId == undefined) {
      this.getUsers();
    }
  }

  getUsers() {
    let filter: ParticipantsFilter = <ParticipantsFilter>{}
    filter.searchText = `%${this.usersSearchText}%`
    filter.skip = this.skip
    filter.take = this.take
    this.userRepositoryService.getAll(filter).subscribe(res => {
      this.sharedService.users = res;
      this.loading = false;
    })

  }

  onAllUsersSearchKeyUp($event) {
    this.loading = true;
    this.userSearchSubhect.next($event.target.value)
  }

  onUserClicked(user, userIndex) {
    let index = this.sharedService.members.findIndex(x => x.username == user.username);
      if (this.multipleSelect == false) {
        this.selectUser.emit(user);
      }
      else {
        if (this.mark) {
          if (this.selectedUsers.includes(user.username)) {
            if (this.selectedUsers.length == 1) {
              this.selectedUsers = [];
            } else {
              let removableUserIndex = this.selectedUsers.findIndex(x => x == user.username);
              this.selectedUsers.splice(removableUserIndex, 1);
            }
          } else {
            this.selectedUsers.push(user.username);
          }
          this.selectUser.emit(user);
        } else {
          this.selectUser.emit(user);
        }
    }
  }

  close() {
    this.activeModalService.close()
  }
}





