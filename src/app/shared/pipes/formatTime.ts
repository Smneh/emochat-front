import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'formatTime'
})
export class FormatTimePipe implements PipeTransform {
  transform(value: string): unknown {
    const formattedTime = this.formatTimeString(value);
    return formattedTime;
  }

  private formatTimeString(timeString: string): string {
    const date = new Date(timeString);
    const hours = this.padNumber(date.getHours(), 2);
    const minutes = this.padNumber(date.getMinutes(), 2);
    return `${hours}:${minutes}`;
  }

  private padNumber(num: number, length: number): string {
    return num.toString().padStart(length, '0');
  }
}
