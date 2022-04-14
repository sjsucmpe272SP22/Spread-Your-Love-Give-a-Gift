import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CustloginService } from '../custlogin.service';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerComponent implements OnInit {
  
  orderList:any[];
  emptymsg:string;
  constructor(private router:Router,private cls:CustloginService) { }

  ngOnInit() {
    if(localStorage.getItem('custemail')==undefined)
    {
      this.router.navigate(['custlogin']);
    }
    else{
      let obj:any={'cid':localStorage.getItem('custemail')}
      this.cls.myOrders(obj)
      .then(resp=>this.orderList=resp)
      
    }
  }

}
