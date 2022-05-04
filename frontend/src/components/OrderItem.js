import React,{useEffect} from 'react';
import {useNavigate} from "react-router-dom";
import config from '../config/config';
import '../styles/orderitem.css';

const GET_ITEM_DISPLAY_PIC_API = config.baseUrl+"/api/item/display-picture/";


const OrderItem = ({item, currency,address,c}) => {
    const navigate = useNavigate();
    let flag;
    if(c==0)
    {
        flag=true
    }
    else{
        flag = false
    }

    useEffect(() => {
        const token = localStorage.getItem("token");
        const user = localStorage.getItem("user");
        if(!token || !user){
            navigate("/login", {replace:true});
        }
    });

    return (
        <div>
            <div className="container orderitem-container">
                <div className="row">
                    <div className="col-md-3">
                        <div><img src={GET_ITEM_DISPLAY_PIC_API+item.displayPicture} className="orderitem_display_picture"></img></div>
                    </div>
                    <div className="col-md-2">
                        <div>
                            <span className="overview-name">{item.name}</span>
                        </div>
                        <div>{"Total Price: "+" $"+item.price*item.orderQuantity+" ("+" $"+item.price+" per piece)"}</div>
                        {/* <div>{"Shop Name: "+item.shopName}</div> */}
                        <div>{"Quantity: "+item.orderQuantity}</div>
                        <div>{"Date: "+item.dateFormatted}</div>
                        {item.gift==='true' && <div className="add-border">
                            <div>{item.gift==='true' ? "":"" }</div>
                            <div>{item.gift==='true' ? "Gift Message: "+item.cartDescription : ""}</div>
                        </div>}
                        <div className="homeitem_sales_count">{item.orderId}</div>
                    </div>
                    <div className='col-md-5'>
                    {flag && <div>
                    <div> <span className="overview-name">Address</span> </div>
                    <div>{"Name: "+address.name}</div>
                    <div>{"Number: "+address.number}</div>
                    <div>{"Address: "+address.address}</div>
                    <div>{"City: "+address.city}</div>
                    <div>{"State: "+address.state}</div>
                    <div>{"Zip: "+address.zip}</div>
                            
                        </div>
                        
                        }

                    </div>
                    
                </div>
            </div>
        </div>
    )
}

export default OrderItem