const Net = require('net');

const port = 2050;
const host = 'localhost';

const client = new Net.Socket();
client.connect({port: port, host: host}, function() {
    console.log('TCP connection establised with the server.\n');
    //client.write(text);

    process.stdin.setEncoding('utf-8');
    
    process.stdin.on('data', (text) => {
        
        let separaciones = text.split(" ");
        switch(separaciones[0]) {
            case "USUARIO":
            //client.connect({port: port, host: host}, function() {
                //console.log('TCP connection establised with the server.\n');
                client.write(text);
                
            //});
            break;
            
            case "PASSWORD":
            //client.connect({port: port, host: host}, function() {
                //console.log('TCP connection establised with the server.\n');
                client.write(text);
                
           // });
            break;
            
            case "REGISTRO":
            //client.connect({port: port, host: host}, function() {
                //console.log('TCP connection establised with the server.\n');
                client.write(text);
                
                //});
                break;
                
                case "SALIR":
                //client.connect({port: port, host: host}, function() {
                    //console.log('TCP connection establised with the server.\n');
                    client.write(text);
                    //});
                    client.on('end', function() {
                        
                        console.log('Request an end to the TCP connection');
                    });
                break;
            
            default:
            console.log("Introduzca alguna de las opciones permitdas\n"+
            "USUARIO usuario:\n" + "PASSWORD contraseña:\n" +
            "REGISTRO -u usuario -p password:\n" + "INICIAR-PARTIDA:\n" + 
            "DESCUBRIR letra, numero:\n" + "PONER-BANDERA letra, numero:\n" +
            "SALIR\n");
        }
    });
    
    /*client.connect({ port: port, host: host }, function() {
        
        console.log('TCP connection established with the server.');
        client.write('Hello, server.');
    })*/; 
    
});
    client.on('data', function(chunk) {
        console.log(chunk.toString());
        
        //client.end();
    });
    