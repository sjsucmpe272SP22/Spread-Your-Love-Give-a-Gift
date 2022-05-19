const express = require("express");
const jwt = require("jsonwebtoken");
const config =  require('config');
const { Order } = require("../services/order");
const encrypt = require("../services/encrypt");
const router = express.Router();
const auth = require("../middleware/auth");

router.post("/get/:userId", async (req, res) => {
    const response = {};
    const data = {};
    data.userId = req.params.userId;
    data.skip = req.body.skip;
    data.limit = req.body.limit;
    try{
        const items = await Order.getOrderItems(data);
        response.items = items.orders;
        response.success = true;
        response.moreAvailable = items.moreAvailable;
        response.status = "200";
        return res.status(200).send(response);
    }catch(e){
        console.log(e);
        response.success = false;
        response.error = "Some error occurred. Please try again later";
        response.status = "500";
        res.status(500).send(response);
    }
});

router.post("/place", auth, async (req, res) => {
    const response = {};
    const data = req.body;
    try{
        const result = await Order.placeOrder(data);
        response.result = result;
        response.success = true;
        response.status = "200";
        return res.status(200).send(response);
    }catch(e){
        console.log(e);
        response.success = false;
        response.error = "Some error occurred. Please try again later";
        response.status = "500";
        res.status(500).send(response);
    }
});

module.exports = router;