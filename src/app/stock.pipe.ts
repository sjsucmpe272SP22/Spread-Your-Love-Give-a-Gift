import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'stock'
})
export class StockPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if(value<=5 && value>=1) return 'Hurry up! Only '+value+' left.';
    else if(value<=0) return "Out of stock.";
    else return value;
  }

}
