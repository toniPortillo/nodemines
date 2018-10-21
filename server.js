const Net = require('net');
const bcrypt = require('bcrypt');
const server = new Net.Server();
const port = 2050;
let User = require ('./apps/users/models.js').User;


class ControlMensaje {
    constructor (usuario, password, mensaje) {
        this.usuario = usuario;
        this.password = password;
        this.mensaje = mensaje;
    };

    getUsuario() {
        return this.usuario;
    };

    getPassword() {
        return this.password;
    };
    
    getMensaje() {
        return this.mensaje;
    };

    setUsuario(usuario) {
        this.usuario =  usuario;
    };

    setPassword(password) {
        this.password = password;
    };

    setMensaje(mensaje) {
        this.mensaje = mensaje;
    };
};

let controlmensaje = new ControlMensaje(" ", " ", " ");

server.listen(port, function () {
    console.log(`Server listening for connection request on socket localhost:${port}`);
});

server.on('connection', function(socket) {
    console.log('A new connection has been established.');
    
    socket.write('Hello, client.');

    socket.on('data', function(text) {
        let separaciones = text.toString().split(" ");
        if (separaciones[0] === "-u" && separaciones [2] === "-p") {
            console.log(`Data received from client: ${text.toString()}`);
            controlmensaje.setUsuario(separaciones[1]);
            let correcionPass = separaciones[3].split("\n");
            controlmensaje.setPassword(correcionPass[0]);
            console.log(controlmensaje.getUsuario());   
            console.log(controlmensaje.getPassword());
            
            User.find({username: controlmensaje.getUsuario()}, function(err, user) {
                console.log(user.length);
                if(err) {
                    console.log(String(err));
                }
                if(user.length === 1) {
                    console.log("Usuario encontrado.", user);
                    
                }else {
                    console.log("Usuario diponible.");
                    let usuarioNuevo = new User({
                        username: controlmensaje.getUsuario(),
                        password: controlmensaje.getPassword()
                    });
                    usuarioNuevo.save(function(err) {
                        if(err) throw err;
                        
                        console.log("Usuario creado correctamente.")
                    })
                }
            });
        }

    });

    socket.on('end', function() {
        console.log('Closing conection with the client');
    });

    socket.on('error', function(err) {
        console.log('Error: ${err}');
    });
}); 