//server.js is the first file to load in the backend and we created this file
const express = require("express"); //require is similar to import
const mongoose = require("mongoose"); //to get the whole mongoose library to access mongo db
const users = require("./routes/api/users");
const profile = require("./routes/api/profile");
const posts = require("./routes/api/posts");
const bodyParser = require("body-parser");
const passport = require("passport");

const app = express(); //create an instance of express to tell the routes
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const db = require("./config/keys").mongoURI;
mongoose
  .connect(db)
  .then(() => console.log("connected to db")) //'then' says if the previous statement is successfull then the  "then" gets executed"
  .catch(err => console.log(err)); //if the previous fails then catch gets executed

//passport middleware
app.use(passport.initialize());
//passport configuration
require('./config/passport')(passport);



app.get("/", (req, res) => res.send("hello world")); //when a user comes to home page, you get a request called "req" but we are not doing anything with req, instead we are responding back saying "hello"
app.use("/api/users", users); //get is the final destination,but we are using /test under users, so use "use" instead of get
app.use("/api/profile", profile);
app.use("/api/posts", posts);

const port = 5005;
app.listen(port, () => console.log(`Server is running on port ${port}`));
