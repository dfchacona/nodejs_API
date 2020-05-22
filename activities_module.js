var mysql = require('mysql');

exports.index = function (callback) {
  var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    database : 'api_db'
  });

  con.connect(function(err) {
    
      if (err) throw err;
      
  });

  con.query("SELECT * FROM activities", function (err, result, fields) {
    if (err) throw err;
    return callback(result);
  }) 

  
};




