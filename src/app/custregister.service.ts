import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

@Injectable()
export class CustregisterService {

  constructor(private http:Http) { }
  custregister(data){
    return this.http.post('http://localhost:3333/EKUGiftsEmporium/login/addCustomer',data)
    .toPromise()
    .then(resp=>resp.json())
    .catch(this.handleError)
  }
  handleError(error){
    return Promise.reject(error.json() || error);
  }
}

