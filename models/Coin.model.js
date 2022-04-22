const { Schema, model } = require("mongoose");

const coinSchema = new Schema(
  { 
    
    id: { type: String, required: true , unique: true},
    name: String,
    symbol: String,
    image: {type: String, default: '/images/coin/default.jpg'},
    portfolio: { type: Schema.Types.ObjectId, ref: 'Portfolio' },
    current_price: Number,
    market_cap: Number,
    market_cap_rank: Number,
    fully_diluted_valuation: Number,
    total_volume: Number,
    price_change_percentage_24h: Number,
    total_supply: Number,
    circulating_supply: Number,
    ath: Number,
    ath_date: String,
    sparkline_in_7d: Object
  },
  {
    timestamps: true
  }
);

const Coin = model("Coin", coinSchema);

module.exports = Coin;