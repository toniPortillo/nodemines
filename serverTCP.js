const Net = require('net');
const bcrypt = require('bcrypt');
const server = Net.createServer();

const port = 2050;
const host = '127.0.0.1';
const ControlMensaje = require('./ControlMensaje.js');

let User = require('./apps/users/models.js').User;
let BCRYPT_SALT_ROUNDS = 12;

server.listen(port, host, () => {
    console.log("TCP Server is running on port " + port + ".");

});

let sockets = [];

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
                                console.log("Contraseña correcta, usuario logueado.")
                                console.log(controlmensaje.getUsuario());
                                console.log(controlmensaje.getPassword());
                                sock.write("Contraseña correcta, usuario logueado.")
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
        }
    });

    sock.on('error', function(err) {
        console.log(`Error: ${err}`);
    });

    sock.on('close', function(data) {
        let index = sockets.findIndex(function(o) {
            return o.remoteAddress === sock.remoteAddress && o.remotePort === sock.remotePort;

        })
        console.log(index);
        if(index !== -1) sockets.splice(index, 1);
        console.log('CLOSED: ' + sock.remoteAddress + ' ' + sock.remotePort);
    });
});