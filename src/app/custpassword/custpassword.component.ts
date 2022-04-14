import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormBuilder,Validators } from '@angular/forms';
import { CustloginService } from '../custlogin.service';
import { PasswordValidator } from '../custlogin/password-validator';
import { Router } from '@angular/router';

@Component({
  selector: 'app-custpassword',
  templateUrl: './custpassword.component.html',
  styleUrls: ['./custpassword.component.css']
})
export class CustpasswordComponent implements OnInit {
  updatePasswordForm:FormGroup;
  successMessage:string;
  errorMessage:string;
  constructor(private fb:FormBuilder,private cls:CustloginService,private router:Router) { }

  ngOnInit() {
    if(localStorage.getItem('custemail')==undefined)
    {
      this.router.navigate(['custlogin']);
    }
    this.updatePasswordForm=this.fb.group({
      'emailId':['',[Validators.required,Validators.email]],
      'oldpassword':['',[Validators.required,PasswordValidator.passwordcheck]],
      'newpassword':['',[Validators.required,PasswordValidator.passwordcheck,Validators.minLength(8),Validators.maxLength(15)]]
    });
    this.updatePasswordForm.controls.emailId.setValue(localStorage.getItem('custemail'));
  }
  updatePwd(){
    this.successMessage=null;
    this.errorMessage=null;
    this.cls.updatePwd(this.updatePasswordForm.value)
    .then(resp=>{
      this.successMessage=resp.message;
      setTimeout(() => 
    {
        this.router.navigate(['/giftsview']);
    },
    2000);
    })
    .catch(resp=>this.errorMessage=resp.message);
  }
}
