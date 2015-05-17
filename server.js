// Import Modules
var express = require('express'),
    http = require('http'),
    path = require('path'),
    logger = require('morgan'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    methodOverride = require('method-override'),
    expressSession = require('express-session'),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    app = express();

//==================================================================
// Define the strategy to be used by PassportJS
passport.use(new LocalStrategy(
  function(username, password, done) {
    if (username === "admin" && password === "admin") // stupid example
      return done(null, {name: "admin"});

    return done(null, false, { message: 'Incorrect username.' });
  }
));

// Serialized and deserialized methods when got from session
passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});

// Define a middleware function to be used for every secured routes
var auth = function(req, res, next){
  if (!req.isAuthenticated())
  	res.sendStatus(401);
  else
  	next();
};
//==================================================================


// Configure Express and db
var appConfig = require('./config/appConfig');
var dbConfig = require('./config/dbConfig');
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
  console.log(req.isAuthenticated())
  res.send(req.isAuthenticated() ? req.user : '0');
});
// Route to log in
app.post('/login', passport.authenticate('local'), function(req, res) {
  res.send(req.user);
});
// Route to log out
app.post('/logout', function(req, res){
  req.logOut();
  res.send(200);
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
