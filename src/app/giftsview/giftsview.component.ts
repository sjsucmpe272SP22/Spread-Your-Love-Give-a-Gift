import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { Http } from '@angular/http';
import { Gifts } from '../Gifts';

import { SellerloginService } from '../sellerlogin.service';
import { CustloginService } from '../custlogin.service';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-giftsview',
  templateUrl: './giftsview.component.html',
  styleUrls: ['./giftsview.component.css']
})
export class GiftsviewComponent implements OnInit {
  showbar:boolean=true;
  gifts:Gifts[];
  selectObj:Gifts;
  login:boolean=false;
  fileform:FormGroup;
  selectedFile:File;
  loginMessage:string;
  addCart:FormGroup;
  message:string;
  constructor(private sls:SellerloginService,private http:Http,private fb:FormBuilder,
    private cls:CustloginService,private loc:Location,private router:Router) { }

  ngOnInit() {
    this.addCart=this.fb.group({
      'qty':[1,Validators.required]
    });
    this.fileform=this.fb.group({
      'id':['']
    })
    this.sls.viewProducts()
    .then(resp=>{
      this.gifts=resp;
      this.showbar=false;
    })
    .catch(resp=>{
      console.log(resp);this.showbar=false;});
  }
  selObj(obj){
    this.selectObj=obj;
    
    if(localStorage.getItem('custemail')==undefined){
      this.login=true;
      this.loginMessage="You are not signed in";
    }
  }
  readLocalStorageValue(key) {
    
    return localStorage.getItem(key);
  }
  checkQty(){
    
    if(this.addCart.controls.qty.value<=this.selectObj.qty && this.addCart.controls.qty.value>=1){
      return true;
    }
    else return false;
  }
  addcart(){
    let cartobj:any=this.selectObj;
    let sendObj:any;
    sendObj={
      'pid':cartobj.pid,'cid':localStorage.getItem('custemail'),'gname':cartobj.gname,'category':cartobj.category,'price':cartobj.price*this.addCart.controls.qty.value,
      'qty':this.addCart.controls.qty.value,'path':cartobj.path
    }
    
    this.cls.addcart(sendObj)
    .then(resp=>{
      this.message=resp.message;
      location.reload();
    })
    .catch(resp=>this.message=resp.message);
  }
 
  onFileSelected(event){
    this.selectedFile=<File>event.target.files[0];
  }
  upload(){
    const fd=new FormData();
    fd.append('file',this.selectedFile)
    fd.append('id',this.fileform.controls.id.value);
    this.cls.upload(fd)
    .then(resp=>console.log(resp.message))
    .catch(resp=>console.log(resp))
  }
  buyNow(obj){
    obj.qty=this.addCart.controls.qty.value;
    obj.price=this.addCart.controls.qty.value*obj.price;
    obj.cid=localStorage.getItem('custemail');
    let itemList:any[]=[obj];
    
    this.cls.setItems(itemList);
    this.router.navigate(['/checkout']);
  }
}
