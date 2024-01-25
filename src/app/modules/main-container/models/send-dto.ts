enum Type {
    normal = 1,
    replay = 3
}

export class SendDto {
    content: string;
    receiver: string;
    receiverType: string;
    isShareable: boolean;
    isCommentable: boolean;
    isPublic: boolean;
    attachments: string;
    messageTypeId: number;
    parentId: number;
    messageId: number;
    resiver: string;
    replyMessage: any;

    constructor() {
        this.content = '';
        this.receiver = '';
        this.receiverType = 'Group';
        this.isShareable = false;
        this.isCommentable = false;
        this.isPublic = false;
        this.attachments = '-';
        this.messageTypeId = Type.normal;
        this.parentId = 0;
        this.messageId = 0;
        this.resiver = '';
        this.replyMessage = '';
    }
}
