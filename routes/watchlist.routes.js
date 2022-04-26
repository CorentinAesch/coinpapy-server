const router = require("express").Router();

const mongoose = require("mongoose");

const Notification = require("../models/Notification.model");
const User = require("../models/User.model");
const Coin = require("../models/Coin.model");

const { isAuthenticated } = require("../middleware/jwt.middleware");
const Favcoin = require("../models/Favcoin.model");


router.get('/watchlist', isAuthenticated, async (req, res) => {

    const userId = req.payload._id;
    
    try{
        const user = await User.findById({_id: userId});
        const watchlist = user.watchlist;

        console.log(watchlist)

        if (watchlist.length !== 0) {
            res.status(200).json(watchlist);
        }

        res.status(204).json({ message: "Watchlist is empty. Add coin to watchlist" });
        
    } catch(e) {
        res.status(500).json({ message: e });
    }  
});


router.post("/watchlist", isAuthenticated, async (req, res) => {

    const userId = req.payload._id;
    const { coin, variationAlert, priceAlert } = req.body;
    
    try{

        let user = await User.findById(userId).populate("watchlist");
        
        const isFav = user.watchlist.filter((favcoin) => {
            return favcoin.coin.toString() === coin;
        });
        
        if (isFav.length){

            res.status(400).json({ message: "This coin is already in your watchlist" });

        } else {

            const newFav = await Favcoin.create({ coin, variationAlert, priceAlert });
            user = await User.findByIdAndUpdate(userId, {$push: { watchlist: newFav  }}, { new: true});

            const newNotif = await Notification.create({ coin, userId });
            user = await User.findByIdAndUpdate(userId, {$push: { notifications: newNotif  }}, { new: true});
    
            res.status(200).json({ newFav, newNotif });
        }
        

    }catch(e){
        res.status(500).json({ message: e });
    }
});


router.get('/watchlist/:favcoinId', isAuthenticated, async (req, res) => {
    const favcoinId = req.params;
    
    try {
        const favCoin = Favcoin.findById({_id: favcoinId}).populate("coin");
        res.status(200).json({ favCoin })
        
    } catch(e) {
        res.status(500).json({ message: e });
    }  
});

module.exports = router;