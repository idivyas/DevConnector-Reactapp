const express = require("express");
const router = express();

router.get("/test", (req, res) => res.json({ msg: "Posts works" }));

module.exports = router;
