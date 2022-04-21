const router = require("express").Router();

/* GET home page */
router.get("/", (req, res, next) => {
  res.json("all good in here");
});

module.exports = router;
