// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require("dotenv/config");

// ℹ️ Connects to the database
require("./db");

// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
const express = require("express");

const app = express();

// ℹ️ This function is getting exported from the config folder. It runs most pieces of middleware
require("./config")(app);

app.use((req,res,next) => {
    res.locals.connectedUser = req.session.user ? req.session.user : false;
    console.log(res.locals.connectedUser);
    next();
});

// 👇 Start handling routes here
// Contrary to the views version, all routes are controlled from the routes/index.js
const allRoutes = require("./routes/index.routes");
app.use("/", allRoutes);

const authRouter = require("./routes/auth.routes");
app.use("/", authRouter);

const coinRouter = require("./routes/coin.routes");
app.use("/", coinRouter);

const watchlistRouter = require("./routes/watchlist.routes");
app.use("/", watchlistRouter);

const assetRouter = require("./routes/assets.routes");
app.use("/", assetRouter);

const transactionRouter = require("./routes/transaction.routes");
app.use("/", transactionRouter);


/* const userRoutes = require("./routes/auth.routes");
app.use("/", userRoutes); */

// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require("./error-handling")(app);

module.exports = app;
