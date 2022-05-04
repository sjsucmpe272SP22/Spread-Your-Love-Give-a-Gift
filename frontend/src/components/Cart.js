 import React,{useState, useEffect} from 'react';
import CartItem from './CartItem';
import {useNavigate} from "react-router-dom";
import {axiosInstance as authapi} from '../services/authpost';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { Form, Button } from 'react-bootstrap';
import MainFooter from './MainFooter';
import MainNavbar from './MainNavbar';
import '../styles/cart.css';
import { faGifts } from '@fortawesome/free-solid-svg-icons';


const CART_ITEMS_API = "/api/cart/get/";
const PLACE_ORDER_API = "/api/order/place/";
const LOGIN_PAGE = "/login";
const ORDERS_PAGE = "/orders";
const GET_USER_CURRENCY_API = "api/currency/";



const Cart = () => {
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [number, setNumber] = useState("");
    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [zip, setZip] = useState("");
    const [cartItems,setCartItems] = useState([]);
    const [currency,setCurrency] = useState({});
    const [cartCost,setCartCost] = useState(0);
    const [invalidOrder, setInvalidOrder] = useState([]);
    const [canPlaceOrder, setCanPlaceOrder] = useState(true);
    const [orderPlaceErrorMsg, setOrderPlaceErrorMsg] = useState("");
    const [totalOrderCost,setTotalOrderCost] = useState(0);
 const getUserCurrency = async ({currency})=>{
      try{
          const response = await authapi.get(GET_USER_CURRENCY_API+currency);
          if(response && response.data){
              if(response.data.success){
                  setCurrency(response.data.currency);
              }else{
                  console.log(response);
              }
          }else{
              console.log(response);
          }
      }catch(err){
          console.log(JSON.stringify(err));
      }
  }

  const getCartItems = async ()=>{
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user"));
      if(!token || !user){
          navigate(LOGIN_PAGE, {replace:true});
      }else{
          try{
              const response = await authapi.get(CART_ITEMS_API+user.id);
              if(response && response.data){
                  if(response.data.success){
                      if(response.data.items){
                          setCartItems(response.data.items);
                          console.log(response.data.items);
                          let invalidOrderCopy = [];
                          response.data.items.forEach((item)=>{
                                invalidOrderCopy.push(false);
                          })
                          setInvalidOrder(invalidOrderCopy);
                      }else{
                          setCartItems([]);
                      }
                  }else{
                      console.log(response);
                  }
              }else{
                  console.log(response);
              }
          }catch(err){
              if(err && err.response && err.response.data && err.response.data.error){
                  console.log(err.response.data.error);
              }
          }
      }
  }

  const placeOrder = async ()=>{
      setOrderPlaceErrorMsg("");
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user"));
      const data = {};
      data.userId = user.id;
      data.name=name;
      data.number=number;
      data.address=address;
      data.city=city;
      data.state=state;
      data.zip=zip;

      
      if(!token || !user){
          navigate(LOGIN_PAGE, {replace:true});
      }else if(!user.address || !user.country || !user.city){
        setOrderPlaceErrorMsg("Please specify complete address details in your profile section before placing order!");
      }else{
          try{
              const response = await authapi.post(PLACE_ORDER_API,data);
              if(response && response.data){
                  if(response.data.success){
                    navigate(ORDERS_PAGE, {replace:true});
                  }else{
                    console.log("Error placing order");
                  }
              }else{
                  console.log(response);
              }
          }catch(err){
              if(err && err.response && err.response.data && err.response.data.error){
                  console.log(err.response.data.error);
              }
          }
      }
  }

  useEffect(() => {
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user"));
      if(!token || !user){
          navigate("/login", {replace:true});
      }else{
          getCartItems();
          getUserCurrency(user);
      }
  },[]);

  useEffect(() => {
        let flag = false;
        invalidOrder.forEach((eachOrderInvalid)=>{
            if(eachOrderInvalid){
                setCanPlaceOrder(false);
                flag=true;
            }
      })
      if(!flag){
          setCanPlaceOrder(true);
      }
  },[invalidOrder]);

  useEffect(() => {
        let totalCost = 0;
        cartItems.forEach((eachCartItem)=>{
            totalCost+=parseInt(eachCartItem.orderQuantity)*parseFloat(eachCartItem.item.price);
        });
        setTotalOrderCost(totalCost);
  },[cartItems]);

  return (
    <div>
      <MainNavbar/>
      <div className="container cart-heading">
          <center>
             <h1> Gift Items
             <FontAwesomeIcon className="fa-gift solid" icon={faGifts}/>

                 </h1>
             </center>
        
      </div>
      <div className='row'>
      <div className="col-md-7 col-sm-12">
      {cartItems && cartItems.length && cartItems.map((eachCartItem,index)=>{  
        return <CartItem index={index} invalidOrder={invalidOrder} setInvalidOrder={setInvalidOrder} currency={currency} key={eachCartItem.cartId} cartItems={cartItems} setCartItems={setCartItems} item={eachCartItem}/>
      })}
      </div>
      <div className="col-md-4 col-sm-12">

      <span className="overview-name">Delivery Address</span>
      <div className="border-btm col-md-12">
      <div className='row'>
      <label htmlFor="username" className="editprofile_item_label">Name</label>
        <input className="form-control editprofile_item_input" id="username" name="username" type="text" onChange={(e)=>{setName(e.target.value)}} ></input>
      </div>
      <div className='row'>
      <label htmlFor="phonenumber" className="editprofile_item_label">Contact Number</label>
        <input className="form-control editprofile_item_input" id="phonenumber" name="phonenumber" type="number" onChange={(e)=>{setNumber(e.target.value)}} ></input>
      </div>
      <div className='row'>
      <label htmlFor="address" className="editprofile_item_label">Address</label>
        <input className="form-control editprofile_item_input" id="address" name="address" type="text" onChange={(e)=>{setAddress(e.target.value)}} ></input>
      </div>
      <div className='row'>
      <label htmlFor="city" className="editprofile_item_label">City</label>
        <input className="form-control editprofile_item_input" id="city" name="city" type="text" onChange={(e)=>{setCity(e.target.value)}} ></input>
      </div>
      <div className='row'>
      <label htmlFor="state" className="editprofile_item_label">State</label>
        <input className="form-control editprofile_item_input" id="state" name="state" type="text" onChange={(e)=>{setState(e.target.value)}}></input>
      </div>
      <div className='row'>
      <label htmlFor="zip" className="editprofile_item_label">Zip Code</label>
        <input className="form-control editprofile_item_input" id="zip" name="zip" type="number" onChange={(e)=>{setZip(e.target.value)}}></input>
      </div>
      

        


      </div>
                        
      
      </div>
      </div>
     
       <div className="container">
            {/*<Button className="cart_order-btn" onClick={placeOrder} disabled={!canPlaceOrder}>Place Order</Button>*/}
            <center>
            <Button className="cart_order-btn" onClick={placeOrder}> Place Order </Button>
            </center>
            {/* <Button className="cart_order-btn" onClick={placeOrder}>Place Order</Button> */}
            {/* <span className="cart-cost">{"Total Cost: "+"$"+totalOrderCost}</span> */}
            {orderPlaceErrorMsg && <div className="addcart-error">{orderPlaceErrorMsg}</div>}
       </div>

       <div>
        <h1> "" </h1>
       </div>
       <div>
      <h1> </h1>
       </div>
      {/* <MainFooter currency={currency} setCurrency={setCurrency}/> */}

    </div>
  )
}

export default Cart