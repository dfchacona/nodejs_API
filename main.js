var http = require('http');
var url = require('url');
var activities = require('./activities_module');

http.createServer(function (req, res) {
    var q = url.parse(req.url, true);
    if(q.pathname=="/activities/index"){
       activities.index(function(result){
        res.write(JSON.stringify(result));
        res.end()
       });
      }
}).listen(8080);