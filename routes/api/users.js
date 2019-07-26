const keys = require("../../config/keys");
const express = require("express");
const router = express(); //or express.Router() to import just Routing rather than the whole library
const UserModel = require("../../models/User");
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken"); //It is used to create token
const passport = require("passport");//(JWT and Passport)are used to generate token and create payload to provide authorization in the application 

//router.get("/test", (req, res) => res.send("hello user!"));  //This is for testing
router.post("/register", (req, res) => {
  UserModel.findOne({ email: req.body.email }) //email in key should match the model name or db table name col value, email in value comes from html text box value
    .then(user => {
      //output from previous statement is stored in user variable
      if (user) {
        return res.status(400).json({
          email: "Email already exists"
        });
      } else {
        const avatar = gravatar.url(req.body.email, {
          s: "200",
          r: "pg",
          d: "mm"
        });

        const newUser = new UserModel({
          name: req.body.name,
          email: req.body.email,
          password: req.body.password,
          avatar: avatar // or just avatar if both names are same
        });

        bcrypt.genSalt(10, (err, salt) => {
          //its a callback function, see the signature of gensalt function
          if (err) throw err; //return error if salting fails
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            //else if salting succeeded, generate hash for the password
            if (err) throw err; // return error if hashing fails
            newUser.password = hash;
            newUser
              .save()
              .then(user => res.json(user))
              .catch(err => console.log(err));
          });
        });
      }
    })
    .catch(err => console.log(err));
});

router.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  UserModel.findOne({ email: email })
    .then(user => {
      if (!user) {
        return res.status(400).json({
          email: "User not found"
        });
      }

      //check password
      bcrypt.compare(password, user.password).then(isMatch => {
        if (isMatch) {
          //return res.json({ msg: "success" });
          //Create token
          const payload = {
            //payload variable is created in a way that it is unique to the user
            id: user.id,
            name: user.name,
            avatar: user.avatar
          };
          //sign a token
          jwt.sign(
            payload,
            keys.secretORKey,
            { expiresIn: 3600 },
            (err, token) => {
              if (err) throw err;
              return res.json({
                success: true,
                token: "Bearer " + token
              });
            }
          );
        } else {
          return res.status(400).json({
            password: "Password is incorrect"
          });
        }
      });
    })
    .catch(err => console.log(err));
});

router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({ msg: "Success" });
  }
);

module.exports = router;
