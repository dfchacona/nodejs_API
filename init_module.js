var mysql = require('mysql');
var url = require('url');
var http = require('http');
var validator = require('validator');

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
    var valid = true;
    var err_log = "";
    trimmed_name=q.name.replace(/\s/g, "");
    if(validator.default.isEmpty(trimmed_name) || validator.default.isEmpty(q.salary)){
        // res.writeHead(400, {'Content-Type': 'text'});
        err_log += 'fill both params\n';
        valid=false;
    }else{
    if(!validator.default.isAlpha(trimmed_name,'en-US')){
        err_log += 'name must be text\n';
        valid=false;
    }
    if(!validator.default.isNumeric(q.salary,'en-US')){
        err_log +='salary must be numeric';
        valid=false;
    }}
    
    // INSERT INTO `activities` VALUES (1,'architect',1000)
    if(valid){
    var sql = "INSERT INTO activities (name, salary) VALUES ('"+q.name+"', '"+q.salary+"')";
    con.query(sql, function (err, result) {
        if (err) throw err;

      });
      res.writeHead(200, {'Content-Type': 'text/html'});
      res.write("name: "+q.name+", salary:"+q.salary);
      res.end();
    }else{
        res.writeHead(400, {'Content-Type': 'text/html'});
        res.write(err_log);
        res.end();
    }
    
  }
  
  
}).listen(8080); //the server object listens on port 8080



