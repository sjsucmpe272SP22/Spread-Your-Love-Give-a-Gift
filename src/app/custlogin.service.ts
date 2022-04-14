import { Injectable } from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { Address } from './Address';
@Injectable()
export class CustloginService {
  items:any[];
  constructor(private http:Http) { }
  setItems(itemlist){
    this.items=itemlist;
  }
  getItems(){
    return this.items;
  }
  getCartItems(data):Promise<any[]>{
    return this.http.post('http://localhost:3333/EKUGiftsEmporium/login/getCartItems',data)
    .toPromise()
    .then(resp=>resp.json() as any[])
    .catch(this.handleError);
  }
  removeCartItem(data){
    return this.http.post('http://localhost:3333/EKUGiftsEmporium/login/removeCartItem',data)
    .toPromise()
    .then(resp=>resp.json())
    .catch(this.handleError);
  }
  buyItems(data){
    console.log(data);
    return this.http.post('http://localhost:3333/EKUGiftsEmporium/login/buyItems',data)
    .toPromise()
    .then(resp=>resp.json())
    .catch(this.handleError);
  }
  buyItemsByCOD(data){
    
    return this.http.post('http://localhost:3333/EKUGiftsEmporium/login/buyItemsByCOD',data)
    .toPromise()
    .then(resp=>resp.json())
    .catch(this.handleError);
  }
  myOrders(data){
    return this.http.post('http://localhost:3333/EKUGiftsEmporium/login/myOrders',data)
    .toPromise()
    .then(resp=>resp.json() as any[])
    .catch(this.handleError);
  }
  login(data):Promise<any>{
    
    return this.http.post('http://localhost:3333/EKUGiftsEmporium/login/custlogin',data)
    .toPromise()
    .then(resp=>resp.json())
    .catch(this.handleError);
  }
  getAllAddresses(data):Promise<Address[]>{
    return this.http.post('http://localhost:3333/EKUGiftsEmporium/login/getCustAddress',data)
    .toPromise()
    .then(resp=>resp.json() as Address[])
    .catch(this.handleError);
  }
  delAddress(data){
    return this.http.post('http://localhost:3333/EKUGiftsEmporium/login/delCustAddress',data)
    .toPromise()
    .then(resp=>resp.json())
    .catch(this.handleError);
  }
  updateAddress(data){
    return this.http.post('http://localhost:3333/EKUGiftsEmporium/login/updateCustAddress',data)
    .toPromise()
    .then(resp=>resp.json())
    .catch(this.handleError);
  }
  custlogout(){
    
    localStorage.removeItem('custemail');
    localStorage.removeItem('cname');
    localStorage.removeItem('cart');
    localStorage.removeItem('phnNo');
    
  }
  upload(data){
    return this.http.post('http://localhost:3333/EKUGiftsEmporium/login/fileget',data)
    .toPromise()
    .then(resp=>resp.json())
    .catch(this.handleError);
  }
  sellerlogout(){
    
    localStorage.removeItem('smail');
  }
  addAddresses(data){
    return this.http.post('http://localhost:3333/EKUGiftsEmporium/login/addCustAddress',data)
    .toPromise()
    .then(resp=>resp.json())
    .catch(this.handleError);
  }
  addcart(data){
    return this.http.post('http://localhost:3333/EKUGiftsEmporium/login/addCustGift',data)
    .toPromise()
    .then(resp=>resp.json())
    .catch(this.handleError);
  }
  updateDetails(data){
    return this.http.post('http://localhost:3333/EKUGiftsEmporium/login/updateCustomer',data)
    .toPromise()
    .then(resp=>resp.json())
    .catch(this.handleError);
  }
  updatePwd(data){
    return this.http.post('http://localhost:3333/EKUGiftsEmporium/login/updatePassword',data)
    .toPromise()
    .then(resp=>resp.json())
    .catch(this.handleError);
  }
  sellPwd(data){
    return this.http.post('http://localhost:3333/EKUGiftsEmporium/login/sellPassword',data)
    .toPromise()
    .then(resp=>resp.json())
    .catch(this.handleError);
  }
  handleError(error){
    console.log(error);
    return Promise.reject(error.json() || error);
  }
}
