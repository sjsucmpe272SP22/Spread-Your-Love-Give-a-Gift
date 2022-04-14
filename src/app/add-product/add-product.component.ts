import { Component, OnInit } from '@angular/core';
import { FormGroup,FormBuilder,Validators } from '@angular/forms';
import { SellerloginService } from '../sellerlogin.service';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent implements OnInit {
  
  successMessage:string;
  errorMessage:string;
  addForm:FormGroup;
  selectedFile:File;
  constructor(private fb:FormBuilder,private sls:SellerloginService,private router:Router,private location:Location) { }

  ngOnInit() {
    if(localStorage.getItem('smail')==undefined)
    {
      this.router.navigate(['sellerlogin']);
    }
    this.addForm=this.fb.group({
      'gname':['',[Validators.required,Validators.pattern('([a-zA-Z])+( ?[a-zA-Z]+)*')]],
      'category':['',Validators.required],
      'price':['',[Validators.required,Validators.pattern('[0-9]{1,4}'),Validators.min(1)]],
      'qty':['',[Validators.required,Validators.pattern('[0-9]{1,3}'),Validators.min(1)]]
    })
  } 
  onFileSelected(event){
    this.selectedFile=<File>event.target.files[0];
  }
  addProduct(){
    this.successMessage=null;
    const fd=new FormData();
    fd.append('file',this.selectedFile);
    fd.append('gname',this.addForm.controls.gname.value);
    fd.append('category',this.addForm.controls.category.value);
    fd.append('price',this.addForm.controls.price.value);
    fd.append('qty',this.addForm.controls.qty.value);
    this.sls.addProduct(fd)
    .then(resp=>{
      this.successMessage=resp.message;
      setTimeout(() => 
    {
        this.router.navigate(['/seller']);
    },
    3000);
    })
    .catch(resp=>this.errorMessage=resp.message);
    
  }
  goBack(){
    this.location.back();
  }
}
