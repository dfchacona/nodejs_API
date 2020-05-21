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

//   ENDPOINT INDEX
  if(q.pathname=="/activities/index"){
    con.query("SELECT * FROM activities", function (err, result, fields) {
        if (err) throw err;
        
        var string=JSON.stringify(result);
        res.write(string);
        res.end();
      });
  }


//   ENDPOINT ADD
  if(q.pathname=="/activities/add"){
    var q = url.parse(req.url, true).query;

    // INSERT INTO `activities` VALUES (1,'architect',1000)
    var sql = "INSERT INTO activities (name, salary) VALUES ('"+q.name+"', '"+q.salary+"')";
    con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("Record inserted");
        res.write("name: "+q.name+", salary:"+q.salary);
        res.end();
      });
  }
  
  
}).listen(8080); //the server object listens on port 8080



