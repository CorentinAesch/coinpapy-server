const { Schema, model } = require("mongoose");

const assetSchema = new Schema(
    {
      coin: { 
        type: Schema.Types.ObjectId, 
        ref: 'Coin' 
      },

      amount: Number,

      userId: {type: 
        Schema.Types.ObjectId, 
        ref: 'User'
      },

      transactions: [{ 
        type: Schema.Types.ObjectId, 
        ref: 'Transaction' 
      }],

      note: String,
    },
    {
      timestamps: true,
    }
);

const Asset = model("Asset", assetSchema);

module.exports = Asset;