const express = require('express');
const app = express();
const mongoose = require('mongoose');
const uriUtil = require('mongodb-uri');
const bodyParser = require('body-parser');

const config = require("./config");
const User = require('./models/User');

// connect to mLab
let mongodbUri = "mongodb://"+config.mlab.user+":"+config.mlab.password+"@ds241025.mlab.com:41025/distantlife";
var mongooseUri = uriUtil.formatMongoose(mongodbUri);
var options = {
  server: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000} },
  replset: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000} }
};
mongoose.connect(mongooseUri, options);
var db = mongoose.connection; 
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", () => {
  console.log("connected to db");
});

// passport
var session = require('express-session');
var hash = require('password-hash');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
app.use(bodyParser.json({
  type: "application/json"
}));
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(session({ secret: 'happy halloween'}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(
  {email:'username', password:'password'}, 
  (email, password, done) => {
    User.findOne({ email: email }, (error, user) => {
      if (hash.verify(password, user.password)) {
        done(null, user);
      } else if (user || !error) {
        done(error, null);
      } else {
        done(error, null);
      }
    });
  })
);

passport.serializeUser(function(user, done) {
  done(null, user._id);
});

passport.deserializeUser(function(id, done){
  User.findById(id, function(err, user) {
    done(err, user);
  });
});
// end passport


app.get('/user', (req, res)=>{
  if (req.user){
    User.findById(req.user._id).exec((err, user)=>{
      res.json(user)
    })
  } else {
    res.json({err: {msg:'user not signed in', code:1}});
  }
});

app.post('/logout', (req, res) => {
  if (req.user) {
    req.logOut();
    res.json('user logged out')
  } else {
    res.json({ err: { msg: "you ain't logged in", code: 1 } });
  }
})

app.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user) => {
    if (err) {
      console.log(err);
    }
    req.logIn(user, function (error) {
      if (error) return next(error);
      res.json(user);
    });
  })(req, res, next);
});

app.post("/signup", (req, res, next) => {
  var user = new User();
  user.firstName = req.body.firstName;
  user.lastName = req.body.lastName;
  user.email = req.body.email;
  user.password = req.body.password; 
 
  User.findOne({
    email: user.email
  },  (err, foundUser)=> { // changed to arrow notation to ref user
    if (err) {
      res.json({
        found: false,
        message: err,
        success: false
      });
    } else {
      
      console.log(user);
      user.save((error, userReturned) => {
        if (error) {
          console.log(error);
          next(error);
        } else {
          //res.json(userReturned);
          res.json({
            userReturned: userReturned,
            found: true,
            message: "Success",
            success: true
          });
        //this.props.history.push("/");
        }
      });
    }
  });
});








app.listen(5000, ()=>{
  console.log("Listening on port 5000")
})