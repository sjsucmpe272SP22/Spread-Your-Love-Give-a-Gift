import { Component, OnInit } from '@angular/core';
import { FormGroup,FormBuilder,Validators } from '@angular/forms';
import { CustloginService } from '../custlogin.service';
import { Router } from '@angular/router';
import { PasswordValidator } from '../custlogin/password-validator';

@Component({
  selector: 'app-sellpassword',
  templateUrl: './sellpassword.component.html',
  styleUrls: ['./sellpassword.component.css']
})
export class SellpasswordComponent implements OnInit {

  updatePasswordForm:FormGroup;
  successMessage:string;
  errorMessage:string;
  constructor(private fb:FormBuilder,private cls:CustloginService,private router:Router) { }

  ngOnInit() {
    if(localStorage.getItem('smail')==undefined)
    {
      this.router.navigate(['sellerlogin']);
    }
    this.updatePasswordForm=this.fb.group({
      'emailId':['',],
      'oldpassword':['',[Validators.required,Validators.minLength(6),Validators.maxLength(15)]],
      'newpassword':['',[Validators.required,Validators.minLength(6),Validators.minLength(8),Validators.maxLength(15),PasswordValidator.passwordcheck]]
    });
    this.updatePasswordForm.controls.emailId.setValue(localStorage.getItem('smail'));
  }
  updatePwd(){
    this.successMessage=null;
    this.errorMessage=null;
    this.cls.sellPwd(this.updatePasswordForm.value)
    .then(resp=>{
      this.successMessage=resp.message;
      setTimeout(() => 
    {
        this.router.navigate(['/giftsview']);
    },
    3000);
    })
    .catch(resp=>this.errorMessage=resp.message);
  }
}
