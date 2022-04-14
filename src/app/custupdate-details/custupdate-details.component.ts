import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormBuilder,Validators } from '@angular/forms';
import { CustloginService } from '../custlogin.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-custupdate-details',
  templateUrl: './custupdate-details.component.html',
  styleUrls: ['./custupdate-details.component.css']
})
export class CustupdateDetailsComponent implements OnInit {
  successMessage:string;
  errorMessage:string;
  updateForm:FormGroup;
  constructor(private fb:FormBuilder,private cls:CustloginService,private router:Router) { }
  readLocal(key){
    return localStorage.getItem(key);
  }
  ngOnInit() {
    if(localStorage.getItem('custemail')==undefined)
    {
      this.router.navigate(['custlogin']);
    }
    this.updateForm=this.fb.group({
      'emailId':[''],
      'cname':['',[Validators.required,Validators.pattern('([a-zA-Z])+( ?[a-zA-Z]+)*'),Validators.maxLength(50)]],
      'contactNo':['',[Validators.required,Validators.pattern('[9876][0-9]{9}')]]
    })
    this.updateForm.controls.emailId.setValue(localStorage.getItem('custemail'));
    this.updateForm.controls.cname.setValue(localStorage.getItem('cname'));
    this.updateForm.controls.contactNo.setValue(localStorage.getItem('phnNo'));
  }
  custUpdate(){
    this.successMessage=null;
    this.errorMessage=null;
    this.cls.updateDetails(this.updateForm.value)
    .then(resp=>{
      this.successMessage=resp.message;
      localStorage.setItem('cname',resp.cname);
      localStorage.setItem('phnNo',resp.contactNo);
    });
    setTimeout(() => 
    {
        location.reload();
    },
    3000);
  }
}
