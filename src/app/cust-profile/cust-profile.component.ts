import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Address } from '../Address';
import { CustloginService } from '../custlogin.service';

import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Customer } from '../customer';
import { Location } from '@angular/common';






@Component({
  selector: 'app-cust-profile',
  templateUrl: './cust-profile.component.html',
  styleUrls: ['./cust-profile.component.css']
})
export class CustProfileComponent implements OnInit {
  empty:string;
  res:string;
  delMessage:string;
  updateMessage:string;
  noOfaddress:number;
  addList:Address[];
  addForm:FormGroup;
  addressEntity:Address;
  emailId:string=localStorage.getItem('custemail');
  delForm:FormGroup;
  updateForm:FormGroup;
  delObj:any;
  updateObj:any;
  custObj:Customer={'emailId':localStorage.getItem('custemail'),'cname':null,'password':null,'contactNo':null,'message':null}
  constructor(private router:Router,private cls:CustloginService,private fb:FormBuilder,private location:Location) { }
  selectObj(obj){
    this.updateObj=obj;
    this.updateForm.get('addressEntity').setValue(this.updateObj);
  }
  ngOnInit() {
    if(localStorage.getItem('custemail')==undefined)
    this.router.navigate(['/custlogin']);
    this.getAddresses();
    this.addForm=this.fb.group({
       'emailId':[''],
        'addressEntity':this.fb.group({
        'doorNo':['',[Validators.required,Validators.pattern('[\\d-/]+'),Validators.maxLength(15)]],
        'street':['',[Validators.required,Validators.pattern('([a-zA-Z])+( ?[a-zA-Z]+)*'),Validators.maxLength(50)]],
        'city':['',[Validators.required,Validators.pattern('([a-zA-Z])+( ?[a-zA-Z]+)*'),Validators.maxLength(50)]],
        'pincode':['',[Validators.required,Validators.pattern('[0-9]{6}')]]
      })
    });
    this.addForm.controls.emailId.setValue(localStorage.getItem('custemail'));
    this.updateForm=this.fb.group({
      'emailId':[''],
        'addressEntity':this.fb.group({
          'aid':[''],
        'doorNo':['',[Validators.required,Validators.pattern('[\\d-/]+'),Validators.maxLength(15)]],
        'street':['',[Validators.required,Validators.pattern('([a-zA-Z])+( ?[a-zA-Z]+)*'),Validators.maxLength(50)]],
        'city':['',[Validators.required,Validators.pattern('([a-zA-Z])+( ?[a-zA-Z]+)*'),Validators.maxLength(50)]],
        'pincode':['',[Validators.required,Validators.pattern('[0-9]{6}')]],
        'message':['']
    })
  });
  this.updateForm.controls.emailId.setValue(localStorage.getItem('custemail'));
  }
  getAddresses(){
    this.cls.getAllAddresses(this.custObj)
    .then(resp=>{
      this.addList=resp;
      this.noOfaddress=this.addList.length;
    })
    .catch(resp=>{
      this.empty="No addresses found";
      this.noOfaddress=0;
    });
  }
  addAddress(){
    this.res=null;
    this.cls.addAddresses(this.addForm.value)
    .then(resp=>this.res=resp.message)
    .catch(resp=>this.res=resp.message);
    this.addForm.reset();
    location.reload();
  }
  delObject(obj){
    this.delMessage=null;
    this.addressEntity=obj;
    this.delObj={'emailId':this.emailId,
    'addressEntity':{'aid':this.addressEntity.aid}};
    this.cls.delAddress(this.delObj)
    .then(resp=>{
      this.delMessage=resp.message;
      location.reload();
    })
    .catch(resp=>{
      this.delMessage=resp.message;
    });
  }
  
  updateAddress(obj){
    this.cls.updateAddress(this.updateForm.value)
    .then(resp=>{
      this.updateMessage=resp.message;
      location.reload();
    })
    .catch(resp=>
      this.updateAddress=resp.message
    );
  }
}
