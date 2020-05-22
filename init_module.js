var mysql = require('mysql');
var http = require('http');
var csv = require('csv-parser')
var url = require('url');
var fs = require('fs');


http.createServer(function (req, res) {
    var con = mysql.createConnection({
        host: "localhost",
        user: "root",
        database : 'api_db'
      });

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
        mensajes = [];
        keep_cheking=true;
        q = url.parse(req.url, true).query;
        fs.createReadStream('resources/'+q.file)
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', () => {
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
                        var sql = 'SELECT * FROM activities WHERE name = ?';
                        con.query(sql, [element.Actividad], function (err, result) {
                            if(result.length == 0){
                                bool_validate = "false" 
                                mensaje.mensaje="Actividad no existe";
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
                            // CRITERIO 3
                            var sql = 'SELECT salary FROM activities WHERE name = ? AND salary >= ?';
                            con.query(sql, [element.Actividad,parseInt(element['Aspiracion salarial'])], function (err, result) {
                            if( result.length == 0){
                                bool_validate = "false" 
                                mensaje.mensaje="Sobrepasa el salario destinado para esta actividad";
                                mensaje.linea = index+1;
                                mensaje.nivel = "ERROR";
                                var response = {
                                    resultado: bool_validate,
                                    mensajes: mensaje,
                                };
                                keep_cheking=false;
                                res.write(JSON.stringify(response));
                                res.end();   
                            }else{
                                keep_cheking=true;
                            }
                            // SUCCESS
                            if(keep_cheking && index==results.length-1){
                                bool_validate = "true"
                                var response = {
                                    resultado: bool_validate,
                                    mensajes: [],
                                }; 
                                res.write(JSON.stringify(response));
                                res.end();   
                            }
                            });
                        }
                        });
                    }            
                  });
                
                
                
            }
            
        });
        
      }  
   
}).listen(8080);


