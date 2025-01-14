import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'maskCard',
  standalone: true
})
export class MaskCardPipe implements PipeTransform {
  transform(
    value: string,
    visibleChars: number = 4,
    maskChar: string = '•'
  ): string {
    if (!value) {
      return '';
    }

    const length = value.length;
    if (length <= visibleChars) {
      return value.replace(/./g, maskChar);
    }

    const maskedSection = value.slice(0, -visibleChars).replace(/./g, maskChar);
    const visibleSection = value.slice(-visibleChars);

    return maskedSection + visibleSection;
  }
}
