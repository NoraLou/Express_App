var express = require('express');
var app = express();
app.set('port', process.env.PORT || 3300);


// set up handlebars view engine
var handlebars = require('express-handlebars') .create({ defaultLayout:'main' });
    app.engine('handlebars', handlebars.engine);
    app.set('view engine', 'handlebars');

//before you declare routes add static middleware
//The static middleware has the same effect as creating a route for each static file you want to deliver that renders a file and returns it to the client. So let’s create an img subdirectory inside public, and put our logo.png file in there
app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
  res.render('home');
});

app.get('/about', function(req, res) {
  res.render('about');
})

// custom 404 page
app.use(function(req, res){ res.type('text/plain');
            res.status(404);
            res.send('404 - Not Found');
});

// custom 500 page
app.use(function(err, req, res, next){ console.error(err.stack);
            res.type('text/plain');
            res.status(500);
            res.send('500 - Server Error');
});

app.listen(app.get('port'), function(){
console.log( 'Express started on http://localhost:' +
        app.get('port') + '; press Ctrl-C to terminate.' );
});
