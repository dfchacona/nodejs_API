var mysql = require('mysql');
var http = require('http');
var csv = require('csv-parser')
var url = require('url');
var fs = require('fs');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  database : 'api_db'
});


http.createServer(function (req, res) {
    var results = [];
    var bool_validate = true;
    var keep_cheking = true;
    var mensaje = {
            mensaje: "",
            linea: 1,
            nivel: ""
    }
    var q = url.parse(req.url, true);
    con.connect(function(err) {
        if (err) throw err;
      });

    //   FILE VALIDATE ENDPOINT
      if(q.pathname=="/Upload/fileValidate"){
        mensajes = 
        q = url.parse(req.url, true).query;
        fs.createReadStream('resources/'+q.file)
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', () => {
            console.log(results)
            for (let index = 0; index < results.length; index++) {
                const element = results[index];
                // CRITERIO 1
                var sql = 'SELECT * FROM employees WHERE document = ?';
                con.query(sql, [element.Documento], function (err, result) {
                    if (err) throw err;
                    if(result.length > 0){
                        bool_validate = "false" 
                        mensaje.mensaje="Documento ya existe";
                        mensaje.linea = index+1;
                        mensaje.nivel = "ERROR";
                        var response = {
                            resultado: bool_validate,
                            mensajes: mensaje,
                        };
                        keep_cheking=false;
                        res.write(JSON.stringify(response));
                        res.end();   
                    }
                    if(keep_cheking){
                        // CRITERIO 2
                        var sql = 'SELECT * FROM activities WHERE document = ?';
                        con.query(sql, [element.Documento], function (err, result) {
                        
                        });
                    }            
                  });
                
                
                
            }
            
        });
        
        // ESQUELETO DE RESPUESTA
        
        
      }  
   
}).listen(8080);


