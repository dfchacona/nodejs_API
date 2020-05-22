var mysql = require('mysql');

exports.index = function () {
  var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    database : 'api_db'
  });

  con.connect(function(err) {
      var response=""
      if (err) throw err;
      console.log("Connected!");
      con.query("SELECT * FROM activities", function (err, result, fields) {
        if (err) throw err;
        
        response=JSON.stringify(result);
        
      });    
      return response;
  });

  
};




