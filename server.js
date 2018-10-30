const Net = require('net');
const bcrypt = require('bcrypt');
const server = new Net.Server();
const port = 2050;
const ControlMensaje = require("./ControlMensaje.js");

let User = require ('./apps/users/models.js').User;
let BCRYPT_SALT_ROUNDS = 12;

let controlmensaje = new ControlMensaje();
let counter = 0;
let sockets = {};


server.on('connection', function(socket) {
    console.log('A new connection has been established.');
    
    //  socket.write('Hello, client.');
    
    socket.on('data', function(text) {
        let separaciones = text.toString().split(" ");
        console.log("Socket id: " + socket.id);
        
        switch(separaciones[0]) {
            case "USUARIO":
            console.log(separaciones[1]);
            let correcionJugador = separaciones[1].split("\n");
            
            console.log(controlmensaje.getJugador1());
            console.log(controlmensaje.getJugador1() == 0);
            
            User.find({username: correcionJugador[0]}, function(err, user) {
                console.log(user.length);
                if(err) {
                    console.log(String(err));
                }
                if(user.length === 1) {
                    console.log("Usuario encontrado.", user);
                    socket.write("Usuario encontrado:\n" +
                    "Introduzca la contraseña: \n");
                    controlmensaje.setJugador1(correcionJugador[0]);
                    
                }else {
                    console.log("Usuario no encontrado.");
                    socket.write("Usuario no registrado\n");
                }    
            });
            
            break;
            
            case "PASSWORD":
            let correcionPassword = separaciones[1].split("\n");

            User.getUserByUsername(controlmensaje.getUsuario())
                .then(function(user) {
                    return bcrypt.compare(correcionPassword, User.password);
                })
                .then(function(samePassword) {
                    if(!samePassword) {
                        sock.write("Error ")
                    }
                })
            
            console.log(correcionPassword[0]);
            break;
            
            case "REGISTRO":
            if (separaciones[1] === "-u" && separaciones [3] === "-p") {
                console.log(`Data received from client: ${text.toString()}`);
                    controlmensaje.setUsuario(separaciones[2]);
                    let correcionPass = separaciones[4].split("\n");
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
                            socket.write("El nombre de usuario ya existe.\n");
                            
                        }else {
                            console.log("Usuario diponible.");
                            let usuarioNuevo = new User({
                                username: controlmensaje.getUsuario(),
                                password: controlmensaje.getPassword()
                            });
                            bcrypt.hash(usuarioNuevo.password, BCRYPT_SALT_ROUNDS)
                            .then(function(hashedPassword) {
                                usuarioNuevo.password = hashedPassword;
                                
                                usuarioNuevo.save(function(err) {
                                    if(err) throw err;
                                    
                                    console.log("Usuario creado correctamente.");
                                    socket.write("Usuario diponible:\n" +
                                    "Usuario creado correctamente.\n");
                                })
                            })
                            .catch(function(err) {
                                console.log("Error registrando usuario: ");
                                socket.write("Error registrando usuario: \n");
                                console.log(err);
                                next();
                            });
                        }
                    });
                }   
                break;

                case "SALIR":
                    socket.on('end', function() {
                        console.log('Closing conection with the client');
                    });
                
                break;
            }
        });
        
    
    socket.on('error', function(err) {
        console.log(`Error: ${err}`);
    });
}); 

server.listen(port, function () {
    console.log(`Server listening for connection request on socket localhost:${port}`);
});