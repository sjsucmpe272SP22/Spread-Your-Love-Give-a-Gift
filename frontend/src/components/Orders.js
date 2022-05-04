import React,{useState,useEffect} from 'react'
import OrderItem from './OrderItem';
import {useNavigate} from "react-router-dom";
import {axiosInstance as authapi} from '../services/authpost';
import MainFooter from './MainFooter';
import MainNavbar from './MainNavbar';
import '../styles/orders.css';
import { Form, Button } from 'react-bootstrap';


const ORDER_ITEMS_API = "/api/order/get/";
const LOGIN_PAGE = "/login";
const GET_USER_CURRENCY_API = "api/currency/";
const HOME_PAGE = "/";

const Orders = ({searchQuery,setSearchQuery}) => {
  const navigate = useNavigate();
  const [orders,setOrders] = useState();
  const [currency,setCurrency] = useState({});
  const [skip,setSkip] = useState(0);
  const [limit,setLimit] = useState(5);
  const [moreAvailable, setMoreAvailable] = useState();
  const getOrderItems = async ()=>{
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user"));
      const data = {};
      data.limit = limit;
      data.skip = skip;
      if(!token || !user){
          navigate(LOGIN_PAGE, {replace:true});
      }else{
          try{
              const response = await authapi.post(ORDER_ITEMS_API+user.id,data);
              if(response && response.data){
                  if(response.data.success){
                      //console.log(JSON.stringify(response.data));
                      if(response.data.items){
                          setOrders(response.data.items);
                          setMoreAvailable(response.data.moreAvailable);
                      }else{
                          setOrders([]);
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
    const getOtherFilterItems = ()=>{
        navigate(HOME_PAGE);
    }

    const getPrevOrders = ()=>{
        setSkip((parseInt(skip)+parseInt(limit)>0) ? (parseInt(skip)-parseInt(limit)) : 0);
    }

    const getNextOrders = ()=>{
        setSkip((parseInt(skip)+parseInt(limit)>0) ? (parseInt(skip)+parseInt(limit)) : 0);
    }

  useEffect(() => {
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user"));
      if(!token || !user){
          navigate("/login", {replace:true});
      }else{
          getOrderItems();
          getUserCurrency(user);
      }
  },[]);

  useEffect(() => {
    getOrderItems();
  },[skip,limit])

  return (
    <div>
      <MainNavbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} getOtherFilterItems={getOtherFilterItems}/>
      <div className="container cart-heading">
        <h1 className="order-heading">Gift Items placed</h1>
        {/* <span className="paginate-col">
                <Form.Label htmlFor="paginate-order" size="sm">Show</Form.Label>
                <Form.Select size="sm" className="paginate-filter" value={limit} onChange={(e)=>{setLimit(e.target.value)}} id="paginate-order" name="paginate-order">
                  <option value="2">2</option>
                  <option value="5">5</option>
                  <option value="10">10</option>
                </Form.Select>
                <Form.Label htmlFor="paginate-order" size="sm">results</Form.Label>
              </span> */}
      </div>
        <div className="order-items">
            {orders && orders.map((eachOrder,eachOrderIndex)=>{
                let eachOrderId = eachOrder[0];
                let eachOrderItems = eachOrder[1];
                let orderTotal = 0;
                let c=0;
                return eachOrderItems && eachOrderItems.map((eachOrderItem,index)=>{
                    orderTotal += parseFloat(eachOrderItem.price*eachOrderItem.orderQuantity);
                    if(index===eachOrderItems.length-1){
                        // return <><OrderItem currency={currency} key={eachOrderItem.id} item={eachOrderItem}/><div className="container">Order Total: {currency && currency.name+" "+orderTotal} </div></>
                    }
                    c=c+1
                    return <OrderItem currency={currency} key={eachOrderItem.id} item={eachOrderItem} address={eachOrderId} c={c-1}/>
                    
                })
                
            })}
            
            {!orders || !Object.keys(orders).length && 
                <div className="container"> No past orders!</div>
            }
        </div>
        
        <div className="container mrgn-tp">
            {skip>0 && <span className="prev-paginate" onClick={getPrevOrders}>&lt; Prev</span>}
            {moreAvailable && <span className="next-paginate" onClick={getNextOrders}>Next &gt;</span>}
        </div>
       {/* <MainFooter currency={currency} setCurrency={setCurrency}/> */}
    </div>
  )
}

export default Orders