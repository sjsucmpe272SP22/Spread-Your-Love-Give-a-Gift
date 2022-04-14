import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { Validators } from '@angular/forms';
import { CustregisterService } from '../custregister.service';
import { PasswordValidator } from '../custlogin/password-validator';
import { Router } from '@angular/router';
import { CustomEmailValidator } from '../Email-validator';

@Component({
  selector: 'app-custregister',
  templateUrl: './custregister.component.html',
  styleUrls: ['./custregister.component.css']
})
export class CustregisterComponent implements OnInit {
  cname:string;
  errorMessage:string;
  registrationForm:FormGroup;
 
  constructor(private fb:FormBuilder,private crs:CustregisterService,private router:Router) { }

  ngOnInit() {
    this.registrationForm=this.fb.group({
      'emailId':['',[Validators.required,CustomEmailValidator.checkemail]],
      'cname':['',[Validators.required,Validators.pattern('([a-zA-Z])+( ?[a-zA-Z]+)*'),Validators.maxLength(50)]],
      'password':['',[Validators.required,PasswordValidator.passwordcheck,Validators.minLength(8),Validators.maxLength(15)]],
      'cnfpassword':['',Validators.required],
      'contactNo':['',[Validators.required,Validators.pattern('[9876][0-9]{9}')]],
      'addressEntity':this.fb.group({
        'doorNo':['',[Validators.required,Validators.pattern('[\\d-/]+'),Validators.maxLength(15)]],
        'street':['',[Validators.required,Validators.pattern('([a-zA-Z])+( ?[a-zA-Z]+)*'),Validators.maxLength(50)]],
        'city':['',[Validators.required,Validators.pattern('([a-zA-Z])+( ?[a-zA-Z]+)*'),Validators.maxLength(50)]],
        'pincode':['',[Validators.required,Validators.pattern('[0-9]{6}')]]
      })
    });
  }
  correct(){
    if(this.registrationForm.controls.password.value!='' && this.registrationForm.controls.cnfpassword.value!='') return true;
    else return false;
  }
  custRegister(){
    
    this.cname=null;
    this.errorMessage=null;
    this.crs.custregister(this.registrationForm.value)
    .then(resp=>
      this.cname=resp.message
    )
    .catch(resp=>this.errorMessage=resp.message);
    this.registrationForm.reset();
  }
}
