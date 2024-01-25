import {UserService} from '../../../../shared/services/user.service';
import {ConfigsService} from '../../../../shared/services/configs.service';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {UsersRepositoryService} from '../../services/repositories/users-repository.service';
import {UsersService} from '../../services/users.service';
import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {Subject} from 'rxjs';
import {debounceTime, distinctUntilChanged, takeUntil} from 'rxjs/operators';
import {SnackbarMessageService} from 'src/app/shared/services/snackbar-message.service';
import {ParticipantsFilter} from '../../models/participants-filter';

@Component({
  selector: 'add-new-member-modal',
  templateUrl: './add-new-member-modal.html',
  styleUrls: ['./add-new-member-modal.scss']
})
export class AddNewMemberModal implements OnInit, OnDestroy {

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

  @Input() title = 'Users';
  @Input() showHeader: boolean = true;
  @Input() groupId: string
  @Input() sourceType;
  @Input() multipleSelect = true;
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
  @Input() allowAddMember: boolean = true;
  @Input() mark: boolean = false;


  @Output() selectUser = new EventEmitter<{ selectedUser: string }>()
  @Output() membersChanged = new EventEmitter<{
    sourceType: string;
    operationType: "Add";
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
        this.getUsers();
    })

  }
  ngOnDestroy(): void {
    this.sharedService.members = [];
  }

  ngOnInit(): void {
    this.myUser = this.userService.userData.username;
    this.getUsers();
  }

  getUsers() {
    let filter: ParticipantsFilter = <ParticipantsFilter>{}
    filter.searchText = `%${this.usersSearchText}%`
    filter.skip = this.skip
    filter.take = this.take
    filter.groupId = this.groupId;
    this.userRepositoryService.getUsersWithExcludeFilter(filter).subscribe(res => {
      this.sharedService.users = res;
      this.loading = false;
    })
  }

  addMember(user: any) {
      this.membersLoading = true;
      this.userRepositoryService
        .addMember(
          user.username,
          this.groupId,
        )
        .pipe(takeUntil(this.unsubscriber))
        .subscribe((res) => {
          this.sharedService.members.push(user);
          let usrIndex = this.sharedService.members.findIndex(
            (x) => x.username == user.username
          );
          if (usrIndex > -1) this.sharedService.members[usrIndex].isSelected = 1;
          let index = this.sharedService.users.findIndex(x => x.username == user.username);
          this.sharedService.users.splice(
            index,
            1
          );
          this.membersCount++;
          this.membersLoading = false;
          this.membersChanged.emit({
            sourceType: this.sourceType,
            operationType: "Add",
            member: user,
          });
        });
      this.SnackbarMessageService.success('New member added successfully')
  }

  onAllUsersSearchKeyUp($event) {
    this.loading = true;
    this.userSearchSubhect.next($event.target.value)
  }

  onUserClicked(user, userIndex) {
      if (this.multipleSelect == false) {
        if (this.allowAddMember)
          this.addMember(user);
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
          this.addMember(user);
          this.selectUser.emit(user);
        }
      }
  }

  close() {
    this.activeModalService.close()
  }
}





