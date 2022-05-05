const router = require("express").Router();

const mongoose = require("mongoose");

const Asset = require("../models/Asset.model.js");
const User = require("../models/User.model.js");
const Transaction = require("../models/Transaction.model.js");
const Coin = require("../models/Coin.model.js");
const helper = require("../helpers/helpers.js");

const { isAuthenticated } = require("../middleware/jwt.middleware");

// Get all transactions

router.get('/transaction'), isAuthenticated, async (req, res) => {

    try {
        const transac = await Transaction.find();
       
        if (!transac) {
            res.status(500).json({ message: "No transaction yet. Add a new transaction"})
        } else {
            console.log(transac)
            res.status(200).json({ transac });
        }

    } catch(e) {
        res.status(500).json({ message: e });
    }
}

// Create 

router.get('/transaction/create', isAuthenticated, async (req, res) => {

    try {
        //const coins = await Coin.find().sort('market_cap_rank');
        res.status(200).json("Here you can create a new transac")
    } catch(e) {
        res.status(500).json({ message: e });
    }
    
});


router.post('/transaction/create', isAuthenticated,  async (req, res) => {
   
    const { price, currency, amount, coin, total, transactionType, note } = req.body; 
    let { created } = req.body;

    const user = req.payload._id;
    
    console.log(user)

    try{

        let asset = await Asset.findOne({ coin: coin, userId:user }).populate('coin userId');
        
        if(!asset){
            console.log('Creating New asset')
            asset = await Asset.create({coin, amount:0, userId:user}) 
        }

        created = !created? Date.now():created;
        
        const transaction = await Transaction.create({
            price:price, 
            currency:currency, 
            asset: asset.id,
            amount:amount, 
            total:total, 
            transactionType:transactionType, 
            note:note, 
            created:created
        })

        const updatedAsset = await Asset.findOneAndUpdate({_id:asset.id},{$push: { transactions: transaction.id  }},{new:true}).populate('coin transactions userId');
        await helper.updateAssetAmount(updatedAsset);
        console.log("updated asset", updatedAsset)

        res.status(200).json({ asset, transaction });

    }catch(e){
        res.status(500).json({ message: e });
    }
    
});


// Edit

router.get('/asset/:assetId/transaction/:transactionId/edit', isAuthenticated, async (req, res) => {

    const {assetId, transactionId} = req.params;

    try {
        await Asset.findOne({_id:assetId});
        await Transaction.findOne({_id:transactionId});
        res.status(200).json("Here you can edit your transaction");
    } catch(e) {
        res.status(500).json({ message: e });
    }
    
});

router.post('/asset/:assetId/transaction/:transactionId/edit', isAuthenticated, async (req, res) => {

    const {assetId, transactionId} = req.params;
    const {price, currency, amount, total, transactionType, note} = req.body; 
    let {created} = req.body;

    created = !created? Date.now():created;

    try{
        await Transaction.findOneAndUpdate({_id:transactionId},{price, currency, amount, total, transactionType, note, created});
        let asset = await Asset.findOne({_id:assetId}).populate('coin transactions');
        await helper.updateAssetAmount(asset);
        res.json("Here you can edit your transaction");

    }catch(err){
        res.status(500).json({ message: e });
    }
});


// Delete

router.post('/asset/:assetId/transaction/:transactionId/delete',isAuthenticated, async (req, res) => {

    const {assetId,transactionId} = req.params;

    try{
        console.log('DELETING TRANSACTION');
        await Transaction.findOneAndDelete({_id:transactionId})
        const asset = await Asset.findOne({_id:assetId}).populate('coin transactions');

        console.log('DELETING ASSET');
        if(asset.transactions.length > 0) {
            await helper.updateAssetAmount(asset);
            res.json("Transaction deleted");
        }
        
        await Asset.findOneAndDelete({_id:assetId});
        res.json("Transaction & asset deleted");

    }catch(err){
        res.status(500).json({ message: e });
    }
    
});

// Module export

module.exports = router;