import { Component, OnInit } from '@angular/core';
import { Input } from '@angular/core';
import { Gifts } from '../Gifts';
import { FormGroup } from '@angular/forms';
import { FormBuilder,Validators } from '@angular/forms';
import { OnChanges, SimpleChanges } from '@angular/core';
import { SellerloginService } from '../sellerlogin.service';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-modify-product',
  templateUrl: './modify-product.component.html',
  styleUrls: ['./modify-product.component.css']
})
export class ModifyProductComponent implements OnInit,OnChanges {
  @Input()
  Gift:Gifts;
  successMessage:string;
  errorMessage:string;
  modForm:FormGroup;
  constructor(private fb:FormBuilder,private sls:SellerloginService,private router:Router,private location:Location) { }

  ngOnInit() {
   
  } 
  ngOnChanges(){
    this.modForm=this.fb.group({
      'pid':[''],
      'gname':['',[Validators.required,Validators.pattern('([a-zA-Z])+( ?[a-zA-Z]+)*')]],
      'category':['',Validators.required],
      'price':['',[Validators.required,Validators.pattern('[0-9]{1,4}'),Validators.min(1)]],
      'qty':['',[Validators.required,Validators.pattern('[0-9]{1,3}'),Validators.min(1)]]
    })
    if(this.Gift!=undefined){
      this.modForm.controls.pid.setValue(this.Gift.pid);
      this.modForm.controls.gname.setValue(this.Gift.gname);
      this.modForm.controls.category.setValue(this.Gift.category);
      this.modForm.controls.price.setValue(this.Gift.price);
      this.modForm.controls.qty.setValue(this.Gift.qty);
    }
  }
  updateProduct(){
    this.successMessage=null;
    this.errorMessage=null;
    this.sls.updateProduct(this.modForm.value)
    .then(resp=>{
      this.successMessage=resp.message;
      location.reload();
    }
    )
    .catch(resp=>this.errorMessage=resp.message);
  }
  refresh(){
    location.reload();
  }
}
