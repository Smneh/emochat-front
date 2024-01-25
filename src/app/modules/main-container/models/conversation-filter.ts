export class ConversationFilter {
  startRow: number;
  rowCount: number;
  searchText: string;
  type: string;

  constructor() {
    this.type = 'All';
    this.startRow = 0;
    this.rowCount = 15;
    this.searchText = '';
  }
}
