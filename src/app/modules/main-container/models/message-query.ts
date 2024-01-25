export class MessageQuery {
    groupId: string;
    messageId: number;
    count: number;
    dir: string;
    self: boolean;
    constructor() {
        this.groupId = '';
        this.messageId = 0;
        this.count = 25;
        this.dir = 'UP' || 'DOWN';
        this.self = false;
    }
}
