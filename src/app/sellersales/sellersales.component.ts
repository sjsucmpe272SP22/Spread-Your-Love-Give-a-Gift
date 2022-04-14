import { Component, OnInit } from '@angular/core';
import { SellerloginService } from '../sellerlogin.service';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-sellersales',
  templateUrl: './sellersales.component.html',
  styleUrls: ['./sellersales.component.css']
})
export class SellersalesComponent implements OnInit {
  statusform:FormGroup;
  emptymsg:string;
  sales:any[];
  totalamt:number=0;
  response:string
  constructor(private sls:SellerloginService,private router:Router,private fb:FormBuilder) { }

  ngOnInit() {
    if(localStorage.getItem('smail')==undefined){
      this.router.navigate(['sellerlogin']);
    }
    else{
      this.statusform=this.fb.group({
        'stat':['',Validators.required]
      })
      this.sls.getSales()
      .then(resp=>{
        this.sales=resp;
        for(let j of this.sales){
          this.totalamt+=j.cost;
        }
      })
      .catch(resp=>this.emptymsg="No items are sold yet...")
      ;
    }
  }
  changeOrderStatus(obj){
    obj.ordrstatus=this.statusform.controls.stat.value;
    this.sls.changeStatus(obj)
    .then(resp=>{this.response=resp.message;
      setTimeout(() => 
      {
          location.reload();
      },
      3000);
    })
    .catch(resp=>this.response=resp.message)
  }
}
