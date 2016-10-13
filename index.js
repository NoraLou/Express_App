var express = require('express');
var fortune = require('./lib/fortune.js');
var credentials = require('./credentials.js');


var app = express();

app.set('port', process.env.PORT || 3300);


// set up handlebars view engine
var handlebars = require('express-handlebars') .create({ defaultLayout:'main' });
    app.engine('handlebars', handlebars.engine);
    app.set('view engine', 'handlebars');

//before you declare routes add static middleware
//The static middleware has the same effect as creating a route for each static file you want to deliver that renders a file and returns it to the client. So let’s create an img subdirectory inside public, and put our logo.png file in there
app.use(express.static(__dirname + '/public'));

app.use(require('cookie-parser')(credentials.cookieSecret));
app.use(require('express-session')({
    resave: false,
    saveUninitialized: false,
    secret: credentials.cookieSecret,
}));


// middleware to detect test=1 in the querystring. It must appear before we define any routes in which we wish to use it:
app.use(function(req, res, next){
res.locals.showTests = app.get('env') !== 'production' &&
    req.query.test === '1';
    next();
});

app.get('/', function(req, res) {
  res.render('home');
});

app.get('/about', function(req, res) {
  res.render('about', {
    fortune: fortune.getFortune(),
    pageTestScript: '/qa/tests-about.js'
    });
});


// custom 404 page
app.use(function(req, res){ res.type('text/plain');
            res.status(404);
            res.render('404');
            //res.send('404 - Not Found');
});

// custom 500 page
app.use(function(err, req, res, next){ console.error(err.stack);
            res.status(500);
            res.render('500');
            //res.send('500 - Server Error');
});

app.listen(app.get('port'), function(){
console.log( 'Express started on http://localhost:' +
        app.get('port') + '; press Ctrl-C to terminate.' );
});


