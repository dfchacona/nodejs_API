var mysql = require('mysql');
var url = require('url');
var http = require('http');

//create a server object:
http.createServer(function (req, res) {
  var q = url.parse(req.url, true);
  var con = mysql.createConnection({
        host: "localhost",
        user: "root",
        database : 'api_db'
      });


  con.connect(function(err) {
        if (err) throw err;
        console.log("Connected!");
  });


  if(q.pathname=="/activities/index"){
    con.query("SELECT * FROM activities", function (err, result, fields) {
        if (err) throw err;
        
        var string=JSON.stringify(result);
        res.write(string);
        res.end();
      });
  }
  
  
}).listen(8080); //the server object listens on port 8080



