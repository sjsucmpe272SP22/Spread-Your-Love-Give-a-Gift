import { Component, OnInit } from '@angular/core';
import { SellerloginService } from '../sellerlogin.service';

import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { ViewChild } from '@angular/core';
import { ElementRef } from '@angular/core';
import { Gifts } from '../Gifts';

@Component({
  selector: 'app-seller',
  templateUrl: './seller.component.html',
  styleUrls: ['./seller.component.css']
})
export class SellerComponent implements OnInit {
  
  errorMessage:string;
  gifts:Gifts[];
  selectedGift:Gifts;
  deleteGift:Gifts;
  responseMessage:string;
  constructor(private sls:SellerloginService,private router:Router,private location:Location) { }

  ngOnInit() {
    if(localStorage.getItem('smail')==undefined)
    {
      this.router.navigate(['sellerlogin']);
    }
    else {
      
      this.showProducts();
    }
    
    
  }
  showProducts(){
    
    this.sls.viewProducts()
    .then(resp=>{
      this.gifts=resp;
      
    })
    .catch(resp=>this.errorMessage=resp);
  }
  selObj(obj){
    this.selectedGift=obj;
    window.scrollTo(0,document.body.scrollHeight);
    window.scrollTo(0,document.body.scrollHeight);
    
  }
  delObj(obj){
    this.responseMessage=null;
    this.deleteGift=obj;
    this.sls.removeProduct(this.deleteGift)
    .then(resp=>{
      this.responseMessage=resp.message;
      
      setTimeout(() => 
      {
          location.reload();
      },
      1500);
      })
    .catch(resp=>this.responseMessage=resp.message);
  }
}
