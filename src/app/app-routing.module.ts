import {Router,RouterModule} from '@angular/router';
import { Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { CustloginComponent } from './custlogin/custlogin.component';
import { CustregisterComponent } from './custregister/custregister.component';
import { SellerloginComponent } from './sellerlogin/sellerlogin.component';
import { GiftsviewComponent } from './giftsview/giftsview.component';
import { CustupdateDetailsComponent } from './custupdate-details/custupdate-details.component';
import { CustpasswordComponent } from './custpassword/custpassword.component';
import { SellpasswordComponent } from './sellpassword/sellpassword.component';
import { AddProductComponent } from './add-product/add-product.component';
import { SellerComponent } from './seller/seller.component';
import { CustomerComponent } from './customer/customer.component';
import { CustProfileComponent } from './cust-profile/cust-profile.component';

import { SellersalesComponent } from './sellersales/sellersales.component';
import { CheckoutComponent } from './checkout/checkout.component';
const routes:Routes=[
    {path:'custlogin',component:CustloginComponent},
    {path:'custregister',component:CustregisterComponent},
    {path:'sellerlogin',component:SellerloginComponent},
    {path:'giftsview',component:GiftsviewComponent},
    {path:'updateCustomer',component:CustupdateDetailsComponent},
    {path:'updatePassword',component:CustpasswordComponent},
    {path:'sellPassword',component:SellpasswordComponent},
    {path:'seller',component:SellerComponent},
    {path:'sellersales',component:SellersalesComponent},
    {path:'customer',component:CustomerComponent},
    {path:'addProduct',component:AddProductComponent},
    {path:'custProfile',component:CustProfileComponent},
    {path:'checkout',component:CheckoutComponent},
    { path: '',
    redirectTo: '/giftsview',
    pathMatch: 'full'
  }
]
@NgModule(
    {
        imports:[RouterModule.forRoot(routes)],
        exports:[RouterModule]
    }
)
export class AppRoutingModule{

}