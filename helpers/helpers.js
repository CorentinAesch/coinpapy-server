const Asset = require("../models/Asset.model.js");

class Helper{
    async updateAssetAmount(asset){
        let total = asset.transactions.reduce((a, b) => a += b.transactionType === 'buy' ? b.amount : -b.amount,0);
        return await Asset.findOneAndUpdate({_id:asset.id},{amount:total});
    }
}

const helper = new Helper();

module.exports = helper;