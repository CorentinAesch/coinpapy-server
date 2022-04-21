const { Schema, model } = require("mongoose");

const transactionSchema = new Schema(
  {
    price: { 
      type: Number, 
      required:true 
    },

    currency: {
      type: String, 
      required:true 
    },

    asset: {
      type: Schema.Types.ObjectId, 
      ref: 'Asset'
    },

    amount: { 
      type: Number, 
      required: true 
    },

    total: Number,

    transactionType: { 
      type: String, 
      enum: ['buy', 'sell', 'transfer in', 'transfer out'] 
    },

    note: String,
    
    created: { type: Date, default: Date.now()},
  },
  {
    timestamps: true
  }
);

const Transaction = model("Transaction", transactionSchema);

module.exports = Transaction;
