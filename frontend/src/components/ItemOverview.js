import React,{useState, useEffect} from 'react';
import { useLocation , useNavigate, useParams, Link} from 'react-router-dom';
import {axiosInstance as authapi} from '../services/authpost';

import { Form, Button } from 'react-bootstrap';
import { faHeart as faHeartSolid} from "@fortawesome/free-solid-svg-icons";
import { faHeart as faHeartRegular} from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import config from '../config/config';
import MainNavbar from './MainNavbar';
import MainFooter from './MainFooter';
import '../styles/itemoverview.css';



const GET_ITEM_API = "/api/item/";
const ADD_CART_API = "api/cart/add/";
const ADD_FAVORITE_ITEM_API = "api/favoriteitem/add";
const REMOVE_FAVORITE_ITEM_API = "api/favoriteitem/remove";
const GET_USER_CURRENCY_API = "api/currency/";
const SHOP_HOME_PAGE = "/shop/home/";
const GET_ITEM_DISPLAY_PIC_API = config.baseUrl+"/api/item/display-picture/";
const HOME_PAGE = "/";

const ItemOverview = ({searchQuery,setSearchQuery,getOtherFilterItems,setItems,gettingCurrency,itemsLoading}) => {
    const [item,setItem] = useState({});
    const navigate = useNavigate();
    const [itemLoading,setItemLoading] = useState(true);
    const [errorMsg,setErrorMsg] = useState("");
    const search = useLocation().search;
    const {id} = new useParams(search);
    const [orderQuantity,setOrderQuantity] = useState(1);
    const [addToCartSuccessMsg,setAddToCartSuccessMsg] = useState("");
    const [itemExistsMsg,setItemExistsMsg] = useState("");
    const [notEnoughStockMessage,setNotEnoughStockMessage] = useState("");
    const [currency,setCurrency] = useState({});

    const getItem = async (itemId)=>{
        setItemLoading(true);
        const user = JSON.parse(localStorage.getItem("user"));
        const userId = user.id;
        console.log(user)
        try{
        const response = await authapi.get(GET_ITEM_API+itemId+"/"+userId);
        if(response && response.data){
            if(response.data.success){
                const item = response.data.item;
                setItem(item);
                setItemLoading(false);
            }else{
                setErrorMsg("Some unexpected error occurred!");
                setItemLoading(false);
            }
        }else{
            setErrorMsg("Some unexpected error occurred!");
            setItemLoading(false);
        }
        }catch(err){
            if(err && err.response && err.response.data && err.response.data.error){
                setErrorMsg(err.response.data.error);
            }
            setItemLoading(false);
        }
    }

    const addToCart = async ()=>{
        if(errorMsg){
            
        }else{
            console.log(item);
            const data = {};
            const user =  JSON.parse(localStorage.getItem("user"));
            data.userId = user.id;
            data.itemId = id;
            data.orderQuantity = orderQuantity;
            try{
                const response = await authapi.post(ADD_CART_API,data);
                if(response && response.data){
                    if(response.data.success){
                        if(response.data.addedItem){
                            const shop = response.data.addedItem;
                            setOrderQuantity(1);
                            setAddToCartSuccessMsg("Item added to cart successfully!");
                            setTimeout(()=>{
                                setAddToCartSuccessMsg("");
                            },1500);
                        }else{
                        console.log(response);
                        }
                    }else{
                        console.log(response);
                    }
                }else{
                    console.log(response);
                }
            }catch(err){
                if(err && err.response && err.response.data && err.response.data.error){
                if(err.response.data.itemExists){
                        setItemExistsMsg("Item already added to cart!");
                        setTimeout(()=>{
                            setItemExistsMsg("");
                        },5000);
                    }else{
                        console.log(err.response.data.error);
                    }
                }
            }
        }
    }

    const removeFavoriteItem = async ()=>{
        const user = JSON.parse(localStorage.getItem("user"));
        const data = {};
        data.itemId = item.id;
        data.userId = user.id;
        try{
            const response = await authapi.post(REMOVE_FAVORITE_ITEM_API,data);
            if(response && response.data){
                if(response.data.success){
                    if(response.data.removeItem){
                        const itemCopy = JSON.parse(JSON.stringify(item));
                        itemCopy.favorite = false;
                        setItem(itemCopy);
                    }else{
                    console.log(response);
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

    const addFavoriteItem = async ()=>{
        const user = JSON.parse(localStorage.getItem("user"));
        const data = {};
        data.itemId = item.id;
        data.userId = user.id;
        try{
            const response = await authapi.post(ADD_FAVORITE_ITEM_API,data);
            if(response && response.data){
                if(response.data.success){
                    if(response.data.favoriteItem){
                        const itemCopy = JSON.parse(JSON.stringify(item));
                        itemCopy.favorite = true
                        setItem(itemCopy);
                    }else{
                    console.log(response);
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

    useEffect(() => {
        const token = localStorage.getItem("token");
        const user = JSON.parse(localStorage.getItem("user"));
        if(!token || !user){
            navigate("/login", {replace:true});
        }else{
            getItem(id);
            getUserCurrency(user);
        }
    },[]);

    useEffect(() => {
        setErrorMsg("");
        if(orderQuantity>1000){
            setOrderQuantity(item.itemQuantity-item.itemSalesCount);
        }
        if(orderQuantity<-1000){
            setOrderQuantity(1);
        }
        if(orderQuantity<=0){
            setErrorMsg("Invalid order quantity!");
        }else if(orderQuantity>(item.itemQuantity-item.itemSalesCount)){
            setErrorMsg("Invalid order quantity!");
        }else{
            setItem({...item,orderQuantity});
        }
    },[orderQuantity]);

    return (
    <div>
        {!itemLoading &&
            <div>
            <MainNavbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} getOtherFilterItems={getOtherFilterItems} setItems={setItems}/>
            <div className="container itemoverview-container">
                <div className="row">
                    <div className="mrgn-tp col-md-5">
                        <div><img src={GET_ITEM_DISPLAY_PIC_API+item.displayPicture} className="itemoverview_display_picture"></img></div>
                    </div>
                    <div className="mrgn-tp col-md-4">
                        <div>
                            
                            <span className="overview-name">{item.name}</span>
                            {/* {item.favorite && <span className="homeitem-favorite-icon"><FontAwesomeIcon onClick={removeFavoriteItem} color="red" icon={faHeartSolid}/></span>}
                            {!item.favorite && <span className="homeitem-favorite-icon"><FontAwesomeIcon onClick={addFavoriteItem} color="red" icon={faHeartRegular}/></span>} */}
                        </div>
                        {/* <Link className="overview-shop" to={SHOP_HOME_PAGE+item.shop.id}>{item.shop.name}</Link> */}
                      

                        <div data-testid="itemoverview-name">{item.categoryname}</div>
                       
                        <div className="itemoverview-price">{"Price:$"+item.price}</div>
                        
                       
                        {/* <div data-testid="itemoverview-description">{item.description}</div> */}
                        <div data-testid="itemoverview-quantity" className="homeitem_sales_count">{(item.quantity)+" pieces available to GIFT!!!"}</div>
                        <div data-testid="itemoverview-salescount" className="homeitem_sales_count">{item.salesCount+" pieces gifted already by others"}</div>
                    <Form.Group className="mb-3 mrgn-tp">
                        <Form.Label className="add-cart-quantity" htmlFor="quantity">Quantity</Form.Label>
                        <Form.Control className="add-cart-quantity" value={orderQuantity} onChange={(e)=>{setOrderQuantity(e.target.value)}}  type="number" id="quantity" />
                    </Form.Group>
                    {errorMsg && <div className="addcart-error">{errorMsg}</div>}<br></br><br></br>
                    <center>
                    <Button className="addtocart-btn" onClick={addToCart}>Add to Gift box</Button>
                    </center>
                   
                    {addToCartSuccessMsg && <div className="addcart-success">{addToCartSuccessMsg}</div>}
                    {itemExistsMsg && <div className="addcart-error">{itemExistsMsg}</div>}
                    </div>
                </div>
            </div>
          {/*  {!gettingCurrency && !itemsLoading && <MainFooter currency={currency} setCurrency={setCurrency}/>} */}
        </div>  
        }
    </div>
    )
}

export default ItemOverview