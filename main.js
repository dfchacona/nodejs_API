var http = require('http');
var url = require('url');
var activities = require('./activities_module');

http.createServer(function (req, res) {
    var q = url.parse(req.url, true);
    if(q.pathname=="/activities/index"){
        res.writeHead(200, {'Content-Type': 'text/JSON'});
        res.write(""+activities.index());
        res.end();
      }
}).listen(8080);