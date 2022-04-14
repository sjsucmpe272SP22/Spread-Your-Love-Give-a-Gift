import { Component, OnChanges } from '@angular/core';
import { OnInit } from '@angular/core';
import { CustloginService } from './custlogin.service';
import { Router } from '@angular/router';
import { Gifts } from './Gifts';
import { SellerloginService } from './sellerlogin.service';
import { Globals } from './Globals';
import { FormGroup, Validators } from '@angular/forms';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  orderbar:boolean=false;
  errmessage:string;
  buymsg:string;
  validqty:boolean=true;
  cartForm:FormGroup;
  cartItems:any[];
  totalamt:number=0;
  constructor(
    private cls:CustloginService,
    private router:Router,private sls:SellerloginService,private fb:FormBuilder
    
  ){

  }
  ngOnInit(){
    this.getCarts();
  }
 
  getCarts(){
    if(localStorage.getItem('custemail')!=undefined){
      this.cartForm=this.fb.group({
        'qty':['',[Validators.required,Validators.min(1)]]
      })
      let obj:any={'cid':localStorage.getItem('custemail')}
      this.cls.getCartItems(obj)
      .then(resp=>{
        this.cartItems=resp;
        for(let j of this.cartItems){
          this.totalamt+=j.price;
        }
      });
    }
  }
  changeQty(obj){
    let cartobj:any=obj;
    let sendObj:any;
    sendObj={
      'pid':cartobj.pid,'cid':localStorage.getItem('custemail'),'gname':cartobj.gname,'category':cartobj.category,'price':(cartobj.price/cartobj.qty)*this.cartForm.controls.qty.value,
      'qty':this.cartForm.controls.qty.value,'path':cartobj.path
    }
    
    this.cls.addcart(sendObj)
    .then(resp=>{
      this.errmessage=resp.message;
      this.validqty=true;
      this.router.navigate(['/giftsview']);
      location.reload();
    })
    .catch(resp=>{this.errmessage=resp.message;this.validqty=false;});
  }
  placeOrder(itemList){
    console.log(itemList)
    this.cls.setItems(itemList);
    this.router.navigate(['/checkout']);
  }
  readLocalStorageValue(key) {
    
    return localStorage.getItem(key);
}
  custlogout(){
    
    this.cls.custlogout();
    this.router.navigate(['/giftsview']);
  }
  sellerlogout(){
    this.cls.sellerlogout();
    this.router.navigate(['/giftsview']);
  }
  removeCartObj(obj){
    let removeObj=obj;
    this.cls.removeCartItem(removeObj)
    .then(resp=>{this.router.navigate(['/giftsview']);location.reload();})
    .catch(resp=>console.log(resp));
  }
}
