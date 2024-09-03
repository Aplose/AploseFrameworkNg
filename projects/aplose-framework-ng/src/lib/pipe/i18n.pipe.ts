import { Pipe, PipeTransform, inject } from '@angular/core';
import { I18nService } from '../service/i18n.service';

@Pipe({
  name: 'i18n',
  standalone: true
})
export class I18nPipe implements PipeTransform {
  private i18nService:I18nService=inject(I18nService);

  transform(translationKey: string, ...args: unknown[]): unknown {
//    this.i18nService.getT
    return null;
  }

}
