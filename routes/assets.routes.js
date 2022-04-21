const router = require("express").Router();
const axios = require("axios");
const helper = require("../helpers/helpers.js");

const Asset = require("../models/Asset.model.js");

const { isAuthenticated } = require("../middleware/jwt.middleware");

router.get("/assets", async (req, res) => {

    /* if (!isAuthenticated) {
        res.json("Login first please")
    }

    console.log(isAuthenticated) */

    try {
        const assets = await Asset.find();

        if (!assets) {
            res.status(500).json({ message: "No assets yet. Add a new transaction"})
        } else {
            console.log(assets)
            res.status(200).json({ assets });
        }

    } catch (e) {
        res.status(500).json({ message: e });
    }

});

/* router.get("/assets/:assetId", isAuthenticated, async (req, res, next) => {
    
    const { assetId } = req.params;
    const userId = req.session.user.id;

    try{
        const asset = await Asset.findOne({ _id:assetId, userId:userId}).populate('coin transactions userId');
        const portfolio = await Portfolio.findById(portfolioId).populate({
            path : 'assets',
            populate : {
                path : 'coin'
            }
        });

        console.log(asset);

        let amount = 0;
        let total = 0;
        let num = 0;

        asset.value = asset.amount * asset.coin.current_price;

        // % holdings
        portfolio.total = portfolio.assets.reduce((a,b) => {
            amount = b.amount * b.coin.current_price;
            b.totalAmount =  helper.amountFormatter(amount);
            return a + amount;
        } ,0);
        asset.percentage = (asset.value * 100) / portfolio.total;

        // Avg Buy Price
        asset.transactions.forEach(transaction => {
            if(transaction.transactionType === 'buy'){
                total += transaction.amount * transaction.price;
                num += transaction.amount;
            }
        });
        asset.avgBuyPrice = total / num;

        // Total PnL
        asset.pnl = asset.coin.current_price * asset.amount - (asset.avgBuyPrice * asset.amount); 

        res.json(asset)
    
        
    }catch(err){
        res.json(err);
    }
});  */

module.exports = router;
