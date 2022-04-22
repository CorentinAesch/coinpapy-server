const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const userSchema = new Schema(
  {
    email: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        required: 'Email address is required',
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email address']
    },

    firstName: String,
    lastName: String,

    profileImage :{
      type: String,
      default: ''
    },

    //darkmode:{type:Boolean, default: false},

    password: {
      type: String,
      required: 'Password is required',
    },

    reset: {type:Boolean, default: false},

    notifications: [{
      type: Schema.Types.ObjectId, 
      ref: 'Notification', 
    }],

    watchlist : [{
      type: Schema.Types.ObjectId, 
      ref: 'Favcoin',
    }] 

  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const User = model("User", userSchema);

module.exports = User;
