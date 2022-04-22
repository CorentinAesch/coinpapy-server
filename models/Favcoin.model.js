const { Schema, model } = require("mongoose");

const favcoinSchema = new Schema(
    {
      coin: { 
        type: Schema.Types.ObjectId, 
        ref: 'Coin' 
      },

      variationAlert: {
        type: Number,
        enum: [2, 5, 10, 20],
        default: 10
      },
   
      priceAlert: [Number],

    },
    {
      timestamps: true,
    }
);

const Favcoin = model("Favcoin", favcoinSchema);

module.exports = Favcoin;