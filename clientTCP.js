const net = require('net');
const port = 2050;
const host = '127.0.0.1';


const client = new net.Socket();
client.connect(port, host, function(){
    console.log('Connected');
    client.write("Hello From Client " + client.address().address);

    process.stdin.setEncoding('utf-8');

    process.stdin.on('data', (text) => {
        
        let separaciones = text.split(" ");
        
        switch(separaciones[0]) {
            case 'USUARIO':
                client.write(text);

            break;
            
            case 'PASSWORD':
                client.write(text);

            break;

            case 'REGISTRO':
                client.write(text);

            break;

            case "INICIAR-PARTIDA\n":
                client.write(text);

            break;
            
            case "SALIR\n":

                client.write(text);
            break;
                
            default:
                console.log("Introduzca alguna de las opciones permitidas\n" +
                "USUARIO usuario:\n" + "PASSWORD contraseña\n" +
                "REGISTRO -u usuario -p password:\n" + "INICIAR-PARTIDA:\n" +
                "DESCUBRIR letra, numero:\n" + "PONER-BANDERA letra, numero:\n" +
                "SALIR\n");
                
        }
    });
});
    
client.on('close', function() {
    console.log('Connection closed');
});

client.on('data', function(data) {
    console.log("Server Says : " + data);
});
    