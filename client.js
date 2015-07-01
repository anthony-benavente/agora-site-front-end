var express    = require("express");
var morgan     = require("morgan");
var app        = express();

var port = process.env.PORT || 3001;

app.use(morgan("dev"));
app.use(express.static("./app"));
app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    return next();
});

app.get("/", function(req, res) {
    res.sendFile("./app/index.html");
});

// Start Server
var server = app.listen(port, function (err) {
    if (err) {
        console.log(err);
    } else {
        var host = server.address().address;
        var port = server.address().port;
        console.log( "Server listening at http://%s:%s", host, port);
    }
});
