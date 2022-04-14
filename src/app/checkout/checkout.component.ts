import { Component, OnInit } from '@angular/core';
import { CustloginService } from '../custlogin.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  itemList:any[];
  checkoutForm:FormGroup;
  placebar:boolean=false;
  sum:number=0;
  codSelected:boolean=false;
  cardSelected:boolean=false;
  addressList:any[];
  codv="cod";
  cardv="card";
  selectedAddObj:any;
  showBillAdd:boolean=true;
  placed:string;
  errmsg:string;
  constructor(private cls:CustloginService,private fb:FormBuilder,private router:Router) { }

  ngOnInit() {
    
    
    this.itemList=this.cls.getItems();
    
    if(this.itemList!=undefined){
    for(let j of this.itemList){
      this.sum+=j.price;
    }}
    this.checkoutForm=this.fb.group({
      'cardnumber':['',[Validators.required,Validators.pattern('[0-9]{16}')]],
      'cid':[localStorage.getItem('custemail')],
      'cvv':['',[Validators.required,Validators.pattern('[0-9]{3}')]],
      'month':['',[Validators.required]],
      'year':['',Validators.required],
      'balance':['']
    });
    
    let obj:any={'emailId':localStorage.getItem('custemail')}
    this.cls.getAllAddresses(obj)
    .then(resp=>{this.addressList=resp;});
    
  }
  selPymt(mode:string){
    
   if(mode=='cod'){
     this.codSelected=true;
     this.cardSelected=false;
   }
   else if(mode=='card'){
     this.cardSelected=true;
     this.codSelected=false;
   }
  }
  selectadd(add){
    this.selectedAddObj=add;
    this.showBillAdd=false; 
  }
  buy(obj){
    this.placebar=true;
    this.checkoutForm.controls.balance.setValue(this.sum);
    let sendobj:any={'address':this.selectedAddObj,'custcarts':this.itemList,'card':this.checkoutForm.value};
    
    this.cls.buyItems(sendobj)
    .then(resp=>{
      this.placed=resp.message;
      this.placebar=false;setTimeout(() => 
      {
        
        this.router.navigateByUrl('/giftsview', {skipLocationChange: false}).then(()=>
        location.reload()); 
      },
      2000);
      
      
    })
    .catch(resp=>{this.errmsg=resp.message;this.placebar=false;});
  }
  buyCod(){
    let sendobj:any={'address':this.selectedAddObj,'custcarts':this.itemList};
    console.log(sendobj)
    this.cls.buyItemsByCOD(sendobj)
    .then(resp=>{this.placed=resp.message;
      this.placebar=false;setTimeout(() => 
      {
        
        this.router.navigateByUrl('/giftsview', {skipLocationChange: false}).then(()=>
        location.reload()); 
      },
      2000);})
      .catch(resp=>{this.errmsg=resp.message;this.placebar=false;});
  }
}
