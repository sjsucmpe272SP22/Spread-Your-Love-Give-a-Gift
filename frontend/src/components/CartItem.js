import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import {axiosInstance as authapi} from '../services/authpost';
import { Form, Button } from 'react-bootstrap';
import config from '../config/config';
import '../styles/cartitem.css';

const REMOVE_ITEM_CART_API = "/api/cart/delete";
const UPDATE_ITEM_QUANTITY_CART_API = "/api/cart/item/quantity";
const GET_ITEM_DISPLAY_PIC_API = config.baseUrl+"/api/item/display-picture/";
const UPDATE_ITEM_GIFT_CART_API = "/api/cart/item/gift";

const CartItem = ({index, invalidOrder,setInvalidOrder, item, cartItems, setCartItems,currency }) => {
    const navigate = useNavigate();
    const [orderQuantity, setOrderQuantity] = useState(item.orderQuantity);
    const [gift,setGift] = useState(item.gift === 'true');
    const [description, setDescription] = useState(item.description);

    useEffect(() => {
        const token = localStorage.getItem("token");
        const user = localStorage.getItem("user");
        if (!token || !user) {
            navigate("/login", { replace: true });
        }
    });

    useEffect(async () => {
        if(orderQuantity>1000){
            setOrderQuantity(item.orderQuantity);
        }else if(orderQuantity<-1000){
            setOrderQuantity(1);
        }
        else if(((item.item.quantity)<orderQuantity) || orderQuantity<=0){
            let invalidOrderCopy = JSON.parse(JSON.stringify(invalidOrder));
            invalidOrderCopy[index] = true;
            setInvalidOrder(invalidOrderCopy);
        }else{
            let invalidOrderCopy = JSON.parse(JSON.stringify(invalidOrder));
            invalidOrderCopy[index] = false;
            setInvalidOrder(invalidOrderCopy);
            item.orderQuantity = orderQuantity;
            try {
                const user = JSON.parse(localStorage.getItem("user"));
                const data = {};
                data.cartId = item.id;
                data.userId = user.id;
                data.itemId = item.item.id;
                data.orderQuantity = orderQuantity;
                const response = await authapi.post(UPDATE_ITEM_QUANTITY_CART_API, data);
                if (response && response.data && response.data.success) {
                    cartItems.forEach((eachCartItem) => {
                        if(eachCartItem.cartId === item.cartId){
                            eachCartItem.orderQuantity = item.orderQuantity;  
                        }
                    });
                    setCartItems([...cartItems]);
                } else {
                    console.log("Error updating quantity");
                }
            } catch (e) {

            }
        }
    }, [orderQuantity]);

    useEffect(async () => {
        item.gift = gift;
        item.description = description;
        const user = JSON.parse(localStorage.getItem("user"));
        const data = {};
        data.cartId = item.id;
        data.userId = user.id;
        data.itemId = item.item.id;
        data.gift = gift;
        if(gift){
            data.description = description;   
        }else{
            setDescription("");
            data.description = "";
        }
        try {
            const response = await authapi.post(UPDATE_ITEM_GIFT_CART_API, data);
            if (response && response.data && response.data.success) {
                cartItems.forEach((eachCartItem) => {
                    if(eachCartItem.cartId == item.cartId){
                        eachCartItem.gift = item.gift;
                        eachCartItem.description = item.description;  
                    }
                });
                setCartItems([...cartItems]);
            } else {
                console.log("Error updating quantity");
            }
        } catch (e) {

        }
    }, [gift,description]);

    const removeItem = async () => {
        const data = {};
        data.id = item.id;
        try {
            const response = await authapi.post(REMOVE_ITEM_CART_API, data);
            if (response && response.data) {
                if (response.data.success) {
                    const filteredCartItems = cartItems.filter((eachCartItem) => {
                        return eachCartItem.cartId != item.cartId;
                    });
                    setCartItems(filteredCartItems);
                } else {
                    console.log("Error removing item");
                }
            } else {
                console.log(response);
            }
        } catch (err) {
            if (err && err.response && err.response.data && err.response.data.error) {
                console.log(err.response.data.error);
            }
        }
    }
    return (
        <div>
            <div className="container cartitem-container">
                <div className="row">
                    <div className="col-md-5">
                        <div><img src={GET_ITEM_DISPLAY_PIC_API+item.item.displayPicture} className="cartitem_display_picture"></img></div>
                    </div>
                    <div className="mrgn-tp col-md-4">
                        <div>
                            <span className="overview-name">{item.item.name}</span>
                        </div>
                        <div>{item.itemCategory}</div>
                        <div>{"$"+item.item.price}</div>
                        <div>{item.itemDescription}</div>
                        <div className="homeitem_sales_count">{(item.item.quantity)+" pieces available! to Gift!!"}</div>
                        {/* <div className="homeitem_sales_count">{item.item.salesCount+" pieces sold till now!"}</div> */}
                    <Form.Group className="mb-3">
                        <Form.Label htmlFor="quantity">Quantity</Form.Label>
                        <Form.Control value={orderQuantity} onChange={(e) => { setOrderQuantity(e.target.value) }} type="number" id="quantity" />
                        {(item.item.quantity)<orderQuantity && <div className="mrgn-tp addcart-error">Out of Stock!</div>}
                        {orderQuantity<=0 && <div className="mrgn-tp addcart-error">Invalid order quantity!</div>}
                    </Form.Group>
                    <Button className="cartitem_remove-btn" onClick={removeItem}>
                        Delete
                    </Button>
                        <span className="cartitem-cost">{"Cost: $"+((item.item.price*orderQuantity)>0 ? (item.item.price*orderQuantity):0)}</span>
                    <div>
                        <Form.Check size="sm" className="exclude-filter" checked={gift} onChange={(e)=>{setGift(e.target.checked)}} type="checkbox" label="Add Gift Message!!"/>
                        {gift && 
                        <Form.Group className="mb-3">
                            <Form.Control onChange={(e)=>{setDescription(e.target.value)}} value={description}  as="textarea" placeholder="Gift Message!!"/>
                        </Form.Group>
                        }
                    </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CartItem