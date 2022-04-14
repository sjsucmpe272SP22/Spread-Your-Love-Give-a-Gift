import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { Validators } from '@angular/forms';
import { SellerloginService } from '../sellerlogin.service';
import { Router } from '@angular/router';
import { PasswordValidator } from '../custlogin/password-validator';
import { Globals } from '../Globals';
import { CustomEmailValidator } from '../Email-validator';

@Component({
  selector: 'app-sellerlogin',
  templateUrl: './sellerlogin.component.html',
  styleUrls: ['./sellerlogin.component.css']
})
export class SellerloginComponent implements OnInit {
  successMessage:string;
  errorMessage:string;
  show:boolean=false;
  loginForm:FormGroup;
  constructor(private fb:FormBuilder,private sls:SellerloginService,private router:Router,private globals:Globals) { }

  ngOnInit() {
    if(localStorage.getItem('smail')!=undefined)
    {
      this.router.navigate(['seller']);
    }
    this.loginForm=this.fb.group({
      'emailId':['',[Validators.required,CustomEmailValidator.checkemail]],
      'password':['',[Validators.required,PasswordValidator.passwordcheck,Validators.minLength(8),Validators.maxLength(15)]]
    })
  }
  showPassword(){
    this.show=!this.show;
  }
  sellerlogin(){
    this.successMessage=null;
    this.errorMessage=null;
    return this.sls.login(this.loginForm.value)
    .then(resp=>{
      this.successMessage=resp.message;
      localStorage.setItem('smail',resp.emailId);
      this.router.navigate(['/seller']);
    }
    )
    .catch(resp=>this.errorMessage=resp.message);
  }
  
}
