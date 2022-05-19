import React,{useState, useEffect} from 'react';
import {InputGroup, Collapse, Button, Modal, Form} from 'react-bootstrap';
import {axiosInstance as authapi} from '../services/authpost';
import {useNavigate} from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faCamera } from "@fortawesome/free-solid-svg-icons";
import config from '../config/config';
import '../styles/editshopitem.css';
import 'bootstrap/dist/css/bootstrap.css';

const GET_CATEGORIES_API = "/api/category/";
const EDIT_ITEM_API = "/api/item/edit";
const ADD_CATEGORY_API = "/api/category/add";
const GET_ITEM_DISPLAY_PIC_API = config.baseUrl+"/api/item/display-picture/";
const UPLOAD_ITEM_DISPLAY_PIC_API = "api/item/display-picture/upload";


const EditItem = ({items,setItems,index,id,name,setName,displayPicture,setDisplayPicture,category,setCategory,description,setDescription,price,setPrice,quantity,setQuantity,currency}) => {
    const navigate = useNavigate();
    const [categories,setCategories] = useState([]);
    const [gettingCategories,setGettingCategories] = useState([]);
    const [error, setError] = useState("");
    const [show, setShow] = useState(false);
    const [editingItem, setEditingItem] = useState(false);
    const [newCategory,setNewCategory] = useState("");
    const [categoryOpen, setCategoryOpen] = useState(false);
    const [invalidPrice,setInvalidPrice] = useState("");
    const [invalidQuantity,setInvalidQuantity] = useState(""); 

    
    
    const [copyDisplayPicture,setCopyDisplayPicture] = useState(displayPicture);
    const [copyName,setCopyName] = useState(name);
    const [copyCategory,setCopyCategory] = useState(category);
    const [copyPrice,setCopyPrice] = useState(price);
    const [copyQuantity,setCopyQuantity] = useState(quantity);
    const [copyDescription,setCopyDescription] = useState(description);

    const getCategories = async ({id}) => {
        setGettingCategories(true);
        try{
            const response = await authapi.get(GET_CATEGORIES_API+id);
            if(response && response.data && response.data.success && response.data.categories){
                setCategories(response.data.categories);
                setGettingCategories(false);
            }else{
                setError("Some unexpected error occurred!");
                setGettingCategories(false);
            }
        }catch(e){
            console.log(e);
            setError("Some unexpected error occurred!");
            setGettingCategories(false);
        }
    }

    

    const handleClose = () => {
            setCopyName(name);
            setCopyPrice(price);
            setCopyQuantity(quantity);
            setCopyCategory(category);
            setCopyDescription(description);
            setShow(false);
    };

    const handleShow = () => {
        const user = JSON.parse(localStorage.getItem('user'));
        getCategories(user);
        setShow(true);
    };

    const editItem = async ()=>{
        setEditingItem(true);
        const item = {};
        item.displayPicture = copyDisplayPicture;
        item.name = copyName;
        item.price = copyPrice;
        item.quantity = copyQuantity;
        item.category = copyCategory;
        item.description = copyDescription;
        item.id=id;
        items[index] = item;
        setItems(items);
        try{
            const response = await authapi.post(EDIT_ITEM_API,item);
            if(response && response.data && response.data.success){
                setName(copyName);
                setPrice(copyPrice);
                setQuantity(copyQuantity);
                setCategory(copyCategory);
                setDescription(copyDescription);
                setEditingItem(false);
                setShow(false);
            }else{
                setError("Some unexpected error occurred!");
                setEditingItem(false);
            }
        }catch(e){
            setEditingItem(false);
        }
    }

    const addCategory = async () => {
        const user = JSON.parse(localStorage.getItem("user"));
        const data = {};
        data.name = newCategory;
        data.userId = user.id;
        try{
            const response = await authapi.post(ADD_CATEGORY_API,data);
            if(response && response.data && response.data.success){
                setCategories([...categories,{name:data.name,id: response.data.addedCategory.insertId}]);
                setNewCategory("");
                setNewCategory("");
            }else{
                setError("Some unexpected error occurred!");
                setNewCategory("");
            }
        }catch(e){
            console.log(e);
            setError("Some unexpected error occurred!");
            setNewCategory("");
        }
    }

    const itemDisplayPictureSelected = async (event) => {
        let formData = new FormData();
        const image = event.target.files[0];
        formData.append("image", image);
        formData.append("itemId",id);
        try{
            const response = await authapi.post(UPLOAD_ITEM_DISPLAY_PIC_API, formData, { headers: {'Content-Type': 'multipart/form-data'}});
            if(response && response.data && response.data.imageKey){
                setDisplayPicture(response.data.imageKey);
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
            getCategories(user);
        }
    },[]);

    useEffect(() => {
        if(price<=0){
            setInvalidPrice("Invalid price");
        }else{
            setInvalidPrice("");
        }
    },[price]);

    useEffect(() => {
        if(quantity<0){
            setInvalidQuantity("Invalid quantity");
        }else{
            setInvalidQuantity("");
        }
    },[quantity]);

  return (
    <>
      <FontAwesomeIcon className="fa-thin fa-pen" icon={faPen} onClick={handleShow}/>
      <Modal show={show && !gettingCategories} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Item</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form>
                <div className="col-md-12">
                    <div><img src={GET_ITEM_DISPLAY_PIC_API+displayPicture} className="view_profile_picture"></img></div>
                    <div>
                        <label className="viewprofile-editimg"htmlFor="profile-pic"><FontAwesomeIcon icon={faCamera}/></label>
                        <input data-testid="profile-pic" onChange={itemDisplayPictureSelected} style={{display: "none"}} id="profile-pic" type="file"></input>
                    </div>
                </div>
                <Form.Group className="mb-3">
                    <Form.Label>Name</Form.Label>
                    <Form.Control onChange={(e)=>{setCopyName(e.target.value)}} value={copyName} type="text" placeholder="Name" />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Price {"("+currency.name+")"}</Form.Label>
                    <Form.Control onChange={(e)=>{setCopyPrice(e.target.value)}} value={copyPrice} type="number" placeholder="Price" />
                    {invalidPrice && <div class="error">{invalidPrice}</div>}
                </Form.Group>
                <Form.Group  className="mb-3" >
                    <Form.Label>Quantity</Form.Label>
                    <Form.Control onChange={(e)=>{setCopyQuantity(e.target.value)}} value={copyQuantity} type="number" placeholder="Quantity" />
                    {invalidQuantity && <div class="error">{invalidQuantity}</div>}
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Category</Form.Label>
                    <Form.Select name="category" id="category" value={copyCategory} onChange={(e)=>{setCopyCategory(e.target.value)}}>
                        <option value="">Select Category</option>
                        {
                            categories.map((eachCategory,index)=>{
                                return <option key={index} value={eachCategory.id}>{eachCategory.name}</option>
                            })
                        }
                    </Form.Select>
                    <span className="additem-category-collapse" onClick={() => setCategoryOpen(!categoryOpen)} aria-controls="example-collapse-text" aria-expanded={categoryOpen}>
                        Add a new category
                    </span>
                    <Collapse in={categoryOpen}>
                        <Form.Group size="sm" className="mb-3">
                            <Form.Control size="sm" value={newCategory} onChange={(e)=>{setNewCategory(e.target.value)}} type="text" placeholder="Enter category name" />
                            <Button className="add-category-btn" size="sm" variant="secondary" onClick={addCategory}>Add</Button>
                        </Form.Group>
                    </Collapse>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Description</Form.Label>
                    <Form.Control onChange={(e)=>{setCopyDescription(e.target.value)}} value={copyDescription}  as="textarea" placeholder="Description" />
                </Form.Group>
            </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button className="addshop-cancel_save-btn" onClick={handleClose}>
            Close
          </Button>
          <Button className="addshop-confirm_save-btn" onClick={editItem} disabled={invalidPrice || invalidQuantity}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default EditItem;