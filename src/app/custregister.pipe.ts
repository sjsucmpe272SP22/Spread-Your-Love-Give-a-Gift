import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'custregister'
})
export class CustregisterPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    return 'Successfully registered with username: '+value;
  }

}
