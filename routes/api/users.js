const express = require("express");
const router = express(); //or express.Router() to import just Routing rather than the whole library

router.get("/test", (req, res) => res.send("hello user!"));
//router.get("/register", (req, res) => res.redirect("/api/register"));

module.exports = router;
