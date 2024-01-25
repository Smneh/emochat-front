import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'timeDifference',
})
export class TimeDifferencePipe implements PipeTransform {
  transform(value: string): string {
    const lastActionTime = new Date(value);
    const currentTime = new Date();

    // Check if the date is today
    if (
      lastActionTime.getDate() === currentTime.getDate() &&
      lastActionTime.getMonth() === currentTime.getMonth() &&
      lastActionTime.getFullYear() === currentTime.getFullYear()
    ) {
      return `Last seen ${this.formatTime(lastActionTime)}`;
    } else {
      // Check if the date is yesterday
      const yesterday = new Date(currentTime);
      yesterday.setDate(currentTime.getDate() - 1);

      if (
        lastActionTime.getDate() === yesterday.getDate() &&
        lastActionTime.getMonth() === yesterday.getMonth() &&
        lastActionTime.getFullYear() === yesterday.getFullYear()
      ) {
        return `Last seen yesterday ${this.formatTime(lastActionTime)}`;
      } else {
        // For dates before today and yesterday
        return `Last seen ${this.formatDate(lastActionTime)} at ${this.formatTime(lastActionTime)}`;
      }
    }
  }

  private formatTime(date: Date): string {
    return `${this.padZero(date.getHours())}:${this.padZero(date.getMinutes())}`;
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = this.padZero(date.getMonth() + 1);
    const day = this.padZero(date.getDate());
    return `${year}-${month}-${day}`;
  }

  private padZero(value: number): string {
    return value < 10 ? `0${value}` : `${value}`;
  }
}
