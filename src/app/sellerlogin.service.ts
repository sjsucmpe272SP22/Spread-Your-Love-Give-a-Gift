import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Gifts } from './Gifts';


@Injectable()
export class SellerloginService {

  constructor(private http:Http) { }
  login(data):Promise<any>{
    
    return this.http.post('http://localhost:3333/EKUGiftsEmporium/login/sellerlogin',data)
    .toPromise()
    .then(resp=>resp.json())
    .catch(this.handleError);
  }
  addProduct(data):Promise<any>{
    return this.http.post('http://localhost:3333/EKUGiftsEmporium/login/addProduct',data)
    .toPromise()
    .then(resp=>resp.json())
    .catch(this.handleError);
  }
  viewProducts():Promise<Gifts[]>{
    return this.http.get('http://localhost:3333/EKUGiftsEmporium/login/viewgifts')
    .toPromise()
    .then(resp=>resp.json())
    .catch(this.handleError);
  }
  updateProduct(data){
    return this.http.post('http://localhost:3333/EKUGiftsEmporium/login/updateGift',data)
    .toPromise()
    .then(resp=>resp.json())
    .catch(this.handleError);
  }
  removeProduct(data){
    return this.http.post('http://localhost:3333/EKUGiftsEmporium/login/removeGift',data)
    .toPromise()
    .then(resp=>resp.json())
    .catch(this.handleError);
  }
  getSales(){
    return this.http.get('http://localhost:3333/EKUGiftsEmporium/login/mySales')
    .toPromise()
    .then(resp=>resp.json() as any[])
    .catch(this.handleError);
  }
  changeStatus(data){
    return this.http.post('http://localhost:3333/EKUGiftsEmporium/login/changeStatus',data)
    .toPromise()
    .then(resp=>resp.json())
    .catch(this.handleError);
  }
  handleError(error){
    
    return Promise.reject(error.json() || error);
  }
}
