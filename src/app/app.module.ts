import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { CustloginComponent } from './custlogin/custlogin.component';
import {ReactiveFormsModule,FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import { CustloginService } from './custlogin.service';
import { CustregisterComponent } from './custregister/custregister.component';
import { CustregisterService } from './custregister.service';
import { SellerloginComponent } from './sellerlogin/sellerlogin.component';
import { SellerloginService } from './sellerlogin.service';
import { CustregisterPipe } from './custregister.pipe';
import { GiftsviewComponent } from './giftsview/giftsview.component';
import { CustupdateDetailsComponent } from './custupdate-details/custupdate-details.component';
import { CustpasswordComponent } from './custpassword/custpassword.component';
import { SellpasswordComponent } from './sellpassword/sellpassword.component';
import { AddProductComponent } from './add-product/add-product.component';
import { SellerComponent } from './seller/seller.component';
import { ModifyProductComponent } from './modify-product/modify-product.component';
import { Globals } from './Globals';
import { CustomerComponent } from './customer/customer.component';
import { CustProfileComponent } from './cust-profile/cust-profile.component';
import {  HttpClientModule } from '@angular/common/http';
import { StockPipe } from './stock.pipe';
import { SellersalesComponent } from './sellersales/sellersales.component';
import { CheckoutComponent } from './checkout/checkout.component';
@NgModule({
  declarations: [
    AppComponent,
    CustloginComponent,
    CustregisterComponent,
    SellerloginComponent,
    CustregisterPipe,
    GiftsviewComponent,
    CustupdateDetailsComponent,
    CustpasswordComponent,
    SellpasswordComponent,
    AddProductComponent,
    SellerComponent,
    ModifyProductComponent,
    CustomerComponent,
    CustProfileComponent,
    StockPipe,
    SellersalesComponent,
    CheckoutComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpModule,
    HttpClientModule
  ],
  providers: [CustloginService,CustregisterService,SellerloginService,Globals],
  bootstrap: [AppComponent]
})
export class AppModule { }
