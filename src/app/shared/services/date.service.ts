import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DateService {

  formatMonthAndDay(dateString: string): string {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth(); // 0-indexed

    if (!isNaN(day) && !isNaN(month) && month >= 0 && month < 12) {
      const monthName = months[month];
      return `${day} ${monthName}`;
    } else {
      return 'Invalid date string';
    }
  }

  div(a: number, b: number) {
    let div = ((a / b));
    return parseInt(div + "")
  }

}
