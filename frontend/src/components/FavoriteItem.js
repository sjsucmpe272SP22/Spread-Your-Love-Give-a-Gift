import React,{useState, useEffect} from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faHeart as faHeartSolid} from "@fortawesome/free-solid-svg-icons";
import EditItem from './EditItem';
import {axiosInstance as authapi} from '../services/authpost';
import config from '../config/config';
import {Button, Card} from 'react-bootstrap';
import {useNavigate} from "react-router-dom";
import '../styles/favoriteitem.css';
import 'bootstrap/dist/css/bootstrap.css';



const REMOVE_FAVORITE_ITEM_API = "api/favoriteitem/remove";
const GET_ITEM_DISPLAY_PIC_API = config.baseUrl+"/api/item/display-picture/";

const FavoriteItem = ({item,favoriteItems,setFavoriteItems,index,currency}) => {
    const navigate = useNavigate();

    const viewItemOverview = ({item})=>{
        if(item?.id) {
             navigate("/item/overview/"+item.id);
        }
    }
    const removeFavoriteItem = async (event)=>{
        event.stopPropagation();
        const user = JSON.parse(localStorage.getItem("user"));
        const data = {};
        console.log(item);
        data.itemId = item.item.id;
        data.userId = user.id;
        try{
            const response = await authapi.post(REMOVE_FAVORITE_ITEM_API,data);
            if(response && response.data){
                if(response.data.success){
                    if(response.data.removeItem){
                        favoriteItems.splice(index,1)
                        const favoriteItemsCopy = JSON.parse(JSON.stringify(favoriteItems));
                        setFavoriteItems(favoriteItemsCopy);
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
                    console.log(err.response.data.error);
                }
            }
        }
    }

    return (
        <>
            {item && <Card className="favoriteitem_card" onClick={()=>{viewItemOverview(item)}}>
                <Card.Img variant="top" className="favoriteitem_picture" src={GET_ITEM_DISPLAY_PIC_API+item.item.displayPicture} />
                <Card.Body>
                    <Card.Title>
                        <div className="row">
                            <div className="col-md-8"><span className="favoriteitem_name">{item.item.name}</span></div>
                            {/*<div className="col-md-4 favoriteitem-favorite-icon"><FontAwesomeIcon onClick={removeFavoriteItem} icon={faHeartSolid} color="red"/></div>*/}

                            <div className="row">
                       <div><Button className='changeColor' onClick={removeFavoriteItem}>remove </Button></div>

                        </div>
                        </div>
                    </Card.Title>
                    <Card.Text>
                        <div className="favoriteitem_price">{(currency && currency.name)+" "+item.item.price}</div>
                        <div className="favoriteitem_description">{item.item.description}</div>
                        <div className="favoriteitem_sales_count">{item.item.salesCount+" pieces sold till now!"}</div>
                    </Card.Text>
                </Card.Body>
            </Card>}            
        </>
        
    )
}

export default FavoriteItem