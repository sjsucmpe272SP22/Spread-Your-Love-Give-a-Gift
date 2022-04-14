import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { Validators } from '@angular/forms';
import { CustloginService } from '../custlogin.service';
import { Router } from '@angular/router';
import { PasswordValidator } from './password-validator';
import { Globals } from '../Globals';
import { CustomEmailValidator } from '../Email-validator';

@Component({
  selector: 'app-custlogin',
  templateUrl: './custlogin.component.html',
  styleUrls: ['./custlogin.component.css']
})
export class CustloginComponent implements OnInit {
  
  successMessage:string;
  errorMessage:string;
  show:boolean=false;
  loginForm:FormGroup;
  
  constructor(private fb:FormBuilder,private cls:CustloginService,private router:Router,private globals:Globals) { }

  ngOnInit() {
    if(localStorage.getItem('custemail')!=undefined)
    {
      this.router.navigate(['customer']);
    }
    this.loginForm=this.fb.group({
      'emailId':['',[Validators.required,CustomEmailValidator.checkemail]],
      'password':['',[Validators.required,PasswordValidator.passwordcheck,Validators.minLength(8),Validators.maxLength(15)]]
    });
  }
  showPassword(){
    this.show=!this.show;
  }
  custlogin(){
    this.successMessage=null;
    this.errorMessage=null;
    this.cls.login(this.loginForm.value)
    .then(resp=>{
      localStorage.setItem('custemail',resp.emailId);
      localStorage.setItem('cname',resp.cname);
      localStorage.setItem('phnNo',resp.contactNo);
      this.router.navigateByUrl('/giftsview', {skipLocationChange: false}).then(()=>
        location.reload()); 
    })
    .catch(resp=>this.errorMessage=resp.message);
  }
}
