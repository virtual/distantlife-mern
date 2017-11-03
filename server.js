const express = require('express');
const app = express();
const mongoose = require('mongoose');
const uriUtil = require('mongodb-uri');
const bodyParser = require('body-parser');

const config = require("./config");
const User = require('./models/User');

var session = require('express-session');
var hash = require('password-hash');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

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

// body parser used any time form data is submitted on site
app.use(bodyParser.json({
  type: "application/json"
}));
app.use(bodyParser.urlencoded({
  extended: false
}));
// passport
app.use(session({ secret: 'happy halloween', resave: false, saveUninitialized: false}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(
  {username:'email', password:'password'}, 
  (email, password, done) => {
    User.findOne({ email: email }, (error, user) => {
      console.log('checking hash')
      if (hash.verify(password, user.password)) {
        console.log("verified!")
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

passport.deserializeUser((id, done) => {
  // console.log(`id: ${id}`);
  User.findById(id)
    .then(user => {
      done(null, user);
    })
    .catch(error => {
      console.log(`Error: ${error}`);
    });
});
// end passport


app.get('/user', (req, res)=>{
  let id = '59f5f732075a4811582785b1';
  //if (req.user){
    User.findById(id).exec((err, user)=>{
      console.log({success: true,
        user: user})
      res.json({success: true,
        user: user})
    })
  // } else {
  //   res.json({err: {msg:'user not signed in', code:1}});
  // }
});

app.post('/logout', (req, res) => {
  if (req.user) {
    req.logOut();
    res.json('user logged out')
  } else {
    res.json({ err: { msg: "you ain't logged in", code: 1 } });
  }
})

app.post('/login', function (req, res, next) {
  console.log(req.body);
  passport.authenticate("local", function(err, user){
    if (err) {
      res.json({ found: false, success: false, err: true, message: err}); // can also send res.status
    } else if (user) {
      // write code to send user to dashboard - passport 
      req.logIn(user, (err)=>{
        //console.log(user);
        // gets a session working
        if (err) {
          res.json({found: false, success: false, message: err});
        } else {
          res.json({found: true, success: true, message: "Successfully logged in",
            user: user
          });
        }
      })
    } else {
      res.json({found: false, success: false, message: "Password and user do not match!"});      
    }
  })(req,res,next); 
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