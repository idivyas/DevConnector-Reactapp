const jwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt=require('passport-jwt').ExtractJwt;
const mongoose=require('mongoose');
const User=mongoose.model('Users');
const keys=require('./keys');

const opts={};
opts.jwtFromRequest=ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey=keys.secretORKey;

module.exports=passport => {
    passport.use(new jwtStrategy(opts, (jwt_payload,done)=>{
        console.log(jwt_payload);
    }));
}