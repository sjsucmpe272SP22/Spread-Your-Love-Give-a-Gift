const express = require("express");
const jwt = require("jsonwebtoken");
const config =  require('config');
const { Currency } = require("../services/currency");
const encrypt = require("../services/encrypt");
const router = express.Router();
const auth = require("../middleware/auth");

router.get("/",auth, async (req, res) => {
    const response = {};
    const data = {};
    try{
        const currencies = await Currency.getCurrencies(data);
        response.currencies = currencies;
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

router.get("/:currencyId",auth, async (req, res) => {
    const response = {};
    const data = {};
    data.currencyId = req.params.currencyId;
    try{
        const currency = await Currency.getCurrency(data);
        response.currency = currency;
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