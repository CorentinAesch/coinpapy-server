const router = require("express").Router();
const axios = require("axios");
const helper = require("../helpers/helpers.js");

const Asset = require("../models/Asset.model.js");

const { isAuthenticated } = require("../middleware/jwt.middleware");

router.get("/assets", isAuthenticated, async (req, res) => {

    const userId = req.payload._id;

    try {
        const assets = await Asset.find({ userId: userId }).populate('coin transactions');

        if (!assets) {
            res.status(500).json({ message: "No assets yet. Add a new transaction"})
        } else {
            console.log(assets)
            res.status(200).json(assets);
        }

    } catch (e) {
        res.status(500).json({ message: e });
    }

});

router.get("/assets/:assetId", isAuthenticated, async (req, res, next) => {
    
    const { assetId } = req.params;
    const userId = req.payload._id;

    try{
        const asset = await Asset.findOne({ _id:assetId, userId:userId}).populate('coin transactions userId');
        res.status(200).json(asset);
        
    } catch (e) {
        res.status(500).json({ message: e });
    }
}); 

module.exports = router;
