const router = require("express").Router();
const Coin = require("../models/Coin.model.js");
const axios = require("axios");

router.get("/update", async (req, res, next) => {

    try {
        console.log("updating coins 1")
        const response = await axios.get('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=1000&page=1&sparkline=true&price_change_percentage=24h');
        const coin_updates = response.data.map(coin => Coin.updateOne({ id: coin.id }, coin, { upsert: true }));
        await Promise.all(coin_updates);
        const coins = await Coin.find();
        console.log("updating coins")
        res.status(200).json(coins);
    } catch (e) {
        console.log(e)
        res.status(500).json({ message: e });
    }
   
});

router.get("/coins/:coinId", async (req, res, next) => {
    const { coinId } = req.params

    try {
        const coin = await Coin.findById(coinId)
        console.log(coin)
        res.status(200).json(coin)
    } catch(e) {
        res.status(500).json({ message: e });
    }
   
});

router.get("/trending", async (req, res, next) => {
    try {
        const response = await axios.get('https://api.coingecko.com/api/v3/search/trending');
        const trending = response.data
        res.status(200).json(trending);
    } catch (e) {
        res.status(500).json({ message: e });
    }
   
});

module.exports = router;
