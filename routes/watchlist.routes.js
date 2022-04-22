const router = require("express").Router();

const Notification = require("../models/Notification.model");
const User = require("../models/User.model");
const Coin = require("../models/Coin.model");

const { isAuthenticated } = require("../middleware/jwt.middleware");


router.get("/watchlist", isAuthenticated, async (req, res) => {

    const userId = req.payload._id;

    console.log({userId})
    
    try{

        const user = await Coin.findById({_id: userId});
        res.json("Watchlist done")

    }catch(e){
        res.status(500).json({ message: e });
    }
}),

/* router.post("/watchlist", isAuthenticated, async (req, res) => {

    const userId = req.payload._id;

    console.log(userId)
    
    try{

        const user = await Coin.find;

        

        res.json("Watchlist done")

    }catch(e){
        res.status(500).json({ message: e });
    }
}) */

module.exports = router;