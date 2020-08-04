import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({
  name: 'dateAgo',
  pure: true,
})
export class DateAgoPipe implements PipeTransform {
  transform(value: string) {
    const _value = Number(value);

    const dif = Math.floor((Date.now() - _value) / 1000 / 86400);
    if (dif >= 0 && dif < 30) {
      return convertToNiceDate(value);
    } else if (dif === -1) {
      value = 'Tomorrow';
      return value;
    } else {
      const datePipe = new DatePipe('en-US');
      value = datePipe.transform(value, 'EEE, MMM d');
      return value;
    }
  }
}

function convertToNiceDate(time: string) {
  const date = new Date(time);
  const diff = (new Date().getTime() - date.getTime()) / 1000;
  const daydiff = Math.floor(diff / 86400);

  if (isNaN(daydiff) || daydiff < 0 || daydiff >= 31) return '';

  return (
    (daydiff === 0 && 'Today') ||
    (daydiff === 1 && 'Yesterday') ||
    (daydiff < 7 && daydiff + ' days ago') ||
    (daydiff < 31 && Math.ceil(daydiff / 7) + ' week(s) ago')
  );
}
