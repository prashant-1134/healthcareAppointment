import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeFormat',
  standalone: true
})

export class TimeFormatPipe implements PipeTransform {
  transform(time: string): string {
    if (!time) return ''; // Handle null or undefined case

    const match = time.match(/(\d+):(\d+) (\w+)/);
    if (!match) return time; // Return as is if format is incorrect

    let [hour, minute, period] = match.slice(1);
    let hours = parseInt(hour, 10);

    if (period.toLowerCase() === 'pm' && hours !== 12) {
      hours += 12;
    }
    if (period.toLowerCase() === 'am' && hours === 12) {
      hours = 0;
    }

    return `${hours.toString().padStart(2, '0')}:${minute}:00`; // Format HH:mm:ss
  }
}
