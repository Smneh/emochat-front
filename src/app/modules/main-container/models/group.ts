import {GroupParticipants} from "./group-participants";

export class Group {
    public title: string = '-';
    public groupId: string = '-';
    public description: string = '-';
    public fullname: string = '-';
    public username: string = '-';
    public profilePictureId: string = '-';
    public isPrivate: boolean = false;
    public creator: string = '-';
    public isCreator: boolean = false;
    public isAdmin: boolean = false;
    public typeId: number = 0;
    public membersSetId: number = 0;
    public pinnedMessageId: number = -1;
    public adminsSetId: number = 0;
    public unreadMessages: string = '';
    public admins: string[] = [];
    groupMembers:GroupParticipants[];
    public get unreads() {
        return this.unreadMessages ? this.unreadMessages.split(',').map(x => +x) : [];
    }
}
