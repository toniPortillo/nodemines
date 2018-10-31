const Net = require('net');
const bcrypt = require('bcrypt');
const server = Net.createServer();

const port = 2050;
const host = '127.0.0.1';
const ControlMensaje = require('./ControlMensaje.js');
const ControlJugador = require('./ControlJugador.js');

let User = require('./apps/users/models.js').User;
let BCRYPT_SALT_ROUNDS = 12;

server.listen(port, host, () => {
    console.log("TCP Server is running on port " + port + ".");

});

let sockets = [];
let logueados = 0;
let controljugador = new ControlJugador();

server.on('connection', function(sock){
    console.log("CONNECTED " + sock.remoteAddress + ':' + sock.remotePort);
    sockets.push(sock);
    let controlmensaje = new ControlMensaje();
    
    sockets.forEach(function(sock, index, array) {
        sock.write(sock.remoteAddress + ':' + sock.remotePort + " Nuevo usuario conectado " + "\n");
        sock.write("Numero de usuarios conectados: " + sockets.length.toString());
    });

    sock.on('data', function(text) {
        console.log("DATA " + sock.remoteAddress + ':' + sock.remotePort);

        let separaciones = text.toString().split(" ");
        console.log(controlmensaje.getUsuario());
        
        switch(separaciones[0]) {
            case 'USUARIO':
                let correcionJugador = separaciones[1].split('\n');

                User.find({username: correcionJugador[0]}, function(err, user) {

                    if(err) {
                        console.log(String(err));
                    }
                    if(user.length === 1) {
                        console.log("Usuario encontrado.", user);
                        sock.write("Usuario encontrado:\n" +
                        "Introduzca la contraseña: \n");
                        controlmensaje.setUsuario(correcionJugador[0]);
                        controlmensaje.estadoConectado();
                    }else {
                        console.log("Usuario no encontrado.");
                        sock.write("Usuario no registrado\n");
                    }
                });
            break;

            case 'PASSWORD':
                let correcionPassword = separaciones[1].split('\n');

                User.find({username: controlmensaje.getUsuario()}, function(err, user) {
               
                    if(err) {
                        console.log(String(err));
                    }
                    if(user.length === 1) {
                        console.log("Entro donde las claves");
                        bcrypt.compare(correcionPassword[0], user[0].password, function(err, res) {
                            if(err) throw err;
                            
                            if(res){
                                controlmensaje.setPassword(user[0].password);
                                console.log("Contraseña correcta, usuario logueado.");
                                sock.write("Contraseña correcta, usuario logueado.");
                                controlmensaje.estadoConectado();
                                logueados = logueados + 1;
                                sockets.forEach(function(sock) {
                                    sock.write("Usuario: " + controlmensaje.getUsuario() + " logueado.\n");
                                    if(logueados === 2) {
                                        sock.write("2 jugadores logueados, se puede INICIAR-PARTIDA");
                                    }else {
                                        sock.write("Usuarios logueados: " + logueados);
                                    }
                                });
                            }else {
                                console.log("Contraseña incorrecta, vuelva a introducirla");
                            }
                        });
                    
                    }else {
                        console.log("Introduzca primero el nombre de usuario.\n");
                        sock.write("Introduzca primero el nombre de usuario.\n");
                        console.log("Esta password no corresponde a ningun usuario");
                    }
                });

            break;

            case 'REGISTRO':
                if(separaciones[1] === "-u" && separaciones[3] === "-p") {
                    controlmensaje.setUsuario(separaciones[2]);
                    let correcionPass = separaciones[4].split('\n');
                    controlmensaje.setPassword(correcionPass[0]);

                    User.find({username: controlmensaje.getUsuario()}, function(err, user) {
                        if(err) {
                            console.log(String(err));
                        }
                        if(user.length === 1) {
                            console.log("Usuario encontrado.", user);
                            sock.write("El nombre de usuario ya existe.\n");
                        
                        }else {
                            console.log("Usuario disponible.");
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
                                    sock.write("Usuario disponible:\n" +
                                    "Usuario creado correctamente.\n");
                                })
                            })
                            .catch(function(err) {
                                console.log("Error registrando usuario: ");
                                sock.write("Error registrando usuario: \n");
                                console.log(err);
                                next();
                            });
                        }
                    });
                }
            
            break;

            case "INICIAR-PARTIDA\n":
                if(logueados >= 2) {
                    console.log(controljugador.getJugador1().length);

                    if(controljugador.getJugador1().length === 0){
                        controljugador.setJugador1(controlmensaje.getUsuario());
                        controljugador.setPassword1(controlmensaje.getPassword());
                    
                    }else if (controljugador.getJugador2().length === 0) {
                        controljugador.setJugador2(controlmensaje.getUsuario());
                        controljugador.setPassword2(controlmensaje.getPassword());
                    
                    }else {
                        console.log("No hay hueco para mas jugadores.\n");
                    }    
                
                }else {
                    console.log("Jugadores logueados: " + sockets.length + "\n"
                    + "Necesarios 2 jugadores.");
                
                }
                console.log(separaciones[0] + " AAAAAA jugar");

            break;

            case "DESCUBRIR":

            break;

            case "PONER-BANDERA":

            break;

            case "SALIR\n":
                sock.write("Cerrando conexion.\n");
                if(logueados === 0) {
                    logueados = 0;
                    console.log("Usuario desconectado, quedan logueados: " + logueados);
                    sock.write("Usuario desconectado, quedan logueados: " + logueados);

                }else {
                    logueados = logueados - 1;
                    console.log("Usuario desconectado, quedan logueados: " + logueados);
                    sock.write("Usuario desconectado, quedan logueados: " + logueados);
                }
                
                sock.end();
            break;
        }
    });

    sock.on('error', function(err) {
        console.log(`Error: ${err}`);
    });

    sock.on('close', function(data) {
        let index = sockets.findIndex(function(o) {
            return o.remoteAddress === sock.remoteAddress && o.remotePort === sock.remotePort;

        });
        
        if(index !== -1) sockets.splice(index, 1);
        console.log('CLOSED: ' + sock.remoteAddress + ' ' + sock.remotePort);
        
    });
});
