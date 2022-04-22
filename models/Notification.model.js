const { Schema, model } = require("mongoose");

const notificationSchema = new Schema(
    {
        read: { 
            type: Boolean, 
            default: false 
        },

        coin: { 
            type: Schema.Types.ObjectId, 
            ref: 'Coin' 
        },

        userId: {type: 
            Schema.Types.ObjectId, 
            ref: 'User'
        },

    },
    {
      timestamps: true,
    }
);

const Notification = model("Notification", notificationSchema);

module.exports = Notification;