// Import Modules
var express = require('express'),
    http = require('http'),
    path = require('path'),
    logger = require('morgan'),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    methodOverride = require('method-override'),
    expressSession = require('express-session'),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    app = express();

// CONFIGURE DB
var SALT_WORK_FACTOR = 10;

var dbConfig = require('./config/dbConfig');
mongoose.connect('localhost', 'test');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback() {
  console.log('Connected to DB');
});

var User = require('./db/models/user');

var user = new User({ username: 'paul', email: 'paul@inder.com', password: 'secret' });
user.save(function(err) {
  if(err) {
    console.log(err);
  } else {
    console.log('user: ' + user.username + " saved.");
  }
});


// CONFIGURE PASSPORT
passport.use(new LocalStrategy( function(email, password, done) {
  User.findOne({ email: email }, function(err, user) {
    if (err) { return done(err); }
    if (!user) { return done(null, false, { message: 'Unknown user ' + email }); }
    user.comparePassword(password, function(err, isMatch) {
      if (err) return done(err);
      if(isMatch) {
        return done(null, user);
      } else {
        return done(null, false, { message: 'Invalid password' });
      }
    });
  });
}));

// Serialized and deserialized methods when got from session
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

// Define a middleware function to be used for every secured route
var auth = function(req, res, next){
  if (!req.isAuthenticated())
  	res.sendStatus(401);
  else
  	next();
};

// Configure Express
var appConfig = require('./config/appConfig');
app.set('port', appConfig.port);
app.set('ipaddr', appConfig.ipaddr);

// Configure middleware
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(logger('dev'));
app.use(methodOverride());
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(expressSession({secret: 'mySecretKey'}));
app.use(passport.initialize()); // Add passport initialization
app.use(passport.session());    // Add passport initialization
app.use(express.static(path.join(__dirname, 'public')));


// Set routes
var routes = require('./routes/pages');
app.get('/', routes.index);
app.get('/partials/:name', routes.partials)

// Route to test if the user is logged in or not
app.get('/loggedin', function(req, res) {
  res.send(req.isAuthenticated() ? req.user : '0');
});
// Route to log in
app.post('/login', passport.authenticate('local'), function(req, res) {
  res.send(req.user);
});
// Route to log out ---- should this be a post?
app.post('/logout', function(req, res){
  req.logOut();
  res.redirect("/");
});


// API routes
app.all('/api', auth);
app.get('/api/user', function(req, res){
  res.send({name:"paul"})
});


// Start server
http.createServer(app).listen(app.get('port'), app.get('ipaddr'), function(){
  console.log('Express server listening on  IP: ' + app.get('ipaddr') + ' and port ' + app.get('port'));
});
