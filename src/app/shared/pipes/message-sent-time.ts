import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'messageSentTime'
})
export class MessageSentTime implements PipeTransform {
  transform(value: string): string {
    const date = new Date(value);
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / (1000 * 3600 * 24));

    if (diff === 0) {
      return this.formatTime(date);
    } else if (diff < 7) {
      return this.formatDayOfWeek(date);
    } else {
      return this.formatFullDate(date);
    }
  }

  private formatTime(date: Date): string {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  private formatDayOfWeek(date: Date): string {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return days[date.getDay()];
  }

  private formatFullDate(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
